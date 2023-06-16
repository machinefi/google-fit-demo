import { uploadSBT } from "./upload-sbt.js";
import { uploadRewards } from "./upload-rewards.js";

const main = async () => {
  await uploadSBT();
  await uploadRewards();
};

main();
