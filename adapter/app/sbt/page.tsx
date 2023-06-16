import Rings from "./Rings";

export default function RingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-24">
      <h1 className="text-4xl font-bold">Your Rings:</h1>
      <Rings />
    </main>
  );
}
