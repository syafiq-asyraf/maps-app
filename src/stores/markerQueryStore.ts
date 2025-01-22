import { create } from "zustand";

interface MarkerQuery {
  parentId?: number;
}

interface MarkerQueryStore {
  markerQuery: MarkerQuery;
  setParentId: (parentId: number) => void;
  resetMarkerQuery: () => void;
}

const useMarkerQueryStore = create<MarkerQueryStore>((set) => ({
  markerQuery: {},
  setParentId: (parentId) =>
    set((store) => ({
      markerQuery: { ...store.markerQuery, parentId: parentId },
    })),
  resetMarkerQuery: () => set(() => ({ markerQuery: {} })),
}));

export default useMarkerQueryStore;
