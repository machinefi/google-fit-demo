# Google Fit integration with W3bstream

_An example of tokenizing training session proofs via [W3bstream protocol](https://w3bstream.com) and [Google Fit](https://www.google.com/fit/)_

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

### Google OAuth Client

To get access to the Fitness REST API we will need to create an OAuth Client. Follow [these steps](https://developers.google.com/fit/rest/v1/get-started) to obtain GOOGLE_ID (Client ID) and GOOGLE_SECRET (Client secret)

### NFT URI

> You will need to upload one image and one metadata JSON file for the ERC721 Device SBT.
> For the ERC1155 Rewards - one image along with its corresponding metadata JSON file to represent the Rewards for completed training sessions.

Upload your NFT images and the corresponding metadata to a file storage of your choice or use a script in `nft` directory that will upload files to [Arweave](https://www.arweave.org) via [Bundlr](https://bundlr.network):

- After cloning the repo navigate to `nft` directory and run `npm i`
- In `assets` subdir you can find images for SBT and Rewards NFTs. _You can update images with your own, but don't forget to update config file in `src/config`_
- Create `.env` file and add your `PRIVATE_KEY` _(The account will be used to pay Bundlr fees with testnet tokens, please make sure to top up the corresponding account with some Matic tokens, [link to faucet](https://mumbaifaucet.com))_
- Run `npm start`
- You'll find NFT URIs in `nft/uploads.json` (you'll need them at [Step 2](#step-2-blockchain-environment-preparation))
- _If funding while uploading fails, you can manually run fund script first `npm run fund`_

### Upstash

> For storing encrypted Oura Personal Access Tokens and tracking the last data synchronization timestamp, we use a serverless database with a Redis API. We recommend Upstash for this, as it offers a user-friendly interface for setting up such databases.

- Create a new database in [Upstash](https://console.upstash.com/).
- Keep note of the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` variables. You can find these in the `Details` page under the `REST API` section.

## Project Setup and Execution Instructions

Follow the steps below to set up and run the project.

### Step 1: Repository Cloning and Dependency Installation

- Begin by clicking "use this template" which houses three directories: `adapter`, `applet` and `blockchain`.
- Install the necessary dependencies in each directory by running `npm i`.

### Step 2: Blockchain Environment Preparation

- In the `blockchain` directory, create a `.env` file. Populate this file with the contents of `.env.template`.
- Provide your `PRIVATE_KEY` that will be responsible for contract deployment and access control tasks.
- Update the `SBT_URI` and `REWARDS_URI` variables in the `.env` file as per your setup (see [NFT URI](#nft-uri)).
- _Opitional: update contract names `SBT_CONTRACT_NAME` and `REWARDS_CONTRACT_NAME`_
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
- Run `npx hardhat grant-sbt-minter --network testnet` to assign the SBT minter role to the W3bstream operator.
- Run `npx hardhat grant-rewards-minter --network testnet` to assign the Rewards NFT minter role to the W3bstream operator.

### Step 5: Adapter Configuration

- Create a new file named `.env.local` and populate it with the variables from `.env.template`.
- Navigate to Devices in the studio interface to find the device token and update `DEVICE_TOKEN`.
- `NEXTAUTH_SECRET` can be aquired in [Vercel secret generator](https://generate-secret.vercel.app/32)
- Find the `HTTP_ROUTE` under Events.
- Start the client by running `npm run dev` and navigate to localhost:3000 in your web browser.
- Follow the on-screen instructions to register your device and claim your SBT.
- Sync the Google Fit data and then recheck the studio db and proceed to claim your rewards.
- Import the NFTs into Metamask.

Congratulations, you have successfully set up and run your project!
