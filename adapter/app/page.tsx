import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-24">
      <div className="flex flex-col items-center justify-center">
        <Title />
        <Description />
      </div>
      <StartButton />
    </main>
  );
}

const Title = () => <h1>Google Fit Demo &lt;&gt; W3bstream</h1>;

const Description = () => (
  <p className="text-xl text-center mt-4">
    This is a demo of the{" "}
    <a target="_blank" href="https://www.google.com/fit/">
      Google Fit
    </a>{" "}
    integration with{" "}
    <a target="_blank" href="https://w3bstream.com/">
      W3bstream
    </a>
  </p>
);

const StartButton = () => (
  <div className="group flex flex-col items-center justify-center">
    <Link
      href="/register"
      className="text-neutral-200 font-semibold group-hover:text-primary-100"
    >
      <button
        className="flex items-center justify-center w-32 h-32 rounded-full 
        text-2xl border-2 border-primary-500 shadow-2xl shadow-primary-500/50 transition
        group-hover:translate-y-0.5 group-hover:shadow-primary-500 duration-300"
      >
        Start
      </button>
    </Link>
  </div>
);
