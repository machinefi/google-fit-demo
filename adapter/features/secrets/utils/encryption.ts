import crypto from "crypto";

import { EncryptedToken } from "../types/EncryptedToken";

const algorithm = "aes-256-cbc";
const key = process.env.ENCRYPT_KEY || crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export function encrypt(text: string): EncryptedToken {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

export function decrypt(encryptedObj: EncryptedToken) {
  const ivp = Buffer.from(encryptedObj.iv, "hex");
  const encryptedText = Buffer.from(encryptedObj.encryptedData, "hex");
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), ivp);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
