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

  const { name, symbol, uri } = getSbtMetadata();

  const tx = await deploy("DeviceSBT", {
    from: deployer,
    args: [uri, name, symbol],
    log: true,
  });

  logDeploymendBlock("DeviceSBT", tx);
  updateWsConfigEnv(chainId, tx, "SBT_CONTRACT_ADDRESS");
};

export default func;
func.tags = ["DeviceSBT"];

function getSbtMetadata() {
  const name = process.env.SBT_CONTRACT_NAME || "Device SBT";
  const symbol = process.env.SBT_CONTRACT_SYMBOL || "DSBT";
  const uri = process.env.SBT_URI || "";
  return { name, symbol, uri };
}
