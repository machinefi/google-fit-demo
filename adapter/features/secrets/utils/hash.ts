import crypto from "crypto";

export const hashString = (value: string): string => {
  const hash = crypto.createHash("sha256");
  hash.update(value, "utf8");
  return hash.digest("hex");
};
