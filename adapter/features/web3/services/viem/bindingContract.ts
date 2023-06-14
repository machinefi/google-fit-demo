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
