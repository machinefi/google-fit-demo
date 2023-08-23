import dynamic from "next/dynamic";

import Wallet from "../components/Wallet";

const CollectibleList = dynamic(() => import("./CollectibleList"), {
  ssr: false,
});

export default function RewardsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-24">
      <h1 className="text-4xl font-bold">Available to collect:</h1>
      <Wallet>
        <CollectibleList />
      </Wallet>
    </main>
  );
}
