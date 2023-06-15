import { bundlr } from "./client.js";
import { getPriceAndTopupIfNeeded } from "./fund.js";

export const uploadImage = async (fileToUpload: Buffer, fileType: string) => {
  try {
    await getPriceAndTopupIfNeeded(fileToUpload.length);

    const tx = await bundlr.upload(fileToUpload, {
      tags: [{ name: "Content-Type", value: fileType }],
    });

    console.log(`File uploaded ==> https://arweave.net/${tx.id}`);

    return "https://arweave.net/" + tx.id;
  } catch (e) {
    console.log("Error on upload, ", e);
  }
};
