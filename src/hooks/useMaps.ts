import APIClient from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "geojson";

const apiClient = new APIClient<FeatureCollection>("/geodata");

const useMaps = () => {
  return useQuery({
    queryKey: ["maps"],
    queryFn: apiClient.getAll,
    staleTime: 100 * 1000,
  });
};

export default useMaps;
