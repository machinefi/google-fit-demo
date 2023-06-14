import { DeployFunction } from "hardhat-deploy/types";
import { addEnvVarToWSProjectConfig } from "../utils/update-envs";

const func: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
}) => {
  const { deploy } = deployments;
  const chainId = await getChainId();
  const { deployer } = await getNamedAccounts();

  const tx = await deploy("Sleepr", {
    from: deployer,
    args: [process.env.SLEEPR_URI || ""],
    log: true,
  });

  console.log("Ring deployed at block: ", tx.receipt?.blockNumber);

  if (chainId) {
    addEnvVarToWSProjectConfig({
      envName: "SLEEPR_CONTRACT_ADDRESS",
      envValue: tx.address,
    });
    addEnvVarToWSProjectConfig({
      envName: "CHAIN_ID",
      envValue: Number(chainId),
    });
  }
};

export default func;
func.tags = ["Sleepr"];
