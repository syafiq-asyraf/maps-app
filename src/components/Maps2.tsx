// import React from "react";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import LocationMarker from "./LocationMarker";
import SetBoundsRectangles, { newBounds } from "./SetBoundsRectangles";
import { LatLngExpression } from "leaflet";

const Maps2 = () => {
  const center = { lat: 51.505, lng: -0.09 };
  return (
    <MapContainer
      center={center}
      zoom={10}
      // scrollWheelZoom={false}
      style={{ height: "100vh", width: "100vw" }}
    >
      <LocationMarker />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SetBoundsRectangles />
    </MapContainer>
  );
};

export default Maps2;
