import { SyncButton } from "./SyncButton";

export default function SyncDataPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-24">
      <h1 className="text-4xl font-bold">Sync your sleep data:</h1>
      <SyncButton />
    </main>
  );
}
