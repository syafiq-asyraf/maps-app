import APIClient from "@/services/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MarkerData } from "./useMarkers";
import { MarkerContext } from "./useAddMarker";
import useMarkerQueryStore from "@/stores/markerQueryStore";

interface MutationData {
  id: number;
  markerData: MarkerData;
}

const apiClient = new APIClient<MarkerData>("/marker/editMarker");

const useUpdateMarker = () => {
  const queryClient = useQueryClient();
  const markerQuery = useMarkerQueryStore((s) => s.markerQuery);
  return useMutation<MarkerData, Error, MutationData, MarkerContext>({
    mutationFn: ({ id, markerData }) => apiClient.put(id, markerData),
    onMutate: ({ id, markerData }) => {
      const previousMarkers =
        queryClient.getQueryData<MarkerData[]>(["markers", markerQuery]) || [];
      queryClient.setQueryData<MarkerData[]>(
        ["markers", markerQuery],
        (markers) =>
          markers?.map((marker) =>
            marker.id === id
              ? {
                  ...marker,
                  lat: markerData.lat,
                  lng: markerData.lng,
                }
              : marker
          )
      );
      return { previousMarkers };
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["markers", markerQuery],
      }),
    onError: (error, variable, context) =>
      queryClient.setQueryData(
        ["markers", markerQuery],
        context?.previousMarkers
      ),
  });
};

export default useUpdateMarker;
