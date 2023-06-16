import { SBT_CONTRACT_NAME, SBT_CONTRACT_SYMBOL, SBT_URI } from "../constants";
import { addEnvVarToWSProjectConfig } from "../utils/update-envs";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
}) => {
  const { deploy } = deployments;
  const chainId = await getChainId();
  const { deployer } = await getNamedAccounts();

  const tx = await deploy("DeviceSBT", {
    from: deployer,
    args: [SBT_URI, SBT_CONTRACT_NAME, SBT_CONTRACT_SYMBOL],
    log: true,
  });

  console.log("DeviceSBT deployed at block: ", tx.receipt?.blockNumber);

  if (chainId !== "31337") {
    addEnvVarToWSProjectConfig({
      envName: "SBT_CONTRACT_ADDRESS",
      envValue: tx.address,
    });
    addEnvVarToWSProjectConfig({
      envName: "CHAIN_ID",
      envValue: chainId,
    });
  }
};

export default func;
func.tags = ["DeviceSBT"];
