import { create } from "zustand";

interface DensityStore {
  state: string | null;
  density: number | null;
  setState: (state: string) => void;
  setDensity: (density: number) => void;
  reset: () => void;
}

const useDensityStore = create<DensityStore>((set) => ({
  state: null,
  density: null,
  setState: (state) => set(() => ({ state: state })),
  setDensity: (density) => set(() => ({ density: density })),
  reset: () => set(() => ({ state: null, density: null })),
}));

export default useDensityStore;
