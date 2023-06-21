import "server-only";

import { getContract } from "viem";

import * as deployments from "../../contracts/deployments.json";
import { walletClient, publicClient } from "./client";

const bindingConfig = (deployments as any)[4690][0].contracts.DeviceBinding;

export const bindingContract = getContract({
  address: bindingConfig.address as `0x${string}`,
  abi: bindingConfig.abi,
});

export async function bindDevice(deviceId: string, ownerAddr: string) {
  const bindingState = await getBindingState(deviceId);

  if (bindingState === ownerAddr) {
    return { transactionHash: "already bound" };
  }
  if (bindingState != "0x0000000000000000000000000000000000000000" && !!bindingState) {
    throw new Error("Device already bound to another address");
  }

  const { request } = await publicClient.simulateContract({
    account: walletClient.account,
    address: bindingConfig.address as `0x${string}`,
    abi: bindingConfig.abi,
    functionName: "bindDevice",
    args: [deviceId, ownerAddr],
  });
  const hash = await walletClient.writeContract(request);
  return publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });
}

async function getBindingState(deviceId: string) {
  try {
    const deviceOwner = await publicClient.readContract({
      address: bindingConfig.address as `0x${string}`,
      abi: bindingConfig.abi,
      functionName: "getDeviceOwner",
      args: [deviceId],
    }) as unknown as string | undefined | null;
  
    return deviceOwner;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}