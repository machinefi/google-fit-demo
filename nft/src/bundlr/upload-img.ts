import { ARWEAVE_BASE_URL } from "../config.js";
import { bundlr } from "./client.js";
import { getPriceAndTopupIfNeeded } from "./fund.js";

export const uploadImage = async (fileToUpload: Buffer, fileType: string) => {
  try {
    await getPriceAndTopupIfNeeded(fileToUpload.length);

    const tx = await bundlr.upload(fileToUpload, {
      tags: [{ name: "Content-Type", value: fileType }],
    });

    console.log(`File uploaded ==> ${ARWEAVE_BASE_URL}${tx.id}`);

    return ARWEAVE_BASE_URL + tx.id;
  } catch (e) {
    console.log("Error on upload, ", e);
  }
};
