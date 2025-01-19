import APIClient from "@/services/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FeatureCollection } from "geojson";

interface AddMapsContext {
  previousMaps: FeatureCollection;
}
const apiClient = new APIClient<FeatureCollection>(`/geodata`);

const useAddMarkerCount = () => {
  const queryClient = useQueryClient();
  return useMutation<FeatureCollection, Error, number, AddMapsContext>({
    mutationFn: (id: number) =>
      apiClient.postWithSubEndpoint(`${id}/updateMarkerCount`),
    onMutate: (id: number) => {
      const previousMaps = queryClient.getQueryData<FeatureCollection>([
        "maps",
      ]) || { type: "FeatureCollection", features: [] };

      queryClient.setQueryData<FeatureCollection>(["maps"], (maps) => {
        const updatedFeatures = maps?.features.map((feature) =>
          feature.id === id
            ? {
                ...feature,
                properties: {
                  ...feature.properties,
                  markerCount: feature.properties?.markerCount + 1,
                },
              }
            : feature
        );

        const newData: FeatureCollection = {
          ...(maps as FeatureCollection),
          features: updatedFeatures || [],
        };
        return newData;
      });

      return { previousMaps };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["maps"],
      });
    },
    onError: (error, variable, context) => {
      queryClient.setQueryData(["maps"], context?.previousMaps);
    },
  });
};

export default useAddMarkerCount;
