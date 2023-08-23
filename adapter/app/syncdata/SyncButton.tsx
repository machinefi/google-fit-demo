"use client";

import { useDeviceIds } from "@/hooks/useDeviceIds";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export const SyncButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const devices = useDeviceIds();

  const handleClick = async () => {
    setTimeout(() => {
      setLoading(true);
    }, 500);

    try {
      await axios.post("/api/pull-data", { deviceId: devices[0] });
      await axios.post("/api/evaluate");
      setSuccess(true);
    } catch (e: any) {
      console.log(e);
      setError(e.response.data.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!devices.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">No devices registered yet.</p>
        <Link href="/register">
          <button className="btn-outline-primary">Register device</button>
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <button onClick={() => setError("")} className="btn-outline-secondary">
        Sync failed. Try again.
      </button>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-evenly gap-4">
        <Link href="/rewards">
          <button className="btn-primary">Go to Rewards</button>
        </Link>
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
      {loading && "Loading..."}
      {success && "Success!"}
      {!loading && !success && "Start sync"}
    </button>
  );
};
