import { create } from "zustand";

interface OuraToken {
  ouraToken: string;
  setOuraToken: (token: string) => void;
  ouraRefreshToken: () => void;
}

const useStore = create<OuraToken>()((set) => ({
  ouraToken: "",
  setOuraToken: (token: string) => set({ ouraToken: token }),
  ouraRefreshToken: () => set({ ouraToken: "" }),
}));

export default useStore;
