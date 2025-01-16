import useDataStore from "@/dataStore";
import useMaps from "@/hooks/useMaps";
import useDensityStore from "@/store";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Feature, FeatureCollection } from "geojson";
import { Layer, LeafletEvent, LeafletMouseEvent, Path } from "leaflet";
import { useEffect } from "react";
import { GeoJSON, useMap } from "react-leaflet";

const HeatMap = () => {
  const map = useMap();
  const { reset, setState, setDensity, setMarkerCount, markerCount } =
    useDensityStore();
  const { data: storedData, setData } = useDataStore();

  const { data, dataUpdatedAt, isSuccess } = useMaps();

  // if (isSuccess) setData(storedData);

  const getColor = (d: number) => {
    return d > 50
      ? "#800026"
      : d > 40
      ? "#BD0026"
      : d > 30
      ? "#E31A1C"
      : d > 20
      ? "#FC4E2A"
      : d > 10
      ? "#FD8D3C"
      : d > 5
      ? "#FEB24C"
      : d > 1
      ? "#FED976"
      : "#FFEDA0";
  };

  const getColorDarker = (d: number) => {
    return d > 50
      ? "#4F0017"
      : d > 40
      ? "#7D0019"
      : d > 30
      ? "#AD1416"
      : d > 20
      ? "#A3331B"
      : d > 10
      ? "#A35B27"
      : d > 5
      ? "#A87632"
      : d > 1
      ? "#A1894B"
      : "#A69A68";
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    (layer as Path).setStyle({
      fillColor: getColor(feature.properties?.markerCount),
      fillOpacity: 0.7,
      dashArray: "3, 3",
      color: "white",
    });

    const originalStyle = { ...layer.options };

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        setState(feature.properties?.name);
        setDensity(0);
        setMarkerCount(feature.properties?.markerCount);
        e.target.setStyle({
          fillColor: getColorDarker(feature.properties?.markerCount),
        });
      },
      mouseout: (e: LeafletMouseEvent) => {
        reset();
        e.target.setStyle(originalStyle);
      },
      click: (e: LeafletEvent) => {
        // console.log(data);
        map.fitBounds(e.target.getBounds());
      },
    });
  };

  return (
    <GeoJSON
      key={dataUpdatedAt}
      data={data as FeatureCollection}
      onEachFeature={onEachFeature}
    />
  );
};

export default HeatMap;
