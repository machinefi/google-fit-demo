import { addEnvVarToWSProjectConfig } from "./../utils/update-envs";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
}) => {
  const { deploy } = deployments;
  const chainId = await getChainId();
  const { deployer } = await getNamedAccounts();

  const tx = await deploy("Ring", {
    from: deployer,
    args: [process.env.RING_URI || ""],
    log: true,
  });

  console.log("Ring deployed at block: ", tx.receipt?.blockNumber);

  if (chainId) {
    addEnvVarToWSProjectConfig({
      envName: "RING_CONTRACT_ADDRESS",
      envValue: tx.address,
    });
    addEnvVarToWSProjectConfig({
      envName: "CHAIN_ID",
      envValue: Number(chainId),
    });
  }
};

export default func;
func.tags = ["Ring"];
