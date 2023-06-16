import Devices from "./Devices";

export default function DevicesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-24">
      <h1 className="text-4xl font-bold">Your Devices:</h1>
      <Devices />
    </main>
  );
}
