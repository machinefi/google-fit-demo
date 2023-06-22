import "server-only";

import redisCli from "./client";

export const loadDate = (key: string) => redisCli.get(key);