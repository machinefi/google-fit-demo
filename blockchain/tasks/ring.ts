import { task } from "hardhat/config";

task("grant-ring-minter", "Grant ring minter role to an address").setAction(
  async (_, hre) => {
    const { deployments } = hre;
    const [deployer] = await hre.ethers.getSigners();

    const Ring = await deployments.get("Ring");
    const ring = await hre.ethers.getContractAt("Ring", Ring.address, deployer);

    const minterRole = await ring.MINTER_ROLE();
    const tx = await ring.grantRole(minterRole, process.env.OPERATOR_ADDRESS);
    await tx.wait();

    console.log(`Minter role granted to ${process.env.OPERATOR_ADDRESS}`);
  }
);

task("check-ring-balance", "Check ring balance of an address")
  .addParam("address", "Address to check")
  .setAction(async (taskArgs, hre) => {
    const { address } = taskArgs;
    const { deployments } = hre;
    const [deployer] = await hre.ethers.getSigners();

    const Ring = await deployments.get("Ring");
    const ring = await hre.ethers.getContractAt("Ring", Ring.address, deployer);

    const balance = await ring.balanceOf(address);
    console.log(`Balance of ${address}: ${balance}`);
  });

task("get-ring-uri", "Get ring URI")
  .addParam("id", "Token ID")
  .setAction(async (taskArgs, hre) => {
    const { id } = taskArgs;
    const { deployments } = hre;
    const [deployer] = await hre.ethers.getSigners();

    const Ring = await deployments.get("Ring");
    const ring = await hre.ethers.getContractAt("Ring", Ring.address, deployer);

    const uri = await ring.tokenURI(id);
    console.log(`URI of token ${id}: ${uri}`);
  });
