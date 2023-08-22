"use client";

import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { rewardsContract } from "@/features/web3/services/viem/nft";

export const CollectButton = ({ tier }: { tier: number }) => {
  const { config } = usePrepareContractWrite({
    address: rewardsContract.address,
    abi: rewardsContract.abi,
    functionName: "mintFromAllowance",
    args: [tier, ""],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const { isLoading: isWaiting } = useWaitForTransaction({
    hash: data?.hash,
    confirmations: 1,
  });

  return (
    <div>
      <button
        disabled={!write || isLoading || isWaiting}
        onClick={() => write?.()}
      >
        Collect
      </button>
      {isLoading && <div>Check Wallet</div>}
      {isWaiting && <div>Collecting...</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
    </div>
  );
};
