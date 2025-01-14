import { Box } from "@chakra-ui/react";
import Description from "./components/Description";
import Maps from "./components/Maps";
// import './App.css'
import "leaflet/dist/leaflet.css";

function App() {
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
