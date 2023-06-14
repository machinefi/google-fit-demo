import axios from "axios";

import { OURA_BASE_URL } from "@/app/config";

export const ouraAxiosInstance = (token: string) => {
  const axiosInstance = axios.create({
    baseURL: OURA_BASE_URL,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return axiosInstance;
};
