import "server-only";

import { HTTP_ROUTE, DEVICE_TOKEN } from "@/app/config";
import { SleepData } from "@/app/types";

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", `Bearer ${DEVICE_TOKEN}`);

const requestOptions: any = {
  method: "POST",
  headers: myHeaders,
};

export async function uploadSleepDataToWS(deviceId: string, data: SleepData[]) {
  if (data.length === 0) {
    return;
  }

  requestOptions.body = JSON.stringify({
    deviceId: `0x${deviceId}`,
    data: data,
  });

  await sendRequest(
    HTTP_ROUTE.trim() + "?eventType=SLEEP_DATA",
    requestOptions
  );
}

export async function triggerEvaluation() {
  await sendRequest(
    HTTP_ROUTE.trim() + "?eventType=ANALYZE_SLEEP",
    requestOptions
  );
}

async function sendRequest(route: string, options: any) {
  try {
    const res = await fetch(route, options);
    console.log(await res.json());
  } catch (error) {
    throw error;
  }
}
