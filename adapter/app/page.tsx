export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-24">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Oura Demo</h1>
        <p className="text-xl mt-4">
          This is a demo of the{" "}
          <a
            className="text-blue-500 hover:underline"
            target="_blank"
            href="https://ouraring.com"
          >
            Oura Ring
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
          <button className="flex items-center justify-center w-32 h-32 rounded-full text-white bg-blue-500 hover:bg-blue-700 text-2xl font-bold">
            Get Started
          </button>
        </a>
      </div>
    </main>
  );
}
