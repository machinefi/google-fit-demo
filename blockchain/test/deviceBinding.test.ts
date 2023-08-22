import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { Signer } from "ethers";

import { DeviceBinding, DeviceRegistry } from "../typechain-types";
import { DEVICE_ID_1, DEVICE_ID_2, DEVICE_ID_3, DEVICE_ID_4 } from "./fixtures";

describe("Device Binding", function () {
  let [_, alice, bob, mallory]: Signer[] = [];
  let aliceAddr: string;
  let bobAddr: string;
  let db: DeviceBinding;
  let dr: DeviceRegistry;

  before(async function () {
    [_, alice, bob, mallory] = await ethers.getSigners();
    aliceAddr = await alice.getAddress();
    bobAddr = await bob.getAddress();
  });

  beforeEach(async function () {
    const { DeviceBinding, DeviceRegistry } = await getContracts();
    db = DeviceBinding;
    dr = DeviceRegistry;
  });

  describe("Initialization", function () {
    it("Should initialize the contract with Device Registry", async function () {
      const expectedAddress = await dr.getAddress();
      const actualAddress = await db.deviceRegistry();

      expect(actualAddress).to.equal(expectedAddress);
    });
  });
  describe("Binding", function () {
    beforeEach(async function () {
      const devicesToRegister = [DEVICE_ID_1, DEVICE_ID_2, DEVICE_ID_3];
      await registerDevices(dr, devicesToRegister);
    });
    it("Should bind a device", async function () {
      await db.bindDevice(DEVICE_ID_1, aliceAddr);

      await assertDevicesOwner(db, aliceAddr, [DEVICE_ID_1]);
      await assertDevicesCount(db, 1);
      await assertOwnedDevices(db, aliceAddr, [DEVICE_ID_1]);
    });
    it("Should bind multiple devices", async function () {
      const devices = [DEVICE_ID_1, DEVICE_ID_2];

      await bindDevicesToUser(db, aliceAddr, devices);

      await assertDevicesOwner(db, aliceAddr, devices);
      await assertDevicesCount(db, 2);
      await assertOwnedDevices(db, aliceAddr, devices);
    });
    it("Should bind multiple devices to multiple users", async function () {
      const aliceDevices = [DEVICE_ID_1, DEVICE_ID_2];
      const bobDevices = [DEVICE_ID_3];

      await bindDevicesToUser(db, aliceAddr, aliceDevices);
      await bindDevicesToUser(db, bobAddr, bobDevices);

      await assertDevicesOwner(db, aliceAddr, aliceDevices);
      await assertDevicesOwner(db, bobAddr, bobDevices);

      await assertDevicesCount(db, 3);

      await assertOwnedDevices(db, aliceAddr, aliceDevices);
      await assertOwnedDevices(db, bobAddr, bobDevices);
    });
    it("Should emit an event when binding a device", async function () {
      await expect(db.bindDevice(DEVICE_ID_1, aliceAddr))
        .to.emit(db, "OwnershipAssigned")
        .withArgs(DEVICE_ID_1, aliceAddr);
    });
    it("Should not bind a device if it is already bound", async function () {
      await bindDevicesToUser(db, aliceAddr, [DEVICE_ID_1]);
      await expect(
        db.bindDevice(DEVICE_ID_1, aliceAddr)
      ).to.be.revertedWith("device has already been bound");
    });
    it("Should not bind a device if it device is not authorized", async function () {
      await expect(
        db.bindDevice(DEVICE_ID_4, aliceAddr)
      ).to.be.revertedWith("device is not authorized");
    });
    it("Should not bind a device if it was suspended", async function () {
      await dr.registerDevice(DEVICE_ID_4);
      await dr.suspendDevice(DEVICE_ID_4);

      await expect(
        db.bindDevice(DEVICE_ID_4, aliceAddr)
      ).to.be.revertedWith("device is not authorized");
    });
    it("Should bind devices in batches", async function () {
      await db.bindDevices([DEVICE_ID_1, DEVICE_ID_2], aliceAddr);

      await assertDevicesOwner(db, aliceAddr, [DEVICE_ID_1, DEVICE_ID_2]);
    });
    it("Should emit events when binding devices in batches", async function () {
      await expect(
        db.bindDevices([DEVICE_ID_1, DEVICE_ID_2], aliceAddr)
      )
        .to.emit(db, "OwnershipAssigned")
        .withArgs(DEVICE_ID_1, aliceAddr)
        .to.emit(db, "OwnershipAssigned")
        .withArgs(DEVICE_ID_2, aliceAddr);
    });
    it("Should not bind devices in batches if they are already bound", async function () {
      await db.bindDevice(DEVICE_ID_2, aliceAddr);
      await expect(
        db.bindDevices([DEVICE_ID_1, DEVICE_ID_2], aliceAddr)
      ).to.be.revertedWith("device has already been bound");
    });
    it("Should not bind devices in batches if they are not authorized", async function () {
      await expect(
        db.bindDevices([DEVICE_ID_1, DEVICE_ID_4], aliceAddr)
      ).to.be.revertedWith("device is not authorized");
    });
  });
  describe("Unbinding", function () {
    beforeEach(async function () {
      const devicesToRegister = [DEVICE_ID_1, DEVICE_ID_2, DEVICE_ID_3];
      await registerDevices(dr, devicesToRegister);

      await db.bindDevice(DEVICE_ID_1, aliceAddr);
    });
    it("Should unbind a device", async function () {
      await db.unbindDevice(DEVICE_ID_1);

      await assertDevicesOwner(db, ethers.ZeroAddress, [DEVICE_ID_1]);
      await assertDevicesCount(db, 0);
      await assertOwnedDevices(db, aliceAddr, []);
    });
    it("Should unbind multiple devices", async function () {
      await db.bindDevice(DEVICE_ID_2, aliceAddr);

      await db.unbindDevice(DEVICE_ID_1);
      await db.unbindDevice(DEVICE_ID_2);

      await assertDevicesOwner(db, ethers.ZeroAddress, [DEVICE_ID_1, DEVICE_ID_2]);
    });
    it("Should emit an event when unbinding a device", async function () {
      await expect(db.unbindDevice(DEVICE_ID_1))
        .to.emit(db, "OwnershipRenounced")
        .withArgs(DEVICE_ID_1);
    });
    it("Should not unbind a device if it is not bound", async function () {
      await expect(db.unbindDevice(DEVICE_ID_2)).to.be.revertedWith(
        "device is not bound"
      );
    });
    it("Should not unbind a device if it is already unbound", async function () {
      await db.unbindDevice(DEVICE_ID_1);
      await expect(db.unbindDevice(DEVICE_ID_1)).to.be.revertedWith(
        "device is not bound"
      );
    });
    it("Should not unbind a device if it is not owned by the sender", async function () {
      await expect(
        db.connect(mallory).unbindDevice(DEVICE_ID_1)
      ).to.be.revertedWith("not the device owner or admin");
    });
  });
});

async function registerDevices(dr: DeviceRegistry, devices: string[]) {
  for await (const deviceId of devices) {
    await dr.registerDevice(deviceId);
  }
}

async function bindDevicesToUser(db: DeviceBinding, userAddr: string, devices: string[]) {
  for await (const deviceId of devices) {
    await db.bindDevice(deviceId, userAddr);
  }
}

async function assertOwnedDevices(db: DeviceBinding, aliceAddr: string, devices: string[]) {
  expect(await db.getOwnedDevices(aliceAddr)).to.deep.equal(devices);
}

async function assertDevicesCount(db: DeviceBinding, expectedCount: number) {
  expect(await db.getDevicesCount()).to.equal(expectedCount);
}

async function assertDevicesOwner(db: DeviceBinding, userAddr: string, deviceIds: string[]) {
  for (const deviceId of deviceIds) {
    expect(await db.getDeviceOwner(deviceId)).to.equal(userAddr);
  }
}

async function getContracts() {
  await deployments.fixture(["DeviceRegistry", "DeviceBinding"])
  const DeviceRegistry = await ethers.getContract("DeviceRegistry") as unknown as DeviceRegistry;
  const DeviceBinding = await ethers.getContract("DeviceBinding") as unknown as DeviceBinding;

  return {
    DeviceRegistry,
    DeviceBinding,
  }
}