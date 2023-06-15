import Bundlr from "@bundlr-network/client";
import { config } from "dotenv";

config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

export const bundlr = new Bundlr(
  "https://devnet.bundlr.network",
  "matic",
  PRIVATE_KEY,
  {
    providerUrl: "https://rpc-mumbai.maticvigil.com",
  }
);
