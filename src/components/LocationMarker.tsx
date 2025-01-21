import useDeleteMarker from "@/hooks/useDeleteMarker";
import useMarkers from "@/hooks/useMarkers";
import useMapStore from "@/stores/mapStore";
import useMarkerStore from "@/stores/markerStore";
import { Box, Button, Image } from "@chakra-ui/react";
import { icon, latLng, LatLngExpression } from "leaflet";
import { useEffect } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import greenMarker from "../assets/marker-green.webp";
import redMarker from "../assets/marker-red.webp";

const LocationMarker = () => {
  const map = useMap();

  const { mapInstance, setMapInstance } = useMapStore();

  useEffect(() => {
    setMapInstance(map);
  }, [mapInstance, setMapInstance]);

  const { showMarker, selectedMarker, setShowMarker, setSelectedMarker } =
    useMarkerStore();

  const { data: markers } = useMarkers();

  const deleteMarker = useDeleteMarker();

  const toggleEdit = (coordinate: LatLngExpression, id: number) => {
    const onMoveEnd = () => {
      setSelectedMarker(id);
      setShowMarker(true);
      map.closePopup();
      map.off("moveend", onMoveEnd);
    };
    map.on({
      moveend: onMoveEnd,
    });
    map.flyTo(coordinate);
  };

  const handleDelete = (id: number) => {
    map.closePopup();
    deleteMarker.mutate(id);
  };

  return (
    <>
      {markers?.map((marker, index) =>
        marker.id === selectedMarker ? (
          ""
        ) : (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={icon({
              iconUrl: redMarker,
              iconSize: [30, 30],
              iconAnchor: [15, 30],
              popupAnchor: [0, -30],
            })}
            eventHandlers={{
              click: () => {
                setShowMarker(false);
                setSelectedMarker(0);
              },
            }}
          >
            <Popup minWidth={90}>
              <Button
                size={"2xs"}
                colorPalette={"green"}
                onClick={() =>
                  toggleEdit(latLng([marker.lat, marker.lng]), marker.id!)
                }
                marginRight={1}
              >
                Edit
              </Button>
              <Button
                size={"2xs"}
                colorPalette={"red"}
                onClick={() => handleDelete(marker.id!)}
              >
                Delete
              </Button>
              {/* {marker.lat + "," + marker.lng} */}
            </Popup>
          </Marker>
        )
      )}
      {showMarker && (
        <Box
          position={"absolute"}
          top={"50%"}
          left={"50%"}
          transform={"translate(-50%, -50%)"}
          zIndex={1000}
          pointerEvents={"none"}
          marginTop={"-15px"}
        >
          <Image src={greenMarker} alt="center marker" boxSize={30} />
        </Box>
      )}
    </>
  );
};

export default LocationMarker;
