import useMarkers, { MarkerData } from "@/hooks/useMarkers";
import { Box, Button, Image, Link, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  booleanPointInPolygon,
  multiPolygon,
  point,
  polygon,
} from "@turf/turf";
import axios from "axios";
import { FeatureCollection, Position } from "geojson";
import { icon, latLng, LatLngExpression } from "leaflet";
import { useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import redMarker from "../assets/marker-red.webp";
import greenMarker from "../assets/marker-green.webp";
import useAddMarker from "@/hooks/useAddMarker";
import useUpdateMarker from "@/hooks/useUpdateMarker";
import useDeleteMarker from "@/hooks/useDeleteMarker";

interface Props {
  data: FeatureCollection;
  center: LatLngExpression;
}

const LocationMarker = ({ data, center }: Props) => {
  const map = useMap();
  // const [markers, setMarker] = useState<{
  //   data: { position: [number, number] }[];
  // }>({
  //   data: [],
  // });

  const [position, setPosition] = useState(map.getCenter());
  const [isShow, setShow] = useState(false);
  // const [isEdit, setEdit] = useState(false);
  const [selected, setSelected] = useState(0);

  const { data: markers } = useMarkers();

  const addMarker = useAddMarker();

  const updateMarker = useUpdateMarker();

  const deleteMarker = useDeleteMarker();

  map.on({
    move: () => setPosition(map.getCenter()),
  });

  const toggleEdit = (coordinate: LatLngExpression, id: number) => {
    // setEdit(true);
    // map.closePopup();
    const onMoveEnd = () => {
      setSelected(id);
      setShow(true);
      map.closePopup();
      map.off("moveend", onMoveEnd);
    };
    map.on({
      moveend: onMoveEnd,
    });
    map.flyTo(coordinate);
    // setShow(true);
  };

  const handleTag = () => {
    isMarkerInsideGeoJSON();
    setShow(false);
    setSelected(0);
  };

  const handleCancel = () => {
    setShow(false);
    setSelected(0);
  };

  const handleDelete = (id: number) => {
    map.closePopup();
    deleteMarker.mutate(id);
  };

  const isMarkerInsideGeoJSON = () => {
    const mark = point([position.lng, position.lat]);

    // console.log(data);
    if (!data) return null;
    for (const feature of data.features) {
      if (feature.geometry.type === "Polygon") {
        const poly = polygon(feature.geometry.coordinates as Position[][]);
        if (booleanPointInPolygon(mark, poly)) {
          if (selected === 0) {
            addMarker.mutate({
              lat: position.lat,
              lng: position.lng,
              parentId: feature.id as number,
            });
          } else {
            updateMarker.mutate({
              id: selected as number,
              markerData: {
                lat: position.lat,
                lng: position.lng,
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
          if (selected === 0) {
            addMarker.mutate({
              lat: position.lat,
              lng: position.lng,
              parentId: feature.id as number,
            });
          } else {
            updateMarker.mutate({
              id: selected as number,
              markerData: {
                lat: position.lat,
                lng: position.lng,
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
      {markers?.map((marker, index) =>
        marker.id === selected ? (
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
                setShow(false);
                setSelected(0);
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
      <Box
        backgroundColor={"grey"}
        padding={2}
        zIndex={"max"}
        position={"absolute"}
        justifyItems={"center"}
        alignItems={"center"}
        left={"50%"}
        transform={"translate(-50%)"}
      >
        <Text>
          {position.lat}, {position.lng}
        </Text>
        {isShow ? (
          <>
            <Button colorPalette={"blue"} onClick={handleTag}>
              Tag
            </Button>
            <Button colorPalette={"red"} onClick={handleCancel} marginLeft={2}>
              Cancel
            </Button>
          </>
        ) : (
          <Button
            // bgColor={"blue"}
            colorPalette={"blue"}
            onClick={() => {
              setShow(true);
            }}
          >
            Show Marker
          </Button>
        )}
        <Button
          colorPalette={"grey"}
          onClick={() => {
            map.flyTo(center);
          }}
          marginLeft={2}
        >
          Center
        </Button>
      </Box>
      {isShow && (
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
