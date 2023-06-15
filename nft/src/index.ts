import { uploadRingNFT } from "./upload-ring.js";
import { uploadSleepr } from "./upload-sleepr.js";

const main = async () => {
  await uploadRingNFT();
  await uploadSleepr();
};

main();
