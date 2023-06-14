"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import axios from "axios";

import useStore from "@/store";

export const RegisterButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { ouraToken } = useStore((state) => state);
  const { address: ownerAddr, isDisconnected } = useAccount();

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/register", {
        ouraToken,
        ownerAddr,
      });
      const { emailHashed } = res.data;
      updateDevicesInLocalStorage(emailHashed);
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
            Go to Dashboard
          </button>
        </a>
        <button
          onClick={() => setSuccess(false)}
          className="bg-transparent hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Register Another
        </button>
      </div>
    );
  }

  return (
    <button
      disabled={isDisconnected || loading || success}
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
    >
      {isDisconnected && "Connect Wallet"}
      {loading && "Loading..."}
      {success && "Success!"}
      {!isDisconnected && !loading && !success && "Register"}
    </button>
  );
};

const updateDevicesInLocalStorage = (emailHashed: string) => {
  const storedDevices = localStorage.getItem("devices");
  const parsedDevices = JSON.parse(storedDevices || "[]") as string[];
  const newDevices = [emailHashed, ...parsedDevices];
  localStorage.setItem("devices", JSON.stringify(newDevices));
};
