import APIClient from "@/services/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MarkerData } from "./useMarkers";

export interface MarkerContext {
  previousMarkers: MarkerData[];
}

const apiClient = new APIClient<MarkerData>("/marker/addMarker");

const useAddMarker = () => {
  const queryClient = useQueryClient();
  return useMutation<MarkerData, Error, MarkerData, MarkerContext>({
    mutationFn: apiClient.post,
    onMutate: (newMarker: MarkerData) => {
      const previousMarkers =
        queryClient.getQueryData<MarkerData[]>(["markers"]) || [];

      queryClient.setQueryData<MarkerData[]>(["markers"], (markers) => [
        ...(markers || []),
        newMarker,
      ]);
      return { previousMarkers };
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["markers"],
      }),
    onError: (error, variable, context) => {
      queryClient.setQueryData(["markers"], context?.previousMarkers);
    },
  });
};

export default useAddMarker;
