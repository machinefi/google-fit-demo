import "client-only";

import { useState } from "react";

export const useTimer = (seconds: number) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [started, setStarted] = useState(false);

  const reset = () => {
    setTimeLeft(seconds);
  };

  const tick = () => {
    setTimeLeft((prev) => prev - 1);
  };

  const start = () => {
    setStarted(true);
  };

  const stop = () => {
    setStarted(false);
  };

  return { timeLeft, reset, tick, started, start, stop };
};
