import { create } from "zustand";

interface DescriptionStore {
  state: string | null;
  markerCount: number | null;
  setState: (state: string) => void;
  setMarkerCount: (count: number) => void;
  reset: () => void;
}

const useDescriptionStore = create<DescriptionStore>((set) => ({
  state: null,
  markerCount: null,
  setState: (state) => set(() => ({ state: state })),
  setMarkerCount: (count) => set(() => ({ markerCount: count })),
  reset: () => set(() => ({ state: null, markerCount: null })),
}));

export default useDescriptionStore;
