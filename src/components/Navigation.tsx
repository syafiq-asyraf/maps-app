import useAddMarker from "@/hooks/useAddMarker";
import useUpdateMarker from "@/hooks/useUpdateMarker";
import useMapStore from "@/stores/mapStore";
import useMarkerStore from "@/stores/markerStore";
import usePositionStore from "@/stores/positionStore";
import { Box, Button, SimpleGrid, VStack } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  booleanPointInPolygon,
  multiPolygon,
  point,
  polygon,
} from "@turf/turf";
import { FeatureCollection, Position } from "geojson";
import { center } from "./Maps";
import MarkerTable from "./MarkerTable";
import { MarkerData } from "@/hooks/useMarkers";
import StateSelector from "./StateSelector";

const Navigation = () => {
  const showMarker = useMarkerStore((s) => s.showMarker);
  const selectedMarker = useMarkerStore((s) => s.selectedMarker);
  const setShowMarker = useMarkerStore((s) => s.setShowMarker);
  const setSelectedMarker = useMarkerStore((s) => s.setSelectedMarker);
  const mapInstance = useMapStore((s) => s.mapInstance);
  // const position = usePositionStore((s) => s.position);
  // const setPosition = usePositionStore((s) => s.setPosition);

  // mapInstance?.on({
  //   moveend: () => setPosition(mapInstance?.getCenter()),
  // });

  const addMarker = useAddMarker();
  const updateMarker = useUpdateMarker();

  const handleTag = () => {
    isMarkerInsideGeoJSON();
    setShowMarker(false);
    setSelectedMarker(0);
  };

  const handleCancel = () => {
    setShowMarker(false);
    setSelectedMarker(0);
  };

  const queryClient = useQueryClient();

  const isMarkerInsideGeoJSON = () => {
    const markerPosition = mapInstance?.getCenter();
    const data = queryClient.getQueryData<FeatureCollection>(["maps"]);
    const mark = point([
      markerPosition?.lng as number,
      markerPosition?.lat as number,
    ]);
    if (!data) return null;
    for (const feature of data.features) {
      if (feature.geometry.type === "Polygon") {
        const poly = polygon(feature.geometry.coordinates as Position[][]);
        if (booleanPointInPolygon(mark, poly)) {
          if (selectedMarker === 0) {
            addMarker.mutate({
              lat: markerPosition?.lat as number,
              lng: markerPosition?.lng as number,
              parentId: feature.id as number,
            });
          } else {
            updateMarker.mutate({
              id: selectedMarker,
              markerData: {
                lat: markerPosition?.lat as number,
                lng: markerPosition?.lng as number,
              },
            });
          }
          return;
        }
      } else if (feature.geometry.type === "MultiPolygon") {
        const poly = multiPolygon(
          feature.geometry.coordinates as Position[][][]
        );
        if (booleanPointInPolygon(mark, poly)) {
          if (selectedMarker === 0) {
            addMarker.mutate({
              lat: markerPosition?.lat as number,
              lng: markerPosition?.lng as number,
              parentId: feature.id as number,
            });
          } else {
            updateMarker.mutate({
              id: selectedMarker,
              markerData: {
                lat: markerPosition?.lat as number,
                lng: markerPosition?.lng as number,
              },
            });
          }
          return;
        }
      }
    }
    return null;
  };

  return (
    <>
      <VStack height="100vh" padding={3}>
        <Button
          colorPalette={"grey"}
          size={"sm"}
          onClick={() => {
            mapInstance?.flyTo(center);
          }}
          width={"100%"}
          rounded={10}
        >
          Center
        </Button>{" "}
        {showMarker ? (
          <SimpleGrid columns={2} width={"100%"} gap={2}>
            <Button
              size={"sm"}
              colorPalette={"blue"}
              rounded={10}
              width={"100%"}
              onClick={handleTag}
            >
              Tag
            </Button>
            <Button
              size={"sm"}
              colorPalette={"red"}
              rounded={10}
              width={"100%"}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </SimpleGrid>
        ) : (
          <Button
            colorPalette={"blue"}
            size={"sm"}
            width={"100%"}
            rounded={10}
            onClick={() => {
              setShowMarker(true);
            }}
          >
            Show Marker
          </Button>
        )}
        <Box width={"100%"}>
          <StateSelector />
        </Box>
        <Box flex={1} width={"100%"} overflow="hidden">
          <MarkerTable />
        </Box>
      </VStack>
    </>
  );
};

export default Navigation;
