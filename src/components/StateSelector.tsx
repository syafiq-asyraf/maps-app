import useMapsTiles from "@/hooks/useMapsTiles";
import useMarkerQueryStore from "@/stores/markerQueryStore";
import { Box, Button, HStack } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "./ui/menu";

const StateSelector = () => {
  const parentId = useMarkerQueryStore((s) => s.markerQuery.parentId);
  const setParentId = useMarkerQueryStore((s) => s.setParentId);
  const resetParentId = useMarkerQueryStore((s) => s.resetMarkerQuery);
  const { data: mapTiles } = useMapsTiles();
  const selectedState = mapTiles?.features.find((p) => p.id === parentId);
  return (
    <MenuRoot>
      <MenuTrigger asChild width={"100%"}>
        <Button
          size="sm"
          colorPalette={"white"}
          variant={"surface"}
          justifyContent={"left"}
          rounded={10}
        >
          <HStack>
            <Box>{selectedState?.properties?.name || "All State"}</Box>
            <Box position={"absolute"} right={0} marginRight={3}>
              <BsChevronDown />
            </Box>
          </HStack>
        </Button>
      </MenuTrigger>
      <MenuContent width={"476px"} backgroundColor={"gray.700"}>
        <MenuItem value="All State" onClick={() => resetParentId()}>
          All State
        </MenuItem>
        {mapTiles?.features.map((feature) => (
          <MenuItem
            key={feature.id}
            value={feature.id as string}
            onClick={() => setParentId(feature.id as number)}
          >
            {feature.properties?.name}
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  );
};

export default StateSelector;
