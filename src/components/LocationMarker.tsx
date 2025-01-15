import { statesData } from "@/data/us-states";
import useDataStore from "@/dataStore";
import { Box, Button, Text } from "@chakra-ui/react";
import {
  booleanPointInPolygon,
  multiPolygon,
  point,
  polygon,
} from "@turf/turf";
import { FeatureCollection, Position } from "geojson";
import { icon, LatLngExpression } from "leaflet";
import { useState } from "react";
import { Marker, useMap } from "react-leaflet";

const LocationMarker = () => {
  const map = useMap();
  const [markers, setMarker] = useState<{
    data: { position: [number, number] }[];
  }>({
    data: [],
  });

  const [position, setPosition] = useState(map.getCenter());
  const [isShow, setShow] = useState(false);

  const { data, setData } = useDataStore();

  // const [geoJSONData, setgeoJSONData] = useState(statesData);
  // const [marked, setMarked] = useState("");
  // console.log(marked);

  map.on({
    move: () => setPosition(map.getCenter()),
  });

  const handleClick = () => {
    isMarkerInsideGeoJSON();
    setMarker({
      data: [...markers.data, { position: [position.lat, position.lng] }],
    });
    setShow(false);
  };

  // const updateFeature = (featureId: string | number | undefined) => {
  //   console.log("Updating feature with ID:", featureId); // Debugging log
  //   setgeoJSONData((prevData) => {
  //     const updatedFeatures = prevData.features.map((feature) =>
  //       feature.id === featureId
  //         ? {
  //             ...feature,
  //             properties: {
  //               ...feature.properties, // Ensure properties are spread correctly
  //               markerCount: feature.properties?.markerCount + 1,
  //             },
  //           }
  //         : feature
  //     );

  //     console.log(updatedFeatures);

  //     const newData = {
  //       ...prevData,
  //       features: updatedFeatures,
  //     };

  //     console.log("Updated geoJSONData:", newData); // Debugging log
  //     return newData;
  //   });
  //   console.log(geoJSONData);
  // };

  const isMarkerInsideGeoJSON = () => {
    const mark = point([position.lng, position.lat]);

    for (const feature of data.features) {
      if (feature.geometry.type === "Polygon") {
        const poly = polygon(feature.geometry.coordinates as Position[][]);
        if (booleanPointInPolygon(mark, poly)) {
          // setData(feature.id);
          return;
        }
      } else if (feature.geometry.type === "MultiPolygon") {
        const poly = multiPolygon(
          feature.geometry.coordinates as Position[][][]
        );
        if (booleanPointInPolygon(mark, poly)) {
          // setData(feature.id);
          return;
        }
      }
    }
    return null;
  };

  return (
    <>
      {markers.data.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position as LatLngExpression}
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
