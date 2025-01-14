import { create } from "zustand";

interface DensityStore {
  state: string | null;
  density: number | null;
  markerCount: number | null;
  setState: (state: string) => void;
  setDensity: (density: number) => void;
  setMarkerCount: (count: number) => void;
  reset: () => void;
}

const useDensityStore = create<DensityStore>((set) => ({
  state: null,
  density: null,
  markerCount: null,
  setState: (state) => set(() => ({ state: state })),
  setDensity: (density) => set(() => ({ density: density })),
  setMarkerCount: (count) => set(() => ({ markerCount: count })),
  reset: () => set(() => ({ state: null, density: null, markerCount: null })),
}));

export default useDensityStore;
