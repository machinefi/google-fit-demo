import "server-only";
import redisCli from "./client";

export const load = <T extends Record<string, unknown>>(key: string) =>
  redisCli.hgetall<T>(key);
export const loadAll = (keys: string = "") => redisCli.keys(keys + "*");
export const loadDate = <T>(key: string) => redisCli.get<T>(key);