import { bundlr } from "./bundlr/client.js";

const FUND_AMOUNT = 0.1;

const amountAtomic = bundlr.utils.toAtomic(FUND_AMOUNT);

const fund = async () => {
  try {
    const response = await bundlr.fund(amountAtomic);
    console.log(
      `Funding successful txID=${response.id} amount funded=${response.quantity}`
    );
  } catch (e) {
    console.log("Error funding node ", e);
  }
};

fund();