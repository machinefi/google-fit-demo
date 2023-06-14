import { task } from "hardhat/config";
import { Sleepr } from "../typechain-types";

task("grant-sleepr-minter", "Grant sleepr minter role to an address").setAction(
  async (_, hre) => {
    const { deployments } = hre;
    const [deployer] = await hre.ethers.getSigners();

    const Sleepr = await deployments.get("Sleepr");
    const sleepr = await hre.ethers.getContractAt(
      "Sleepr",
      Sleepr.address,
      deployer
    );

    const minterRole = await sleepr.MINTER_ROLE();
    const tx = await sleepr.grantRole(minterRole, process.env.OPERATOR_ADDRESS);
    await tx.wait();

    console.log(`Minter role granted to ${process.env.OPERATOR_ADDRESS}`);
  }
);

task("update-sleepr-uri", "Update sleepr uri").setAction(async (_, hre) => {
  const { deployments } = hre;
  const [deployer] = await hre.ethers.getSigners();

  const Sleepr = await deployments.get("Sleepr");
  const sleepr = (await hre.ethers.getContractAt(
    "Sleepr",
    Sleepr.address,
    deployer
  )) as Sleepr;

  const tx = await sleepr.setURI(process.env.SLEEPR_URI || "");
  await tx.wait();

  console.log(`Sleepr uri updated to ${process.env.SLEEPR_URI}`);
});
