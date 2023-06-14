import { configureChains, createConfig } from "wagmi";
import { iotexTestnet, iotex, mainnet, polygon, bsc } from "@wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { connectors } from "./connectors";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [iotexTestnet, iotex, mainnet, polygon, bsc],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
  ]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: connectors(chains),
});

export default config;
