import { DeployFunction } from "hardhat-deploy/types";

import { logDeploymendBlock, updateWsConfigEnv } from "../utils/deploy-helpers";

const func: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
}) => {
  const { deploy } = deployments;
  const chainId = await getChainId();
  const { deployer } = await getNamedAccounts();

  const { uri, name } = getContractMeta();

  const tx = await deploy("DeviceRewards", {
    from: deployer,
    args: [uri, name],
    log: true,
  });

  logDeploymendBlock("DeviceRewards", tx);
  updateWsConfigEnv(chainId, tx, "REWARDS_CONTRACT_ADDRESS");
};

export default func;
func.tags = ["DeviceRewards"];

function getContractMeta() {
  const name = process.env.REWARDS_CONTRACT_NAME || "Device Rewards";
  const uri = process.env.REWARDS_URI || "";
  return { uri, name };
}
