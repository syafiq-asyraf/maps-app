import { MarkerData } from "@/hooks/useMarkers";
import useDescriptionStore from "@/stores/descriptionStore";
import useMarkerQueryStore from "@/stores/markerQueryStore";
import { useQueryClient } from "@tanstack/react-query";
import { Feature, FeatureCollection } from "geojson";
import { Layer, LeafletEvent, LeafletMouseEvent, Path } from "leaflet";
import { GeoJSON, useMap } from "react-leaflet";

interface Props {
  data: FeatureCollection;
  dataUpdatedAt: number;
}

const HeatMap = ({ data, dataUpdatedAt }: Props) => {
  const map = useMap();
  const { reset, setState, setMarkerCount } = useDescriptionStore();

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

  const queryClient = useQueryClient();

  const markerQuery = useMarkerQueryStore((s) => s.markerQuery);

  const getMarkerCount = (id: number) => {
    const markers =
      queryClient.getQueryData<MarkerData[]>(["markers", markerQuery]) || [];
    const markerCount = markers.reduce((acc, marker) => {
      return (marker.parentId as number) === id ? acc + 1 : acc;
    }, 0);
    return markerCount;
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    (layer as Path).setStyle({
      fillColor: getColor(getMarkerCount(feature.id as number)),
      fillOpacity: 0.7,
      dashArray: "3, 3",
      color: "white",
    });

    const originalStyle = { ...layer.options };

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        setState(feature.properties?.name);
        setMarkerCount(getMarkerCount(feature.id as number));
        e.target.setStyle({
          fillColor: getColorDarker(getMarkerCount(feature.id as number)),
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
      key={dataUpdatedAt}
      data={data as FeatureCollection}
      onEachFeature={onEachFeature}
    />
  );
};

export default HeatMap;
