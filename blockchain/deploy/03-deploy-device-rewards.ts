import { DeployFunction } from "hardhat-deploy/types";
import { addEnvVarToWSProjectConfig } from "../utils/update-envs";
import { REWARDS_CONTRACT_NAME, REWARDS_URI } from "../constants";

const func: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
}) => {
  const { deploy } = deployments;
  const chainId = await getChainId();
  const { deployer } = await getNamedAccounts();

  const tx = await deploy("DeviceRewards", {
    from: deployer,
    args: [REWARDS_URI, REWARDS_CONTRACT_NAME],
    log: true,
  });

  console.log("DeviceRewards deployed at block: ", tx.receipt?.blockNumber);

  if (chainId !== "31337") {
    addEnvVarToWSProjectConfig({
      envName: "REWARDS_CONTRACT_ADDRESS",
      envValue: tx.address,
    });
    addEnvVarToWSProjectConfig({
      envName: "CHAIN_ID",
      envValue: Number(chainId),
    });
  }
};

export default func;
func.tags = ["DeviceRewards"];
