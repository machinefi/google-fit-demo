"use client";

import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { ringContract } from "@/features/web3/services/viem/nft";

export const ClaimSBTButton = ({ ringId }: { ringId: string }) => {
  const { config } = usePrepareContractWrite({
    address: ringContract.address,
    abi: ringContract.abi,
    functionName: "mintRing",
    args: [ringId],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite({ ...config });

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
        Claim SBT
      </button>
      {isLoading && <div>Check Wallet</div>}
      {isWaiting && <div>Claiming...</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
    </div>
  );
};
