"use client";

import useStore from "../../store";

export const OuraTokenInput = () => {
  const { ouraToken, setOuraToken } = useStore((state) => state);

  return (
    <div className="flex flex-col items-center justify-center">
      <label htmlFor="oura-token" className="text-2xl font-bold">
        Provide your{" "}
        <a
          className="text-blue-500 hover:underline"
          target="_blank"
          href="https://cloud.ouraring.com/personal-access-tokens"
        >
          Oura Personal Access Token
        </a>
      </label>
      <input
        id="oura-token"
        type="password"
        className="w-full border border-gray-400 rounded-lg px-4 py-2 mt-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        value={ouraToken}
        onChange={(e) => setOuraToken(e.target.value)}
      />
    </div>
  );
};
