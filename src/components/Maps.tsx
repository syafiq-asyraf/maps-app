import useMapsTiles from "@/hooks/useMapsTiles";
import useMarkers from "@/hooks/useMarkers";
import { FeatureCollection } from "geojson";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import HeatMap from "./HeatMap";
import LocationMarker from "./LocationMarker";

export const center: LatLngExpression = [32.879, -86.715];

const Maps = () => {
  const { data } = useMapsTiles();
  const { dataUpdatedAt } = useMarkers();

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <HeatMap data={data as FeatureCollection} dataUpdatedAt={dataUpdatedAt} />
      <LocationMarker />
    </MapContainer>
  );
};

export default Maps;
