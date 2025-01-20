import APIClient from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export interface MarkerData {
  id?: number;
  lat: number;
  lng: number;
  parentId?: number;
}

const apiClient = new APIClient<MarkerData[]>("/marker");

const useMarkers = () =>
  useQuery({
    queryKey: ["markers"],
    queryFn: apiClient.getAll,
    staleTime: 100 * 1000,
  });

export default useMarkers;
