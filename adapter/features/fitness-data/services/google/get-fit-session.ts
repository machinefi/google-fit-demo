import "server-only";

import { googleAxiosInstance } from "./client";
import { FitSessionRaw } from "@/app/types";

export async function fetchFitSessions(
  token: string,
  startTimestamp: string,
  activityType: number
): Promise<FitSessionRaw[]> {
  try {
    const res = await googleAxiosInstance(token).get(
      `/sessions?startTime=${startTimestamp}&activityType=${activityType}`
    );
    if (!res.data.session) {
      return [];
    }
    return res.data.session;
  } catch (e: any) {
    console.log(e);
    throw Error(
      e.response.data.message || e.response.data.message || e.message
    );
  }
}
