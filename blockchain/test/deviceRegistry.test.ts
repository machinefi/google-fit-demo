import { deployments, ethers } from "hardhat";
import { expect } from "chai";

import { DeviceRegistry } from "../typechain-types";
import { DEVICE_ID_1, DEVICE_ID_2, DEVICE_ID_3, DEVICE_ID_4 } from "./fixtures";

describe("Device Registry", function () {
  let dr: DeviceRegistry;

  this.beforeEach(async function () {
    dr = await deployDeviceRegistry();
  });
  it("Should deploy Device Registry", async function () {
    const drAddress = await dr.getAddress()
    expect(drAddress).to.not.equal(ethers.ZeroAddress);
  });
  describe("Device registration", function () {
    it("Should register one device", async function () {
      await dr.registerDevice(DEVICE_ID_1);
      await assertAuthorizedDevices(dr, [DEVICE_ID_1]);
    });
    it("Should register devices in a batch", async function () {
      const devicesToAuthorize = [DEVICE_ID_1, DEVICE_ID_2, DEVICE_ID_3, DEVICE_ID_4];
      await dr.registerDevices(devicesToAuthorize);

      await assertAuthorizedDevices(dr, devicesToAuthorize);
    });
    it("Should emit events when registering devices in a batch", async function () {
      const tx = await dr.registerDevices([DEVICE_ID_1, DEVICE_ID_2]);

      const eventName = "DeviceRegistered";

      await expect(tx).to.emit(dr, eventName).withArgs(DEVICE_ID_1);
      await expect(tx).to.emit(dr, eventName).withArgs(DEVICE_ID_2);
    });
    it("Should check registered devices in batch", async function () {
      const devicesIds = [DEVICE_ID_1, DEVICE_ID_2, DEVICE_ID_3, DEVICE_ID_4];

      const isAuthorizedBatch = await dr.isAuthorizedDevices(devicesIds);
      expect(isAuthorizedBatch).to.deep.equal([false, false, false, false]);

      await dr.registerDevice(DEVICE_ID_3);

      const isAuthorizedBatch2 = await dr.isAuthorizedDevices(devicesIds);
      expect(isAuthorizedBatch2).to.deep.equal([false, false, true, false]);
    });
    it("Should revert if one of the devices in batch is already registered", async function () {
      await dr.registerDevice(DEVICE_ID_1);

      await expect(
        dr.registerDevices([DEVICE_ID_1, DEVICE_ID_2])
      ).to.be.revertedWith("Device already registered");
    });
  });
  describe("Device status", function () {
    it("Should return false if device is not registered", async function () {
      await assertAuthorizedDevices(dr, [DEVICE_ID_1], false);
    });
    it("Should return false if device is suspended", async function () {
      await dr.registerDevice(DEVICE_ID_1);
      await dr.suspendDevice(DEVICE_ID_1);

      assertAuthorizedDevices(dr, [DEVICE_ID_1], false);
    });
    it("Should return false if device has been removed", async function () {
      await dr.registerDevice(DEVICE_ID_1);
      await dr.removeDevice(DEVICE_ID_1);

      await assertAuthorizedDevices(dr, [DEVICE_ID_1], false);
    });
  });
});

async function assertAuthorizedDevices(dr: DeviceRegistry, devices: string[], expectedRes = true) {
  for (const device of devices) {
    const isAuthorized = await dr.isAuthorizedDevice(device);
    expect(isAuthorized).to.equal(expectedRes);
  }
}

async function deployDeviceRegistry() {
  await deployments.fixture(["DeviceRegistry"]);
  return ethers.getContract("DeviceRegistry") as unknown as DeviceRegistry;
}