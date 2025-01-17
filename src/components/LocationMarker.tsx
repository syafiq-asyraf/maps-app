import { statesData } from "@/data/us-states";
import useDataStore from "@/dataStore";
import useMarkers, { MarkerData } from "@/hooks/useMarkers";
import { Box, Button, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  booleanPointInPolygon,
  multiPolygon,
  point,
  polygon,
} from "@turf/turf";
import axios from "axios";
import { FeatureCollection, Position } from "geojson";
import { icon, LatLngExpression, marker } from "leaflet";
import { useState } from "react";
import { Marker, useMap } from "react-leaflet";

interface Props {
  data: FeatureCollection;
}

interface AddMapsContext {
  previousMaps: FeatureCollection;
}

const LocationMarker = ({ data }: Props) => {
  const map = useMap();
  // const [markers, setMarker] = useState<{
  //   data: { position: [number, number] }[];
  // }>({
  //   data: [],
  // });

  const [position, setPosition] = useState(map.getCenter());
  const [isShow, setShow] = useState(false);

  const { data: markers } = useMarkers();

  const queryClient = useQueryClient();

  const addMarker = useMutation<MarkerData, Error, MarkerData>({
    mutationFn: (marker: MarkerData) =>
      axios
        .post("http://localhost:5050/api/marker/addMarker", marker)
        .then((res) => res.data),
    onMutate: (newMarker: MarkerData) => {
      queryClient.setQueryData<MarkerData[]>(["markers"], (markers) => [
        ...(markers || []),
        newMarker,
      ]);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["markers"],
      }),
  });

  const addMarkerCount = useMutation<
    FeatureCollection,
    Error,
    number,
    AddMapsContext
  >({
    mutationFn: (id: number) =>
      axios
        .post(`http://localhost:5050/api/geodata/${id}/updateMarkerCount`)
        .then((res) => res.data),
    onMutate: (id: number) => {
      const previousMaps = queryClient.getQueryData<FeatureCollection>([
        "maps",
      ]) || { type: "FeatureCollection", features: [] };

      queryClient.setQueryData<FeatureCollection>(["maps"], (maps) => {
        const updatedFeatures = maps?.features.map((feature) =>
          feature.id === id
            ? {
                ...feature,
                properties: {
                  ...feature.properties,
                  markerCount: feature.properties?.markerCount + 1,
                },
              }
            : feature
        );

        const newData: FeatureCollection = {
          ...(maps as FeatureCollection),
          features: updatedFeatures || [],
        };
        return newData;
      });

      return { previousMaps };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["maps"],
      });
    },
    onError: (error, variable, context) => {
      if (!context) return;
      queryClient.setQueryData(["maps"], context.previousMaps);
    },
  });

  // const [geoJSONData, setgeoJSONData] = useState(statesData);
  // const [marked, setMarked] = useState("");
  // console.log(marked);

  map.on({
    move: () => setPosition(map.getCenter()),
  });

  const handleClick = () => {
    isMarkerInsideGeoJSON();
    // setMarker({
    //   data: [...markers.data, { position: [position.lat, position.lng] }],
    // });
    setShow(false);
  };

  const isMarkerInsideGeoJSON = () => {
    const mark = point([position.lng, position.lat]);

    // console.log(data);
    if (!data) return null;
    for (const feature of data.features) {
      if (feature.geometry.type === "Polygon") {
        const poly = polygon(feature.geometry.coordinates as Position[][]);
        if (booleanPointInPolygon(mark, poly)) {
          // console.log(feature.properties?.name);
          addMarker.mutate({
            lat: position.lat,
            lng: position.lng,
            parentId: feature.id as number,
          });
          addMarkerCount.mutate(feature.id as number);
          return;
        }
      } else if (feature.geometry.type === "MultiPolygon") {
        const poly = multiPolygon(
          feature.geometry.coordinates as Position[][][]
        );
        if (booleanPointInPolygon(mark, poly)) {
          // console.log(feature.properties?.name);
          addMarkerCount.mutate(feature.id as number);
          return;
        }
      }
    }
    return null;
  };

  return (
    <>
      {markers?.map((marker, index) => (
        <Marker
          key={index}
          position={{ lat: marker.lat, lng: marker.lng }}
          icon={icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30],
          })}
        ></Marker>
      ))}
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
          <Button bgColor={"green"} onClick={handleClick}>
            Tag
          </Button>
        ) : (
          <Button
            bgColor={"blue"}
            onClick={() => {
              setShow(true);
            }}
          >
            Show Marker
          </Button>
        )}
      </Box>
      {isShow ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            pointerEvents: "none",
            marginTop: "-15px",
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/252/252025.png"
            alt="center marker"
            width="30"
            height="30"
          />
        </div>
      ) : null}
    </>
  );
};

export default LocationMarker;
