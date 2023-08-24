// @ts-ignore
import { createPublicClient, createWalletClient, http } from "viem";
// @ts-ignore
import { iotexTestnet } from "viem/chains";
// @ts-ignore
import { privateKeyToAccount } from "viem/accounts";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);

export const walletClient = createWalletClient({
  account,
  chain: iotexTestnet,
  transport: http(),
});

export const publicClient = createPublicClient({
  chain: iotexTestnet,
  transport: http(),
});
