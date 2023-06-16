import { Metadata } from "./types";

export const ARWEAVE_BASE_URL = "https://arweave.net/";

export const SBT_PATH = "./assets/sbt/sbt.png";
export const SBT_FILE_TYPE = "image/png";
export const SBT_METADATA = {
  name: "Device SBT",
  description: "Non trasferable and non fungible token for the Device",
};

export const PATH_TO_REWARD_TOKENS = "./assets/rewards";
export const PATH_TO_REWARDS_MANIFEST = "./assets/rewards-manifest.json";
export const PATH_TO_REWARDS_METADATA = "./assets/rewards-metadata";

export const REWARDS_METADATA: {
  [key: string]: Metadata;
} = {
  "mat.png": {
    index: "0000000000000000000000000000000000000000000000000000000000000001",
    name: "Yoga Mat",
    description: "Yoga mat for a dilligent yogi",
  },
};
