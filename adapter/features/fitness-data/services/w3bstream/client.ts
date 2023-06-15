import "server-only";

import { HTTP_ROUTE, DEVICE_TOKEN } from "@/app/config";
import { FitSession } from "@/app/types";

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", `Bearer ${DEVICE_TOKEN}`);

const requestOptions: any = {
  method: "POST",
  headers: myHeaders,
};

const FIT_DATA_EVENT_TYPE = "FIT_DATA";
const ANALYZE_FIT_DATA_EVENT_TYPE = "ANALYZE_FIT_DATA";

export async function uploadFitSessionToWS(
  deviceId: string,
  data: FitSession[]
) {
  if (data.length === 0) {
    return;
  }

  requestOptions.body = JSON.stringify({
    deviceId,
    data,
  });

  await sendRequest(
    HTTP_ROUTE.trim() + `?eventType=${FIT_DATA_EVENT_TYPE}`,
    requestOptions
  );
}

export async function triggerEvaluation() {
  await sendRequest(
    HTTP_ROUTE.trim() + `?eventType=${ANALYZE_FIT_DATA_EVENT_TYPE}`,
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
