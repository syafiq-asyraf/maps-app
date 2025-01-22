import APIClient from "@/services/apiClient";
import useMarkerQueryStore from "@/stores/markerQueryStore";
import { useQuery } from "@tanstack/react-query";

export interface MarkerData {
  id?: number;
  lat: number;
  lng: number;
  parentId?: number;
  geoDataModel?: { id: number; name: string };
}

const apiClient = new APIClient<MarkerData[]>("/marker");

const useMarkers = () => {
  const markerQuery = useMarkerQueryStore((s) => s.markerQuery);
  return useQuery({
    queryKey: ["markers", markerQuery],
    queryFn: () =>
      apiClient.getAll({
        params: {
          parentId: markerQuery.parentId,
        },
      }),
    staleTime: 100 * 1000,
  });
};
export default useMarkers;
