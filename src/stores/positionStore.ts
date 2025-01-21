import { LatLng } from "leaflet";
import { create } from "zustand";
import useMapStore from "./mapStore";
import { center } from "@/components/Maps";

interface PositionStore {
  position: LatLng | null;
  setPosition: (p: LatLng) => void;
}
const usePositionStore = create<PositionStore>((set) => ({
  position: { lat: 32.879, lng: -86.715 } as LatLng,
  setPosition: (p) => set(() => ({ position: p })),
}));

export default usePositionStore;