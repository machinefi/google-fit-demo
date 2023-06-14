import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Sleepr } from "../typechain-types";

const TIER_1_URI =
  "ipfs://QmQr1X5o4Jhdeb6BMviYN5anHMCjeMHxQPcu45YpN8SfQD/{id}.json";

const TIER_1_ID = 0;

async function setup() {
  const sleepr = await ethers.getContractFactory("Sleepr");
  const sleeprInstance = await sleepr.deploy(TIER_1_URI);
  await sleeprInstance.deployed();

  const contracts = {
    Sleepr: sleeprInstance as Sleepr,
  };

  return {
    ...contracts,
  };
}

async function grantMinterRole(sleepr: Sleepr, minter: SignerWithAddress) {
  const minterRole = await sleepr.MINTER_ROLE();
  await sleepr.grantRole(minterRole, minter.address);
}

describe("Sleepr", function () {
  let [admin, user, badGuy, minter, uriSetter]: SignerWithAddress[] = [];
  let sleepr: Sleepr;
  before(async function () {
    [admin, user, badGuy, minter, uriSetter] = await ethers.getSigners();
  });
  beforeEach(async function () {
    const { Sleepr } = await setup();
    sleepr = Sleepr;
    await grantMinterRole(sleepr, minter);
  });
  it("Should deploy Sleepr", async function () {
    expect(sleepr.address).to.not.equal(0);
  });
  it("Should initialize with an uri", async function () {
    expect(await sleepr.uri(TIER_1_ID)).to.equal(TIER_1_URI);
  });
  it("Uri setter should set token uri", async function () {
    const uriSetterRole = await sleepr.URI_SETTER_ROLE();
    await sleepr.grantRole(uriSetterRole, uriSetter.address);

    await sleepr.connect(uriSetter).setURI(TIER_1_URI + "2");

    expect(await sleepr.uri(TIER_1_ID)).to.equal(TIER_1_URI + "2");
  });
  it("Minter should be able to mint one token to a user", async function () {
    await sleepr.connect(minter).mint(user.address, TIER_1_ID, 1, []);
    expect(await sleepr.balanceOf(user.address, TIER_1_ID)).to.equal(1);
  });
  it("Minter should be able to mint multiple tokens to a user", async function () {
    await sleepr.connect(minter).mint(user.address, TIER_1_ID, 2, []);
    expect(await sleepr.balanceOf(user.address, TIER_1_ID)).to.equal(2);
  });
  it("Minter should be able to approve a user to mint token of a tier", async function () {
    await sleepr.connect(minter).approve(user.address, TIER_1_ID, 1);
    expect(await sleepr.allowance(TIER_1_ID, user.address)).to.equal(1);
  });
  it("Minter should be able to approve a user to mint multiple tokens of a tier", async function () {
    await sleepr.connect(minter).approve(user.address, TIER_1_ID, 2);
    expect(await sleepr.allowance(TIER_1_ID, user.address)).to.equal(2);
  });
  it("Minter should be able to approve a user to mint token of a tier multiple times", async function () {
    await sleepr.connect(minter).approve(user.address, TIER_1_ID, 1);
    await sleepr.connect(minter).approve(user.address, TIER_1_ID, 2);
    expect(await sleepr.allowance(TIER_1_ID, user.address)).to.equal(3);
  });
  it("User cannot set allowance", async function () {
    await expect(sleepr.connect(user).approve(user.address, TIER_1_ID, 1)).to.be
      .reverted;
  });
  it("User should be able to mint a token of a tier", async function () {
    await sleepr.connect(minter).approve(user.address, TIER_1_ID, 1);
    await sleepr.connect(user).mintFromAllowance(TIER_1_ID, []);
    expect(await sleepr.balanceOf(user.address, TIER_1_ID)).to.equal(1);
    expect(await sleepr.allowance(TIER_1_ID, user.address)).to.equal(0);
  });
});
