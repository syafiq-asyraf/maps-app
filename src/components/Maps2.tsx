// import React from "react";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import LocationMarker from "./Locationmarker";
import SetBoundsRectangles, { newBounds } from "./SetBoundsRectangles";
import { LatLngExpression } from "leaflet";

const Maps2 = () => {
  return (
    <MapContainer
      center={{ lat: 51.505, lng: -0.09 }}
      zoom={5}
      // scrollWheelZoom={false}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <LocationMarker /> */}
      {/* <Polygon
        positions={newBounds.map((i) => [i[1], i[0]]) as LatLngExpression[]}
      /> */}
      <SetBoundsRectangles />
    </MapContainer>
  );
};

export default Maps2;
