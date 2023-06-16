"use client";

import { useAccount, useContractReads } from "wagmi";

import { rewardsContract } from "@/features/web3/services/viem/nft";
import { CollectButton } from "./CollectButton";

export const CollectibleList = () => {
  const { address } = useAccount();
  const { data, isLoading } = useContractReads({
    contracts: [
      {
        address: rewardsContract.address,
        abi: rewardsContract.abi as any,
        functionName: "allowance",
        args: [1, address ?? ""],
      },
    ],
    watch: true,
    suspense: true,
  });

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {data?.map((d: any, i: number) => (
        <div
          key={i}
          className="flex flex-col justify-between gap-4 text-center p-8"
        >
          <p>[{tierNames[i]}] </p>
          <p>Available to collect: {Number(d.result || 0)}</p>
          <CollectButton tier={i + 1} />
        </div>
      ))}
    </div>
  );
};

export default CollectibleList;

const tierNames = ["Yoga mat"];
