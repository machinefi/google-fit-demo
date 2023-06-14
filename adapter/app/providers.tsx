"use client";

import { WagmiConfig } from "wagmi";
import { SessionProvider } from "next-auth/react";

import wagmiCongig from "@/features/web3/services/wagmi/client";
import { Session } from "next-auth";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <WagmiConfig config={wagmiCongig}>{children}</WagmiConfig>
    </SessionProvider>
  );
}
