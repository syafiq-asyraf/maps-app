import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import HeatMap from "./HeatMap";

const Maps = () => {
  const center: LatLngExpression = [39.74780559892203, -101.41401515583752];

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <HeatMap />
      {/* <Marker position={center}></Marker> */}
    </MapContainer>
  );
};

export default Maps;
