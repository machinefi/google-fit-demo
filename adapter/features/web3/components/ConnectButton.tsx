import { useAccount, useConnect } from "wagmi";

export const ConnectButton = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useAccount();

  return (
    <>
      {isConnected ? (
        <div className="flex flex-col gap-4">{children}</div>
      ) : (
        <ConnectHanlder />
      )}
    </>
  );
};

export default ConnectButton;

const ConnectHanlder = () => {
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
