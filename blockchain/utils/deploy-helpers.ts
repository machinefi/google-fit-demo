import { DeployResult } from "hardhat-deploy/types";

import { DEFAULT_BLOCK_START, DEFAULT_BLOCK_END, HARDHAT_CHAIN_ID } from "../constants";
import { addEnvVarToWSProjectConfig } from "./update-envs";
import { updateContractMonitor } from "./update-monitor";

export function updateWsConfig(chainId: string, tx: DeployResult, eventType: string, topic0: string) {
    if (chainId === HARDHAT_CHAIN_ID) {
        return;
    }

    updateContractMonitor({
        eventType,
        chainID: Number(chainId),
        contractAddress: tx.address,
        blockStart: tx.receipt?.blockNumber || DEFAULT_BLOCK_START,
        blockEnd: DEFAULT_BLOCK_END,
        topic0,
    });
    updateChainId(chainId);
}

export function logDeploymendBlock(constactName: string, tx: DeployResult) {
    console.log(`${constactName} deployed at block: `, tx.receipt?.blockNumber);
}

export function updateWsConfigEnv(chainId: string, tx: DeployResult, envName: string) {
    if (chainId === HARDHAT_CHAIN_ID) {
        return;
    }

    addEnvVarToWSProjectConfig({
        envName,
        envValue: tx.address,
    });
    updateChainId(chainId);
}

function updateChainId(chainId: string) {
    addEnvVarToWSProjectConfig({
        envName: "CHAIN_ID",
        envValue: chainId,
    });
}
