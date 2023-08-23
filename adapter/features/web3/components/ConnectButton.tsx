import { useAccount, useConnect, useNetwork, useSwitchNetwork } from "wagmi";
import { iotexTestnet } from "wagmi/chains";

export const ConnectButton = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  if (!isConnected || !chain?.id) {
    return <ConnectHandler />;
  }

  if (chain.unsupported || chain.id !== iotexTestnet.id) {
    return <SwitchHandler />;
  }

  return <>{children}</>;
};

export default ConnectButton;

const ConnectHandler = () => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  if (error) {
    return (
      <>
        error && <div>{error.message}</div>
      </>
    );
  }

  return (
    <div className="flex flex-col">
      {connectors.map((connector) => (
        <button
          className="btn"
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          Connect
          {isLoading &&
            pendingConnector?.id === connector.id &&
            " (connecting)"}
        </button>
      ))}
    </div>
  );
};

const SwitchHandler = () => {
  const { isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();

  return (
    <div className="flex flex-col gap-2 items-center">
      Switch to a supported network:
      <button
        disabled={!switchNetwork || isLoading}
        key={iotexTestnet.id}
        onClick={() => switchNetwork?.(iotexTestnet.id)}
        className="btn-primary w-full"
      >
        {iotexTestnet.name}
        {isLoading && pendingChainId === iotexTestnet.id && " (switching)"}
      </button>
    </div>
  );
};
