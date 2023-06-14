import * as deployments from "../../contracts/deployments.json";

const ringConfig = (deployments as any)[4690][0].contracts.Ring;
const sleeprConfig = (deployments as any)[4690][0].contracts.Sleepr;

export const ringContract = {
  address: ringConfig.address as `0x${string}`,
  abi: ringConfig.abi,
};

export const sleeprContract = {
  address: sleeprConfig.address as `0x${string}`,
  abi: sleeprConfig.abi,
};
