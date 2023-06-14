"use client";

import dynamic from "next/dynamic";

const ConnectButton = dynamic(
  () => import("@/features/web3/components/ConnectButton"),
  {
    ssr: false,
    loading: () => <div>Loding web3 providers...</div>,
  }
);

export default ConnectButton;
