"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import axios from "axios";

import { useSession } from "next-auth/react";

export const RegisterButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { address: ownerAddr, isDisconnected } = useAccount();

  const { data: session } = useSession();

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/register", {
        ownerEmail: session?.user?.email,
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
      </div>
    );
  }

  return (
    <button
      disabled={isDisconnected || loading || success || !session?.user?.email}
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
