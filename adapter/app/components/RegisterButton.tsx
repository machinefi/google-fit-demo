"use client";

import { useRef, useState } from "react";
import { useAccount } from "wagmi";
import axios from "axios";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTimer } from "@/hooks/useTimer";

export const RegisterButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { timeLeft, reset, tick, started, start, stop } = useTimer(30);
  const { address: ownerAddr, isDisconnected } = useAccount();

  const { data: session } = useSession();

  const countDown = useRef<NodeJS.Timeout>();

  const handleClick = async () => {
    setTimeout(() => {
      setLoading(true);
    }, 500);

    setTimeout(() => {
      start();
      countDown.current = setInterval(() => {
        tick();
      }, 1000);
    }, 2000);

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
      clearInterval(countDown.current!);
      stop();
      reset();
    }
  };

  if (error) {
    return (
      <button
        onClick={() => setError("")}
        className="btn-outline-secondary w-1/3"
      >
        Failed to register. Try again.
      </button>
    );
  }

  if (success) {
    return (
      <Link href="/sbt" className="flex flex-col w-1/3">
        <button className="btn-primary">See devices</button>
      </Link>
    );
  }

  return (
    <button
      disabled={isDisconnected || loading || success || !session?.user?.email}
      onClick={handleClick}
      className="btn-outline-primary"
    >
      {isDisconnected && "Connect Wallet"}
      {loading && "Loading..."}
      {started && timeLeft > 0 && `${timeLeft}s`}
      {success && "Success!"}
      {!isDisconnected && !loading && !success && "Register"}
    </button>
  );
};

const updateDevicesInLocalStorage = (emailHashed: string) => {
  localStorage.setItem("devices", JSON.stringify([emailHashed]));
};
