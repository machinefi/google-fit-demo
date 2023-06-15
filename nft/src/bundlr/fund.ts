import { bundlr } from "./client.js";

export const getPriceAndTopupIfNeeded = async (size: number) => {
  console.log("File size: ", size, " bytes.");

  const price = await bundlr.getPrice(size);
  const balance = await bundlr.getLoadedBalance();

  if (price.isGreaterThanOrEqualTo(balance)) {
    console.log("Funding.");
    await bundlr.fund(price);
  } else {
    console.log("Funding not needed, balance sufficient.");
  }
};
