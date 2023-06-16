import { ARWEAVE_BASE_URL } from "../config.js";
import { bundlr } from "./client.js";
import { getPriceAndTopupIfNeeded } from "./fund.js";

export const uploadMetadata = async (data: any) => {
  try {
    const serialized = JSON.stringify(data);

    await getPriceAndTopupIfNeeded(new Blob([serialized]).size);

    const tx = await bundlr.upload(serialized, {
      tags: [{ name: "Content-Type", value: "application/json" }],
    });

    console.log(`Upload success content URI= ${ARWEAVE_BASE_URL}${tx.id}`);

    return `${ARWEAVE_BASE_URL}${tx.id}`;
  } catch (e) {
    console.log("Error on upload ", e);
  }
  return "";
};
