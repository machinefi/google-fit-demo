import "server-only";

import { getContract } from "viem";

import * as deployments from "../../contracts/deployments.json";
import { walletClient, publicClient } from "./client";

const registryConfig = (deployments as any)[4690][0].contracts.DeviceRegistry;

export const registryContract = getContract({
  address: registryConfig.address as `0x${string}`,
  abi: registryConfig.abi,
});

export async function registerDevice(deviceId: string) {
  if (await isRegistered(deviceId)) {
    return { transactionHash: "already registered" };
  }

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

async function isRegistered(deviceId: string) {
  try {
    const isAuthorized = await publicClient.readContract({
      address: registryConfig.address as `0x${string}`,
      abi: registryConfig.abi,
      functionName: "isAuthorizedDevice",
      args: [deviceId],
    })
  
    return isAuthorized;
  } catch (e) {
    console.log(e);
    return false;
  }
}