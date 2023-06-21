export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-24">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Google Fit Demo</h1>
        <p className="text-xl mt-4">
          This is a demo of the{" "}
          <a
            className="text-blue-500 hover:underline"
            target="_blank"
            href="https://www.google.com/fit/"
          >
            Google Fit
          </a>{" "}
          integration with{" "}
          <a
            className="text-blue-500 hover:underline"
            target="_blank"
            href="https://w3bstream.com/"
          >
            W3bstream
          </a>
        </p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <a href="/register">
          <button className="flex items-center justify-center w-32 h-32 rounded-full bg-gradient-radial from-violet-500 to-fuchsia-500 text-2xl shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500">
            Start
          </button>
        </a>
      </div>
    </main>
  );
}
