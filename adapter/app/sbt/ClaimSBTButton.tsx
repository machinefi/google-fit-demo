"use client";

import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { sbtContract } from "@/features/web3/services/viem/nft";

export const ClaimSBTButton = ({ deviceId }: { deviceId: string }) => {
  const { config } = usePrepareContractWrite({
    address: sbtContract.address,
    abi: sbtContract.abi,
    functionName: "mintSBT",
    args: [deviceId],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite({ ...config });

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
        {isWaiting && <div>Claiming...</div>}
        {!isLoading && !isWaiting && <div>Claim SBT</div>}
      </button>
      {isSuccess && (
        <div className="text-secondary-500">
          Transaction: {JSON.stringify(data)}
        </div>
      )}
    </div>
  );
};
