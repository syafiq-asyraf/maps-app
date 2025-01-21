import useMarkers, { MarkerData } from "@/hooks/useMarkers";
import { Spinner, Table } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

const MarkerTable = () => {
  // const queryClient = useQueryClient();
  // const markers = queryClient.getQueryData<MarkerData[]>(["markers"]);
  const { data: markers, isLoading } = useMarkers();
  if (isLoading) return <Spinner />;
  return (
    <Table.ScrollArea
      height={"100%"}
      width={"100%"}
      borderWidth="1px"
      rounded="md"
    >
      <Table.Root size="sm" interactive stickyHeader>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Id</Table.ColumnHeader>
            <Table.ColumnHeader>State</Table.ColumnHeader>
            <Table.ColumnHeader>Action</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {markers?.map((marker) => (
            <Table.Row key={marker.id}>
              <Table.Cell>{marker.id}</Table.Cell>
              <Table.Cell>{marker.geoDataModel?.name}</Table.Cell>
              <Table.Cell>Edit | Delete</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};

export default MarkerTable;
