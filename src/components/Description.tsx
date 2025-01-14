import useDensityStore from "@/store";
import { Box, Text } from "@chakra-ui/react";

const Description = () => {
  const { state, density, markerCount } = useDensityStore();

  return (
    <Box
      backgroundColor={"rgba(255,255,255,0.8)"}
      height={"100%"}
      width={"100%"}
      rounded={10}
      paddingY={2}
      paddingX={3}
    >
      <Text fontWeight={"bold"} color={"gray.600"}>
        US Population Density
      </Text>
      {state ? (
        <Text fontWeight={"bold"} color={"black"}>
          {state}
        </Text>
      ) : (
        ""
      )}
      {density ? (
        <Text color={"black"}>
          {density} people/mi<sup>2</sup>
        </Text>
      ) : (
        ""
      )}
      {markerCount ? <Text color={"black"}>{markerCount} Marks</Text> : ""}
    </Box>
  );
};

export default Description;
