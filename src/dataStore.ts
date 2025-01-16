import { FeatureCollection } from "geojson";
import { create } from "zustand";
import { statesData } from "./data/us-states";
import useMaps from "./hooks/useMaps";

interface DataStore {
  data: FeatureCollection;
  key: number;
  // setData: (featureId: string | number | undefined) => void;
  setData: (data: FeatureCollection) => void;
}

const { data, dataUpdatedAt, isSuccess } = useMaps();

const useDataStore = create<DataStore>((set) => ({
  data: data,
  key: Date.now(),
  setData: (data) =>
    set(() => ({
      data: data,
      key: Date.now(),
    })),
}));

// const updateFeature = (
//   prevData: FeatureCollection,
//   featureId: string | number | undefined
// ) => {
//   const updatedFeatures = prevData.features.map((feature) =>
//     feature.id === featureId
//       ? {
//           ...feature,
//           properties: {
//             ...feature.properties, // Ensure properties are spread correctly
//             markerCount: feature.properties?.markerCount + 1,
//           },
//         }
//       : feature
//   );

//   const newData = {
//     ...prevData,
//     features: updatedFeatures,
//   };
//   return newData;
// };

export default useDataStore;
