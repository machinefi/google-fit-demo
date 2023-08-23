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
    <div className="flex flex-col items-center gap-2">
      <button
        className="btn-outline-primary"
        disabled={!write || isLoading || isWaiting}
        onClick={() => write?.()}
      >
        {isLoading && <div>Check Wallet</div>}
        {isWaiting && <div>Collecting...</div>}
        {!isLoading && !isWaiting && <div>Collect</div>}
      </button>
      {isSuccess && (
        <div className="text-secondary-500">
          Transaction: {JSON.stringify(data)}
        </div>
      )}
    </div>
  );
};
