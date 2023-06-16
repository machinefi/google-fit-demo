import * as deployments from "../../contracts/deployments.json";

const sbtConfig = (deployments as any)[4690][0].contracts.DeviceSBT;
const rewardsConfig = (deployments as any)[4690][0].contracts.DeviceRewards;

export const sbtContract = {
  address: sbtConfig.address as `0x${string}`,
  abi: sbtConfig.abi,
};

export const rewardsContract = {
  address: rewardsConfig.address as `0x${string}`,
  abi: rewardsConfig.abi,
};
