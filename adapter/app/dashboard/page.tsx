const features = [
  {
    title: "Claim SBT",
    description: "Claim SBT for your Device",
    buttonText: "Claim Now",
    buttonLink: "/sbt",
  },
  {
    title: "Sync Your Google Fit data",
    description: "Sync your Google Fit data to the w3bstream",
    buttonText: "Start Syncing",
    buttonLink: "/syncdata",
  },
  {
    title: "Collect NFTs",
    description: "Collect NFTs for your training sessions",
    buttonText: "Start Collecting",
    buttonLink: "/rewards",
  },
];

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-24">
      <h1 className="text-4xl font-bold">Features</h1>
      <div className="grid grid-rows-3 gap-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            buttonText={feature.buttonText}
            buttonLink={feature.buttonLink}
          />
        ))}
      </div>
    </main>
  );
}

const FeatureCard = ({
  title,
  description,
  buttonText,
  buttonLink,
}: {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}) => {
  return (
    <div className="flex flex-col justify-between w-full max-w-md bg-gray-800 shadow-md rounded-lg overflow-hidden mx-auto">
      <div className="py-4 px-6">
        <div className="text-center font-bold text-xl mb-2 text-white">
          {title}
        </div>
        <p className="text-center text-gray-300 text-base">{description}</p>
      </div>
      <a href={buttonLink}>
        <button className="w-full bg-gray-700 py-4 text-gray-300 text-sm font-semibold uppercase">
          {buttonText}
        </button>
      </a>
    </div>
  );
};
