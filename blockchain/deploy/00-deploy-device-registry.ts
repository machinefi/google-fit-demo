import { DeployFunction } from "hardhat-deploy/types";

import { DEVICE_REGISTERED_BYTES32 } from "../constants";
import { logDeploymendBlock, updateWsConfig } from "../utils/deploy-helpers";

const func: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
}) => {
  const { deploy } = deployments;
  const chainId = await getChainId();
  const { deployer } = await getNamedAccounts();

  const tx = await deploy("DeviceRegistry", {
    from: deployer,
    args: [],
    log: true,
  });

  logDeploymendBlock("DeviceRegistry", tx);
  updateWsConfig(chainId, tx, "ON_DEVICE_REGISTERED", DEVICE_REGISTERED_BYTES32);
};

export default func;
func.tags = ["DeviceRegistry"];
