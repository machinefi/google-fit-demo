import "server-only";

import { W3bstreamClient, WSHeader } from "w3bstream-client-js";

import { HTTP_ROUTE, API_TOKEN } from "@/app/config";
import { FitSession } from "@/app/types";

const client = new W3bstreamClient(HTTP_ROUTE, API_TOKEN);

const FIT_DATA_EVENT_TYPE = "FIT_DATA";
const ANALYZE_FIT_DATA_EVENT_TYPE = "ANALYZE_FIT_DATA";

export async function uploadFitSessionToWS(
  deviceId: string,
  data: FitSession[]
) {
  if (data.length === 0) {
    return;
  }

  const header: WSHeader = {
    device_id: deviceId,
    event_type: FIT_DATA_EVENT_TYPE,
    timestamp: Date.now(),
  }
  const payload = {
    data,
  }

  await sendRequest(header, payload)
}

export async function triggerEvaluation() {
  const header: WSHeader = {
    device_id: "default",
    event_type: ANALYZE_FIT_DATA_EVENT_TYPE,
    timestamp: Date.now(),
  }
  const payload = {}

  await sendRequest(header, payload)
}

async function sendRequest(header: WSHeader, payload: Object | Buffer) {
  try {
    await client.publishSingle(header, payload);
  } catch (error) {
    console.error("Error while sending request to w3bstream", error);
    throw new Error("Error while sending request to w3bstream");
  }
}
