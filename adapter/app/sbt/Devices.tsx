"use client";

import Wallet from "../components/Wallet";
import { ClaimSBTButton } from "./ClaimSBTButton";
import { useDeviceIds } from "@/hooks/useDeviceIds";

export default function Devices() {
  const devices = useDeviceIds();

  if (!devices.length) {
    return <EmptyDevicesList />;
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
            <ClaimSBTButton deviceId={device} />
          </Wallet>
        </div>
      ))}
    </div>
  );
}

const EmptyDevicesList = () => (
  <div className="flex flex-col items-center justify-center gap-4">
    <p className="text-white">No devices registered yet.</p>
    <a href="/register">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Register Device
      </button>
    </a>
  </div>
);
