import { create } from "zustand";

interface DensityStore {
  state: string | null;
  markerCount: number | null;
  setState: (state: string) => void;
  setMarkerCount: (count: number) => void;
  reset: () => void;
}

const useDensityStore = create<DensityStore>((set) => ({
  state: null,
  markerCount: null,
  setState: (state) => set(() => ({ state: state })),
  setMarkerCount: (count) => set(() => ({ markerCount: count })),
  reset: () => set(() => ({ state: null, markerCount: null })),
}));

export default useDensityStore;
