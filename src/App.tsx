import { Box } from "@chakra-ui/react";
import Description from "./components/Description";
import Maps from "./components/Maps";
// import './App.css'
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import axios from "axios";
import useDataStore from "./dataStore";
import { FeatureCollection } from "geojson";

function App() {
  // const { setData } = useDataStore();

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5050/api/geodata")
  //     .then((res) => setData(res.data as FeatureCollection));
  // }, []);

  return (
    <>
      <Box position={"fixed"} zIndex={"max"} padding={3} right={0}>
        <Description />
      </Box>
      {/* <Description /> */}
      <Maps />
    </>
  );
}

export default App;
