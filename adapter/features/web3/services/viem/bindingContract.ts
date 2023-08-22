import "server-only";

import { getContract } from "viem";

import * as deployments from "../../contracts/deployments.json";
import { walletClient, publicClient } from "./client";

const bindingConfig = (deployments as any)[4690][0].contracts.DeviceBinding;

export const bindingContract = getContract({
  address: bindingConfig.address as `0x${string}`,
  abi: bindingConfig.abi,
});

const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

export async function bindDevice(deviceIds: string[], ownerAddr: string) {
  const bindingStates = await getBindingStates(deviceIds);

  const devicesToBind = deviceIds.filter((_, index) => !bindingStates[index]);

  const { request } = await publicClient.simulateContract({
    account: walletClient.account,
    address: bindingConfig.address as `0x${string}`,
    abi: bindingConfig.abi,
    functionName: "bindDevices",
    args: [devicesToBind, ownerAddr],
  });
  const hash = await walletClient.writeContract(request);
  return publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });
}

async function getBindingStates(deviceIds: string[]): Promise<boolean[]> {
  const bindingStates = await Promise.all(deviceIds.map(getBindingState));
  return bindingStates.map((state) => state != ZERO_ADDR);
}

async function getBindingState(deviceId: string): Promise<string> {
  try {
    return publicClient.readContract({
      address: bindingConfig.address as `0x${string}`,
      abi: bindingConfig.abi,
      functionName: "getDeviceOwner",
      args: [deviceId],
    }) as unknown as string;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to check if device is bound");
  }
}
