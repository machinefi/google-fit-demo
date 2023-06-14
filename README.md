# Oura Ring integration with W3bstream

_An example of tokenizing sleep data proof via [W3bstream protocol](https://w3bstream.com) and [Oura Cloud](https://ouraring.com/developer)_

## Table of Contents

- [Prerequisites](#prerequisites)
  - [NFT URI](#nft-uri)
  - [Upstash](#upstash)
- [Project Setup and Execution Instructions](#project-setup-and-execution-instructions)
  - [Step 1: Repository Cloning and Dependency Installation](#step-1-repository-cloning-and-dependency-installation)
  - [Step 2: Blockchain Environment Preparation](#step-2-blockchain-environment-preparation)
  - [Step 3: Applet Modification](#step-3-applet-modification)
  - [Step 4: Blockchain Environment Adjustment](#step-4-blockchain-environment-adjustment)
  - [Step 5: Adapter Configuration](#step-5-adapter-configuration)

## Prerequisites

Before you begin, there are several prerequisites that must be met:

### NFT URI

- Upload your NFT images and the corresponding metadata to a file storage of your choice.
> [Pinata](https://pinata.cloud/) is recommended for this purpose, and you can follow [this guide](https://docs.pinata.cloud/nfts#now-how-do-i-create-a-file-like-this) for detailed instructions.
- You will need to upload one image and one metadata JSON file for the ERC721 Ring NFT.
- For the ERC1155 Sleepr NFT, upload three images along with their corresponding metadata JSON files to represent the Silver, Golden, and Platinum tiers.
- Example files can be found in the `blockchain/assets` directory.

### Upstash

> For storing encrypted Oura Personal Access Tokens and tracking the last data synchronization timestamp, we use a serverless database with a Redis API. We recommend Upstash for this, as it offers a user-friendly interface for setting up such databases.
- Create a new database in [Upstash](https://console.upstash.com/).
- Keep note of the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` variables. You can find these in the `Details` page under the `REST API` section.

## Project Setup and Execution Instructions

Follow the steps below to set up and run the project.

### Step 1: Repository Cloning and Dependency Installation

- Begin by clicking "use this template" which houses three directories: `adapter`, `applet`, and `blockchain`.
- Install the necessary dependencies in each directory by running `npm i`.

### Step 2: Blockchain Environment Preparation

- In the `blockchain` directory, create a `.env` file. Populate this file with the contents of `.env.template`.
- Provide your `PRIVATE_KEY` that will be responsible for contract deployment and access control tasks.
- Update the `RING_URI` and `SLEEPR_URI` variables in the `.env` file as per your setup (see [NFT URI](#nft-uri)):

  ```env
  RING_URI=ipfs://QmPyy2ug3WowMZCdQgzA69pu6mn3PzghASV8rcKiu4uw31
  SLEEPR_URI="ipfs://QmUWjpuGGgqQQygrTfRaytB1Z9edd8wRiWx5kvzQudNTxy/{id}.json"
  ```
- The `OPERATOR_ADDRESS` will be acquired in the subsequent step.
- Compile the contracts and generate contract types by running `npm run compile`.
- Ensure everything is working by running `npm run test`.
- Deploy your contracts by executing `npm run deploy:testnet`.

### Step 3: Applet Modification

- In the `applet/wsproject.json` file, change the project name from "sleep_and_earn" to your preferred name.
- Compile the AssemblyScript code by navigating to the `applet` directory and running `npm run asbuild`.
- Import the modified project into the W3bstream studio. Use `applet/wsproject.json` as the `Project file` and `applet/build/release.wasm` as the `Wasm file`.
- Generate a new device in the studio (Devices -> Create Device).
- Send a test message in Log.
- Boost the operator address with Testnet IOTX token. The operator address can be found in Settings. An estimated 5 IOTX should suffice.

### Step 4: Blockchain Environment Adjustment

- Return to the `blockchain` directory and update the `OPERATOR_ADDRESS` in your `.env` file.
- Run `npx hardhat grant-ring-minter --network testnet` to assign the Ring minter role to the W3bstream operator.
- Run `npx hardhat grant-sleepr-minter --network testnet` to assign the Sleepr minter role to the W3bstream operator.

### Step 5: Adapter Configuration

- Create a new file named `.env.local` and populate it with the variables from `.env.template`.
- Navigate to Devices in the studio interface to find the device token and update `DEVICE_TOKEN`.
- Find the `HTTP_ROUTE` under Events.
- Start the client by running `npm run dev` and navigate to localhost:3000 in your web browser.
- Follow the on-screen instructions to register your device, check encrypted token in the Redis db Data Browser, and claim your SBT.
- Sync the Oura data and then recheck the studio db and proceed to claim your rewards.
- Import the NFTs into Metamask.

Congratulations, you have successfully set up and run your project!
