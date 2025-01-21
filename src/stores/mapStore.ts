import { Map } from "leaflet";
import { create } from "zustand";

interface MapStore {
  mapInstance: Map | null;
  setMapInstance: (m: Map) => void;
}

const useMapStore = create<MapStore>((set) => ({
  mapInstance: null,
  setMapInstance: (m) => set(() => ({ mapInstance: m })),
}));

export default useMapStore;
