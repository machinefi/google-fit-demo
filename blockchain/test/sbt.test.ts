import { ethers, deployments } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers"

import { DEVICE_ID_1, DEVICE_ID_2 } from "./fixtures";
import { DeviceSBT } from "../typechain-types";

const SBT_CONTRACT_NAME = process.env.SBT_CONTRACT_NAME || "Device SBT";
const SBT_CONTRACT_SYMBOL = process.env.SBT_CONTRACT_SYMBOL || "DSBT";
const SBT_TOKEN_URI = process.env.SBT_URI || "";

describe("DeviceSBT", function () {
  let [admin, minter, alice, bob, mallory]: Signer[] = [];
  let aliceAddr: string;
  let bobAddr: string;
  let sbt: DeviceSBT;

  before(async function () {
    [admin, minter, alice, bob, mallory] = await ethers.getSigners();
    aliceAddr = await alice.getAddress();
    bobAddr = await bob.getAddress();
  });

  beforeEach(async function () {
    sbt = await setup();
    await grantMinterRole(sbt, minter);
  });

  it("Should deploy DeviceSBT", async function () {
    expect(await sbt.name()).to.equal(SBT_CONTRACT_NAME);
    expect(await sbt.symbol()).to.equal(SBT_CONTRACT_SYMBOL);
  });
  it("admin can update uri", async function () {
    const newUri = "newUri";
    await sbt.connect(admin).setURI(newUri);
    await sbt.connect(minter).safeMint(aliceAddr, DEVICE_ID_2);
    expect(await sbt.tokenURI(DEVICE_ID_2)).to.equal(newUri);
  });

  describe("Minting", function () {
    beforeEach(async function () {
      await sbt.safeMint(aliceAddr, DEVICE_ID_1);
    });
    it("Minter should be able to mint one token to a user", async function () {
      expect(await sbt.balanceOf(aliceAddr)).to.equal(1);
      expect(await sbt.ownerOf(DEVICE_ID_1)).to.equal(aliceAddr);
      expect(await sbt.tokenURI(DEVICE_ID_1)).to.equal(SBT_TOKEN_URI);
    });
    it("Minter should be able to mint multiple tokens to a user", async function () {
      await sbt.connect(minter).safeMint(aliceAddr, DEVICE_ID_2);
      expect(await sbt.balanceOf(aliceAddr)).to.equal(2);
    });
    it("Minter cannot mint a token with an already used sbt id", async function () {
      await expect(
        sbt.connect(minter).safeMint(aliceAddr, DEVICE_ID_1)
      ).to.be.revertedWith("ERC721: token already minted");
    });
  })
  describe("Transferring", function () {
    it("User should not be able to transfer SBT to another user", async function () {
      await sbt.safeMint(aliceAddr, DEVICE_ID_1);
      await expect(
        sbt.connect(alice).transferFrom(aliceAddr, bobAddr, DEVICE_ID_1)
      ).to.be.revertedWith("DeviceSBT: Only minting allowed");
    });
  });
  describe("Approvals", function () {
    beforeEach(async function () {
      await sbt.approveSBT(aliceAddr, DEVICE_ID_1);
    });
    it("Minter can approve a user to mint a sbt", async function () {
      await sbt.connect(minter).approveSBT(aliceAddr, DEVICE_ID_2);
      expect(await sbt.sbtApprovals(DEVICE_ID_2)).to.equal(aliceAddr);
    });
    it("User can mint a sbt if approved", async function () {
      await sbt.connect(alice).mintSBT(DEVICE_ID_1);

      expect(await sbt.balanceOf(aliceAddr)).to.equal(1);
      expect(await sbt.ownerOf(DEVICE_ID_1)).to.equal(aliceAddr);
      expect(await sbt.tokenURI(DEVICE_ID_1)).to.equal(SBT_TOKEN_URI);
    });
    it("User cannot mint a sbt if not approved", async function () {
      await expect(sbt.connect(alice).mintSBT(DEVICE_ID_2)).to.be.revertedWith(
        "ERC721: mint to the zero address"
      );
    });
    it("User cannot mint a sbt if already minted", async function () {
      await sbt.connect(alice).mintSBT(DEVICE_ID_1);

      await expect(sbt.connect(alice).mintSBT(DEVICE_ID_1)).to.be.revertedWith(
        "ERC721: token already minted"
      );
    });
    it("Minter cannot mint a sbt if already minted by user", async function () {
      await sbt.connect(alice).mintSBT(DEVICE_ID_1);

      await expect(
        sbt.connect(minter).safeMint(aliceAddr, DEVICE_ID_1)
      ).to.be.revertedWith("ERC721: token already minted");
    });
    it("Should throw if user tries to approve a sbt", async function () {
      const malloryAddr = await mallory.getAddress();
      const minterRolw = await sbt.MINTER_ROLE();

      await expect(sbt.connect(mallory).approveSBT(malloryAddr, DEVICE_ID_2)).to
        .be.revertedWith(
          `AccessControl: account ${malloryAddr.toLowerCase()} is missing role ${minterRolw.toLowerCase()}`
        );
    });
  });
});

async function setup() {
  await deployments.fixture(["DeviceSBT"]);
  return ethers.getContract("DeviceSBT") as unknown as DeviceSBT;
}

async function grantMinterRole(sbt: DeviceSBT, minter: Signer) {
  const minterRole = await sbt.MINTER_ROLE();
  await sbt.grantRole(minterRole, await minter.getAddress());
}