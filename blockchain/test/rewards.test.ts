import { ethers, deployments } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers"

import { DeviceRewards } from "../typechain-types";

const REWARDS_CONTRACT_NAME = process.env.REWARDS_CONTRACT_NAME || "Device Rewards";
const REWARDS_URI = process.env.REWARDS_URI || "";

const ID_ZERO = 0;
const ZERO_BYTES = Buffer.from("");

describe("DeviceRewards", function () {
  let [_, minter, uriSetter, alice]: Signer[] = [];
  let aliceAddr: string;
  let rewards: DeviceRewards;

  before(async function () {
    [_, minter, uriSetter, alice] = await ethers.getSigners();
    aliceAddr = await alice.getAddress();
  });

  beforeEach(async function () {
    rewards = await setup();
    await grantMinterRole(rewards, minter);
    await grantUriSetterRole(rewards, uriSetter);
  });
  it("Should deploy DeviceRewards", async function () {
    const actualRewardsAddr = await rewards.getAddress()
    const actualName = await rewards.name()
    const actualUri = await rewards.uri(ID_ZERO);

    expect(actualRewardsAddr).to.not.equal(ethers.ZeroAddress);
    expect(actualName).to.equal(REWARDS_CONTRACT_NAME);
    expect(actualUri).to.equal(REWARDS_URI);
  });
  it("Uri setter should set token uri", async function () {
    const newUri = "newUri";
    await rewards.connect(uriSetter).setURI(newUri);

    expect(await rewards.uri(ID_ZERO)).to.equal(newUri);
  });
  it("Minter should be able to mint one token to a user", async function () {
    const amount = 1;
    await rewards.connect(minter).mint(aliceAddr, ID_ZERO, amount, ZERO_BYTES);
    expect(await rewards.balanceOf(aliceAddr, ID_ZERO)).to.equal(amount);
  });
  it("Minter should be able to mint multiple tokens to a user", async function () {
    const amount = 2;
    await rewards.connect(minter).mint(aliceAddr, ID_ZERO, amount, ZERO_BYTES);
    expect(await rewards.balanceOf(aliceAddr, ID_ZERO)).to.equal(amount);
  });
  it("Minter should be able to approve a user to mint token of a tier", async function () {
    const amount = 1;
    await rewards.connect(minter).approve(aliceAddr, ID_ZERO, amount);
    expect(await rewards.allowance(ID_ZERO, aliceAddr)).to.equal(amount);
  });
  it("Minter should be able to approve a user to mint multiple tokens of a tier", async function () {
    const amount = 2;
    await rewards.connect(minter).approve(aliceAddr, ID_ZERO, amount);
    expect(await rewards.allowance(ID_ZERO, aliceAddr)).to.equal(amount);
  });
  it("Minter should be able to approve a user to mint token of a tier multiple times", async function () {
    const amount1 = 1;
    const amount2 = 2;
    const totalAmount = amount1 + amount2;

    await rewards.connect(minter).approve(aliceAddr, ID_ZERO, amount1);
    await rewards.connect(minter).approve(aliceAddr, ID_ZERO, amount2);
    expect(await rewards.allowance(ID_ZERO, aliceAddr)).to.equal(totalAmount);
  });
  it("User cannot set allowance", async function () {
    const minterRole = await rewards.MINTER_ROLE();
    await expect(rewards.connect(alice).approve(aliceAddr, ID_ZERO, 1)).to
      .be.revertedWith(
        `AccessControl: account ${aliceAddr.toLowerCase()} is missing role ${minterRole}`
      );
  });
  it("User should be able to mint a token of a tier", async function () {
    const amount = 1;
    await rewards.connect(minter).approve(aliceAddr, ID_ZERO, amount);
    await rewards.connect(alice).mintFromAllowance(ID_ZERO, ZERO_BYTES);
    expect(await rewards.balanceOf(aliceAddr, ID_ZERO)).to.equal(amount);
    expect(await rewards.allowance(ID_ZERO, aliceAddr)).to.equal(0);
  });
});

async function setup() {
  await deployments.fixture(["DeviceRewards"])
  return ethers.getContract("DeviceRewards") as unknown as DeviceRewards;
}

async function grantMinterRole(
  rewards: DeviceRewards,
  minter: Signer
) {
  const minterRole = await rewards.MINTER_ROLE();
  await rewards.grantRole(minterRole, await minter.getAddress());
}

async function grantUriSetterRole(rewards: DeviceRewards, uriSetter: Signer) {
  const uriSetterRole = await rewards.URI_SETTER_ROLE();
  await rewards.grantRole(uriSetterRole, await uriSetter.getAddress());
}