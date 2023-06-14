export interface SleepData {
  id: string;
  score: number;
  timestamp: string;
}

export interface SleepDataRaw {
  id: string;
  score: number;
  timestamp: string;
  day: string;
  contributors: {
    deep_sleep: number;
    efficiency: number;
    latency: number;
    rem_sleep: number;
    restfulness: number;
    timing: number;
    total_sleep: number;
  };
}
