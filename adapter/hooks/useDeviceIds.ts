import "client-only";
import { useEffect, useState } from "react";

export const useDeviceIds = (): string[] => {
  const [devices, setDevices] = useState<string[]>([]);

  useEffect(() => {
    const deviceIds = localStorage.getItem("devices");
    if (deviceIds) {
      const ids = JSON.parse(deviceIds);
      const validIds = ids.filter((id: string) => !!id);
      setDevices(validIds);
    }
  }, []);

  return devices;
};
