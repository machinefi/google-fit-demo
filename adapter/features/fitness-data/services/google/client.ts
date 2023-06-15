import axios from "axios";

import { GOOGLE_FIT_BASE_URL } from "@/app/config";

export const googleAxiosInstance = (token: string) => {
  const axiosInstance = axios.create({
    baseURL: GOOGLE_FIT_BASE_URL,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return axiosInstance;
};
