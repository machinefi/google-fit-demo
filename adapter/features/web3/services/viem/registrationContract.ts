import "server-only";

import { getContract } from "viem";

import * as deployments from "../../contracts/deployments.json";
import { walletClient, publicClient } from "./client";

const registryConfig = (deployments as any)[4690][0].contracts.DeviceRegistry; 

export const registryContract = getContract({
  address: registryConfig.address as `0x${string}`,
  abi: registryConfig.abi,
});

export async function registerDevice(deviceIds: string[]) {
  const devicesStatuses = await getDeviceStatuses(deviceIds);
  const devicesToRegister = deviceIds.filter(
    (_, index) => !devicesStatuses[index]
  );

  if (devicesToRegister.length === 0) {
    return { transactionHash: "already registered" };
  }

  const { request } = await publicClient.simulateContract({
    account: walletClient.account,
    address: registryConfig.address as `0x${string}`,
    abi: registryConfig.abi,
    functionName: "registerDevices",
    args: [devicesToRegister],
  });
  const hash = await walletClient.writeContract(request);
  return publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });
}

async function getDeviceStatuses(deviceIds: string[]): Promise<boolean[]> {
  try {
    return publicClient.readContract({
      address: registryConfig.address as `0x${string}`,
      abi: registryConfig.abi,
      functionName: "isAuthorizedDevices",
      args: [deviceIds],
    }) as Promise<boolean[]>;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to check if device is registered");
  }
}
