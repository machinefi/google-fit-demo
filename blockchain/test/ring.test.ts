import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { DEVICE_ID_1, DEVICE_ID_2, URI_EXAMPLE } from "./fixtures";
import { Ring } from "../typechain-types";

async function setup() {
  const ring = await ethers.getContractFactory("Ring");
  const ringInstance = await ring.deploy(URI_EXAMPLE);
  await ringInstance.deployed();

  const contracts = {
    Ring: ringInstance as Ring,
  };

  return {
    ...contracts,
  };
}

async function grantMinterRole(ring: Ring, minter: SignerWithAddress) {
  const minterRole = await ring.MINTER_ROLE();
  await ring.grantRole(minterRole, minter.address);
}

describe("Ring", function () {
  let [admin, user, badGuy, minter]: SignerWithAddress[] = [];
  let ring: Ring;
  before(async function () {
    [admin, user, badGuy, minter] = await ethers.getSigners();
  });
  beforeEach(async function () {
    const { Ring } = await setup();
    ring = Ring;
    await grantMinterRole(ring, minter);
  });
  it("Should deploy Ring", async function () {
    expect(await ring.name()).to.equal("Ring");
    expect(await ring.symbol()).to.equal("RING");
  });
  it("Minter should be able to mint one token to a user", async function () {
    await ring.connect(minter).safeMint(user.address, DEVICE_ID_1);

    expect(await ring.balanceOf(user.address)).to.equal(1);
    expect(await ring.ownerOf(DEVICE_ID_1)).to.equal(user.address);
    expect(await ring.tokenURI(DEVICE_ID_1)).to.equal(URI_EXAMPLE);
  });
  it("Minter should be able to mint multiple tokens to a user", async function () {
    await ring.connect(minter).safeMint(user.address, DEVICE_ID_1);
    await ring.connect(minter).safeMint(user.address, DEVICE_ID_2);

    expect(await ring.balanceOf(user.address)).to.equal(2);
  });
  it("User should not be able to transfer SBT to another user", async function () {
    await ring.connect(minter).safeMint(user.address, DEVICE_ID_1);

    await expect(
      ring.connect(user).transferFrom(user.address, badGuy.address, DEVICE_ID_1)
    ).to.be.revertedWith("Ring: Only minting allowed");
  });
  it("Minter cannot mint a token with an already used device id", async function () {
    await ring.connect(minter).safeMint(user.address, DEVICE_ID_1);

    await expect(
      ring.connect(minter).safeMint(user.address, DEVICE_ID_1)
    ).to.be.revertedWith("ERC721: token already minted");
  });
  it("Minter can approve a user to mint a ring token", async function () {
    await ring.connect(minter).approveRing(user.address, DEVICE_ID_1);
    expect(await ring.ringApprovals(DEVICE_ID_1)).to.equal(user.address);
  });
  it("Should throw if user tries to approve a ring token", async function () {
    await expect(ring.connect(badGuy).approveRing(badGuy.address, DEVICE_ID_1))
      .to.be.reverted;
  });
  it("User can mint a ring token if approved", async function () {
    await ring.connect(minter).approveRing(user.address, DEVICE_ID_1);
    await ring.connect(user).mintRing(DEVICE_ID_1);

    expect(await ring.balanceOf(user.address)).to.equal(1);
    expect(await ring.ownerOf(DEVICE_ID_1)).to.equal(user.address);
    expect(await ring.tokenURI(DEVICE_ID_1)).to.equal(URI_EXAMPLE);
  });
  it("User cannot mint a ring token if not approved", async function () {
    await expect(ring.connect(user).mintRing(DEVICE_ID_1)).to.be.revertedWith(
      "ERC721: mint to the zero address"
    );
  });
  it("User cannot mint a ring token if already minted", async function () {
    await ring.connect(minter).approveRing(user.address, DEVICE_ID_1);
    await ring.connect(user).mintRing(DEVICE_ID_1);

    await expect(ring.connect(user).mintRing(DEVICE_ID_1)).to.be.revertedWith(
      "ERC721: token already minted"
    );
  });
  it("Minter cannot mint a ring token if already minted by user", async function () {
    await ring.connect(minter).approveRing(user.address, DEVICE_ID_1);
    await ring.connect(user).mintRing(DEVICE_ID_1);

    await expect(
      ring.connect(minter).safeMint(user.address, DEVICE_ID_1)
    ).to.be.revertedWith("ERC721: token already minted");
  });
  it("admin can update uri", async function () {
    await ring.connect(admin).setURI(URI_EXAMPLE + "2");
    await ring.connect(minter).safeMint(user.address, DEVICE_ID_1);
    expect(await ring.tokenURI(DEVICE_ID_1)).to.equal(URI_EXAMPLE + "2");
  })
});
