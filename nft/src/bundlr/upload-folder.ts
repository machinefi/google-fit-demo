import { bundlr } from "./client.js";
import { getPriceAndTopupIfNeeded } from "./fund.js";

export const uploadFolder = async (folderPath: string, size: number) => {
  try {
    await getPriceAndTopupIfNeeded(size);
    const response = await bundlr.uploadFolder(folderPath);
    console.log(`Files uploaded ==> Manifest Id = ${response?.id}`);
    return response?.id;
  } catch (e) {
    console.log("Error uploading file ", e);
  }
};
