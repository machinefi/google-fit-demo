import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

export const connectors = (chains: any) => [
  new InjectedConnector({ chains }),
  // new MetaMaskConnector({ chains }),
];
