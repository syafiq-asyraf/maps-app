import useMarkerQueryStore from "@/stores/markerQueryStore";
import { Button, Text } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { BsChevronDown } from "react-icons/bs";
import React from "react";
import {
  MenuArrow,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "./ui/menu";

const StateSelector = () => {
  const parentId = useMarkerQueryStore((s) => s.markerQuery.parentId);
  const setParentId = useMarkerQueryStore((s) => s.setParentId);
  const queryClient = useQueryClient();
  const markers = queryClient.getQueryData(["maps"]);
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
          Open
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem value="new-txt">New Text File</MenuItem>
        <MenuItem value="new-file">New File...</MenuItem>
        <MenuItem value="new-win">New Window</MenuItem>
        <MenuItem value="open-file">Open File...</MenuItem>
        <MenuItem value="export">Export</MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};

export default StateSelector;
