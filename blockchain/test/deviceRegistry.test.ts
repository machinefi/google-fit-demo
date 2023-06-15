import { ethers } from "hardhat";
import { expect } from "chai";
import { DeviceRegistry } from "../typechain-types";

async function setup() {
  const deviceRegistry = await ethers.getContractFactory("DeviceRegistry");
  const deviceRegistryInstance = await deviceRegistry.deploy();
  await deviceRegistryInstance.deployed();

  const contracts = {
    DeviceRegistry: deviceRegistryInstance as DeviceRegistry,
  };

  return {
    ...contracts,
  };
}

describe("Device Registry", function () {
  it("Should deploy Device Registry", async function () {
    const { DeviceRegistry } = await setup();

    expect(DeviceRegistry.address).to.not.equal(0);
  });
});
