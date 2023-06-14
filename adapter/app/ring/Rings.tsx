"use client";

import { useEffect, useState } from "react";

import Wallet from "../components/Wallet";
import { ClaimSBTButton } from "./ClaimSBTButton";

export default function Rings() {
  const [rings, setRings] = useState<string[]>([]);

  useEffect(() => {
    const rings = localStorage.getItem("devices");
    if (rings) {
      setRings(JSON.parse(rings));
    }
  }, []);

  if (!rings.length) {
    return <EmptyRingList />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {rings.map((ring) => (
        <div
          key={ring}
          className="flex flex-col text-center items-center justify-center gap-4"
        >
          <p className="text-white">{ring}</p>
          <Wallet>
            <ClaimSBTButton ringId={ring} />
          </Wallet>
        </div>
      ))}
    </div>
  );
}

const EmptyRingList = () => (
  <div className="flex flex-col items-center justify-center gap-4">
    <p className="text-white">No rings registered yet.</p>
    <a href="/register">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Register Ring
      </button>
    </a>
  </div>
);
