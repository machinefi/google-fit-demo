"use client";

import Link from "next/link";
import Wallet from "../components/Wallet";
import { ClaimSBTButton } from "./ClaimSBTButton";
import { useDeviceIds } from "@/hooks/useDeviceIds";

export default function Devices() {
  const devices = useDeviceIds();

  if (!devices.length) {
    return <EmptyDevicesList />;
  }

  return (
    <div className="flex flex-col items-center gap-8">
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
      <Link href="/syncdata">
        <button className="btn-outline-primary">Sync device data</button>
      </Link>
    </div>
  );
}

const EmptyDevicesList = () => (
  <div className="flex flex-col items-center justify-center gap-4">
    <p className="text-white">No devices registered yet.</p>
    <Link href="/register">
      <button className="btn-outline-primary">Register device</button>
    </Link>
  </div>
);
