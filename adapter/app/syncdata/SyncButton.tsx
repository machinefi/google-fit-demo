"use client";

import axios from "axios";
import { useState } from "react";

export const SyncButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await axios.post("/api/pull-data");
      await axios.post("/api/evaluate");
      setSuccess(true);
    } catch (e: any) {
      console.log(e);
      setError(e.response.data.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <button
          onClick={() => setError("")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-evenly gap-4">
        <a href="/dashboard">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Go to Dashboard and try to collect your NFTs
          </button>
        </a>
        <button
          onClick={() => setSuccess(false)}
          className="bg-transparent hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sync Another
        </button>
      </div>
    );
  }

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      disabled={loading || success}
      onClick={handleClick}
    >
      Sync Data
    </button>
  );
};
