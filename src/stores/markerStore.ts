import { create } from "zustand";

interface MarkerStore {
  showMarker: boolean;
  selectedMarker: number;
  setShowMarker: (s: boolean) => void;
  setSelectedMarker: (m: number) => void;
}

const useMarkerStore = create<MarkerStore>((set) => ({
  showMarker: false,
  selectedMarker: 0,
  setShowMarker: (s) => set(() => ({ showMarker: s })),
  setSelectedMarker: (m) => set(() => ({ selectedMarker: m })),
}));

export default useMarkerStore;
