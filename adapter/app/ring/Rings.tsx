"use client";

import Wallet from "../components/Wallet";
import { ClaimSBTButton } from "./ClaimSBTButton";
import { useDeviceIds } from "@/hooks/useDeviceIds";

export default function Rings() {
  const devices = useDeviceIds();

  if (!devices.length) {
    return <EmptyRingList />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {devices.map((device) => (
        <div
          key={device}
          className="flex flex-col text-center items-center justify-center gap-4"
        >
          <p className="text-white">{device}</p>
          <Wallet>
            <ClaimSBTButton ringId={device} />
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
