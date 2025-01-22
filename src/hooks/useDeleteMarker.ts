import APIClient from "@/services/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MarkerData } from "./useMarkers";
import { MarkerContext } from "./useAddMarker";
import useMarkerQueryStore from "@/stores/markerQueryStore";

const apiClient = new APIClient("/marker/deleteMarker");

const useDeleteMarker = () => {
  const queryClient = useQueryClient();
  const markerQuery = useMarkerQueryStore((s) => s.markerQuery);
  return useMutation<MarkerData, Error, number, MarkerContext>({
    mutationFn: (id) => apiClient.delete(id),
    onMutate: (id) => {
      const previousMarkers =
        queryClient.getQueryData<MarkerData[]>(["markers", markerQuery]) || [];
      queryClient.setQueryData<MarkerData[]>(
        ["markers", markerQuery],
        (markers) => markers?.filter((marker) => marker.id !== id)
      );
      return { previousMarkers };
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["markers", markerQuery],
      }),
    onError: (error, variable, context) => {
      queryClient.setQueryData<MarkerData[]>(
        ["markers", markerQuery],
        context?.previousMarkers
      );
    },
  });
};

export default useDeleteMarker;
