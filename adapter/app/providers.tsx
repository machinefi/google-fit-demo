"use client";

import { WagmiConfig } from "wagmi";

import wagmiCongig from "@/features/web3/services/wagmi/client";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiCongig}>{children}</WagmiConfig>;
}
