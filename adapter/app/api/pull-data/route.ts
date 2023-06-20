import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { loadDate } from "@/features/secrets/services/redis/load";
import { storeString } from "@/features/secrets/services/redis/store";
import { fetchFitSessions } from "@/features/fitness-data/services/google/get-fit-session";
import { FitSession, FitSessionRaw } from "@/app/types";
import { uploadFitSessionToWS } from "@/features/fitness-data/services/w3bstream/client";

const YOGA_ACTIVITY_TYPE = 100;
const NEXT_FETCH_TIME_KEY = "gfitStart:";
const DEFAULT_FETCH_DAYS = 7;
const DEFAULT_TIME_INCREMENT_MS = 1;

export async function POST(req: NextRequest) {
  const { deviceId } = await req.json();
  const token = await getToken({ req });
  if (!token || !token.accessToken) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    await processDevice(token.accessToken as string, deviceId);
  } catch (e: any) {
    console.log(e);
    return NextResponse.json(
      { error: e.response?.data?.error || e.message || "Unknown error" },
      { status: e.response?.status || 500 }
    );
  }
  return NextResponse.json({ success: true });
}

async function processDevice(accessToken: string, deviceId: string) {
  const lastFetchDate = await getLastFetchDate(deviceId);
  const rawData = await fetchFitSessions(
    accessToken,
    lastFetchDate,
    YOGA_ACTIVITY_TYPE
  );

  const processedData = processData(rawData);
  await uploadFitSessionToWS(deviceId, processedData);
  await updateLastFetchDate(deviceId, rawData);
}

async function getLastFetchDate(deviceId: string): Promise<string> {
  const _deviceId = deviceId.replace("0x", "");
  const date = await loadDate<string | null>(NEXT_FETCH_TIME_KEY + _deviceId);
  if (!date) {
    const today = new Date();
    today.setDate(today.getDate() - DEFAULT_FETCH_DAYS); 
    return today.toISOString();
  }

  return date;
}

function processData(data: FitSessionRaw[]): FitSession[] {
  const validDataPoints = data.filter((d: FitSessionRaw) => {
    return !!d.startTimeMillis && !!d.endTimeMillis;
  });
  return validDataPoints.map((d: FitSessionRaw) => {
    const { id, startTimeMillis, endTimeMillis } = d;
    return {
      id,
      startTimeMillis,
      endTimeMillis,
    };
  });
}

async function updateLastFetchDate(deviceId: string, data: FitSessionRaw[]) {
  const _deviceId = deviceId.replace("0x", "");
  if (data.length === 0) {
    return;
  }
  const endTimestamps = data.map((d) => Number(d.endTimeMillis));
  const lastTimestamp = Math.max(...endTimestamps);
  const incrementedTs = lastTimestamp + DEFAULT_TIME_INCREMENT_MS;
  const nextStartTime = new Date(incrementedTs).toISOString();

  await storeString(NEXT_FETCH_TIME_KEY + _deviceId, nextStartTime);
}
