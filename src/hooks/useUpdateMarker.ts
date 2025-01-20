import APIClient from "@/services/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MarkerData } from "./useMarkers";
import { MarkerContext } from "./useAddMarker";

interface MutationData {
  id: number;
  markerData: MarkerData;
}

const apiClient = new APIClient<MarkerData>("/marker/editMarker");

const useUpdateMarker = () => {
  const queryClient = useQueryClient();
  return useMutation<MarkerData, Error, MutationData, MarkerContext>({
    mutationFn: ({ id, markerData }) => apiClient.put(id, markerData),
    onMutate: ({ id, markerData }) => {
      const previousMarkers =
        queryClient.getQueryData<MarkerData[]>(["markers"]) || [];
      queryClient.setQueryData<MarkerData[]>(["markers"], (markers) =>
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
        queryKey: ["markers"],
      }),
    onError: (error, variable, context) =>
      queryClient.setQueryData(["markers"], context?.previousMarkers),
  });
};

export default useUpdateMarker;
