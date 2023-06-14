import "server-only";

import { ouraAxiosInstance } from "./client";

export async function fetchSleepData(
  token: string,
  start: string = "2023-01-01"
) {
  try {
    const res = await ouraAxiosInstance(token).get(
      `/v2/usercollection/daily_sleep?start_date=${start}`
    );

    const { data } = res.data;

    if (!data) {
      throw new Error("Failed to fetch sleep data");
    }

    return data;
  } catch (e: any) {
    console.log(e);
    throw Error(
      e.response.data.message || e.response.data.message || e.message
    );
  }
}
