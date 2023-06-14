import { NextRequest, NextResponse } from "next/server";

import {
  loadAll as loadAllDevices,
  load,
  loadDate,
} from "@/features/secrets/services/redis/load";

import { EncryptedToken } from "@/features/secrets/types/EncryptedToken";
import { decrypt } from "@/features/secrets/utils/encryption";
import { fetchSleepData } from "@/features/sleep-data/services/oura/get-sleep";
import { uploadSleepDataToWS } from "@/features/sleep-data/services/w3bstream/client";
import { SleepData, SleepDataRaw } from "@/app/types";
import { storeString } from "@/features/secrets/services/redis/store";

export async function POST(req: NextRequest) {
  try {
    const ids = await fetchDeviceIds();
    await Promise.all(ids.map((id) => processDevice(id)));
    return NextResponse.json({ success: true, ids });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

async function fetchDeviceIds(): Promise<string[]> {
  const tokens = await loadAllDevices("token");
  return tokens.map((t) => t.split(":")[1]);
}

async function processDevice(deviceId: string) {
  try {
    const token = await getToken(deviceId);
    const lastFetchDate = await getLastFetchDate(deviceId);
    const rawData = await fetchSleepData(token, lastFetchDate || undefined);
    const processedData = processData(rawData);
    await uploadSleepDataToWS(deviceId, processedData);
    await updateLastFetchDate(deviceId, rawData);
  } catch (error) {
    console.log(error);
  }
}

async function getToken(deviceId: string): Promise<string> {
  const encryptedToken = await load("token:" + deviceId);
  const decryptedToken = decrypt(encryptedToken as unknown as EncryptedToken);
  return decryptedToken;
}

async function getLastFetchDate(deviceId: string): Promise<string> {
  const date = await loadDate<string | null>("sleep:" + deviceId);
  if (date === null) {
    const today = new Date();
    today.setDate(today.getDate() - 7); // 7 days ago
    return today.toISOString().split("T")[0];
  }

  return date;
}

function processData(data: SleepDataRaw[]): SleepData[] {
  const validDataPoints = data.filter((d: SleepDataRaw) => {
    return d.score !== undefined && d.timestamp !== undefined;
  });
  return validDataPoints.map((d: SleepDataRaw) => {
    return {
      id: d.id,
      score: d.score,
      timestamp: d.timestamp,
    };
  });
}

async function updateLastFetchDate(deviceId: string, data: SleepDataRaw[]) {
  if (data.length === 0) {
    return;
  }
  const lastDay = data[data.length - 1].day;
  const incrementedDay = new Date(lastDay);
  incrementedDay.setDate(incrementedDay.getDate() + 1);
  const lastDayPlusOne = incrementedDay.toISOString().split("T")[0];
  await storeString("sleep:" + deviceId, lastDayPlusOne);
}
