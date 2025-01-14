import { statesData } from "@/data/us-states";
import useDensityStore from "@/store";
import { Feature, FeatureCollection } from "geojson";
import { Layer, LeafletEvent, LeafletMouseEvent, Path } from "leaflet";
import { GeoJSON, useMap } from "react-leaflet";

const HeatMap = () => {
  const map = useMap();
  const { reset, setState, setDensity, setMarkerCount } = useDensityStore();

  const getColor = (d: number) => {
    return d > 1000
      ? "#800026"
      : d > 500
      ? "#BD0026"
      : d > 200
      ? "#E31A1C"
      : d > 100
      ? "#FC4E2A"
      : d > 50
      ? "#FD8D3C"
      : d > 20
      ? "#FEB24C"
      : d > 10
      ? "#FED976"
      : "#FFEDA0";
  };

  const getColorDarker = (d: number) => {
    return d > 1000
      ? "#4F0017"
      : d > 500
      ? "#7D0019"
      : d > 200
      ? "#AD1416"
      : d > 100
      ? "#A3331B"
      : d > 50
      ? "#A35B27"
      : d > 20
      ? "#A87632"
      : d > 10
      ? "#A1894B"
      : "#A69A68";
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    (layer as Path).setStyle({
      fillColor: getColor(feature.properties?.density),
      fillOpacity: 0.7,
      dashArray: "3, 3",
      color: "white",
    });

    const originalStyle = { ...layer.options };

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        setState(feature.properties?.name);
        setDensity(feature.properties?.density);
        setMarkerCount(feature.properties?.markerCount);
        e.target.setStyle({
          fillColor: getColorDarker(feature.properties?.density),
        });
      },
      mouseout: (e: LeafletMouseEvent) => {
        reset();
        e.target.setStyle(originalStyle);
      },
      click: (e: LeafletEvent) => {
        map.fitBounds(e.target.getBounds());
      },
    });
  };

  return (
    <GeoJSON
      data={statesData as FeatureCollection}
      onEachFeature={onEachFeature}
    />
  );
};

export default HeatMap;
