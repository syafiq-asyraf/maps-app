import APIClient from "@/services/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MarkerData } from "./useMarkers";
import useMarkerQueryStore from "@/stores/markerQueryStore";

export interface MarkerContext {
  previousMarkers: MarkerData[];
}

const apiClient = new APIClient<MarkerData>("/marker/addMarker");

const useAddMarker = () => {
  const queryClient = useQueryClient();
  const markerQuery = useMarkerQueryStore((s) => s.markerQuery);
  return useMutation<MarkerData, Error, MarkerData, MarkerContext>({
    mutationFn: apiClient.post,
    onMutate: (newMarker: MarkerData) => {
      const previousMarkers =
        queryClient.getQueryData<MarkerData[]>(["markers", markerQuery]) || [];

      queryClient.setQueryData<MarkerData[]>(
        ["markers", markerQuery],
        (markers) => [...(markers || []), newMarker]
      );
      return { previousMarkers };
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["markers", markerQuery],
      }),
    onError: (error, variable, context) => {
      queryClient.setQueryData(
        ["markers", markerQuery],
        context?.previousMarkers
      );
    },
  });
};

export default useAddMarker;
