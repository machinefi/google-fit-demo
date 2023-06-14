import "server-only";

import { getContract } from "viem";

import * as deployments from "../../contracts/deployments.json";
import { walletClient, publicClient } from "./client";

const registryConfig = (deployments as any)[4690][0].contracts.DevicesRegistry;

export const registryContract = getContract({
  address: registryConfig.address as `0x${string}`,
  abi: registryConfig.abi,
});

export async function registerDevice(deviceId: string) {
  const { request } = await publicClient.simulateContract({
    account: walletClient.account,
    address: registryConfig.address as `0x${string}`,
    abi: registryConfig.abi,
    functionName: "registerDevice",
    args: [deviceId],
  });
  const hash = await walletClient.writeContract(request);
  return publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });
}
