import { ethers } from "hardhat";
import { expect } from "chai";
import { DevicesRegistry } from "../typechain-types";

async function setup() {
  const devicesRegistry = await ethers.getContractFactory("DevicesRegistry");
  const devicesRegistryInstance = await devicesRegistry.deploy();
  await devicesRegistryInstance.deployed();

  const contracts = {
    DevicesRegistry: devicesRegistryInstance as DevicesRegistry,
  };

  return {
    ...contracts,
  };
}

describe("Device Registry", function () {
  it("Should deploy Device Registry", async function () {
    const { DevicesRegistry } = await setup();

    expect(DevicesRegistry.address).to.not.equal(0);
  });
});
