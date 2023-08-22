import { DeployFunction } from "hardhat-deploy/types";

import { OWNERSHIP_ASSIGNED_BYTES32_ADDRESS } from "../constants";
import { logDeploymendBlock, updateWsConfig } from "../utils/deploy-helpers";

const func: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
}) => {
  const { deploy } = deployments;
  const chainId = await getChainId();
  const { deployer } = await getNamedAccounts();
  const DeviceRegistry = await deployments.get("DeviceRegistry");

  const tx = await deploy("DeviceBinding", {
    from: deployer,
    args: [DeviceRegistry.address],
    log: true,
  });

  logDeploymendBlock("DeviceBinding", tx);
  updateWsConfig(chainId, tx, "ON_DEVICE_BOUND", OWNERSHIP_ASSIGNED_BYTES32_ADDRESS);
};

export default func;
func.tags = ["DeviceBinding"];
