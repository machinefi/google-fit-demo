import { ouraAxiosInstance } from "./client";

export async function fetchUserEmail(token: string): Promise<string> {
  try {
    const res = await ouraAxiosInstance(token).get(
      `/v2/usercollection/personal_info`
    );
    const { email } = res.data;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      throw Error("Personal token is possibly invalid");
    }
    return email;
  } catch (e: any) {
    console.log(e);
    throw Error(
      e.response.data.message || e.response.data.message || e.message
    );
  }
}
