import APIClient from "@/services/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MarkerData } from "./useMarkers";
import { MarkerContext } from "./useAddMarker";

const apiClient = new APIClient("/marker/deleteMarker");

const useDeleteMarker = () => {
  const queryClient = useQueryClient();
  return useMutation<MarkerData, Error, number, MarkerContext>({
    mutationFn: (id) => apiClient.delete(id),
    onMutate: (id) => {
      const previousMarkers =
        queryClient.getQueryData<MarkerData[]>(["markers"]) || [];
      queryClient.setQueryData<MarkerData[]>(["markers"], (markers) =>
        markers?.filter((marker) => marker.id !== id)
      );
      return { previousMarkers };
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["markers"],
      }),
    onError: (error, variable, context) => {
      queryClient.setQueryData<MarkerData[]>(
        ["markers"],
        context?.previousMarkers
      );
    },
  });
};

export default useDeleteMarker;
