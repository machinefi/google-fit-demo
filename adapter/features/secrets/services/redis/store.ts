import "server-only";

import redisCli from "./client";

export const storeString = async (key: string, value: string) => {
  await redisCli.set(key, value);
}