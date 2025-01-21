import useDeleteMarker from "@/hooks/useDeleteMarker";
import useMarkers from "@/hooks/useMarkers";
import useMapStore from "@/stores/mapStore";
import useMarkerStore from "@/stores/markerStore";
import { Button, HStack, Spinner, Table } from "@chakra-ui/react";
import { latLng, LatLngExpression } from "leaflet";
import { IoMdLocate } from "react-icons/io";
import { Tooltip } from "./ui/tooltip";

const MarkerTable = () => {
  const mapInstance = useMapStore((s) => s.mapInstance);
  const { data: markers, isLoading } = useMarkers();

  const setShowMarker = useMarkerStore((s) => s.setShowMarker);
  const setSelectedMarker = useMarkerStore((s) => s.setSelectedMarker);

  const deleteMarker = useDeleteMarker();

  const handleDelete = (id: number) => {
    setShowMarker(false);
    mapInstance?.closePopup();
    deleteMarker.mutate(id);
  };

  const toggleEdit = (coordinate: LatLngExpression, id: number) => {
    const onMoveEnd = () => {
      setSelectedMarker(id);
      setShowMarker(true);
      mapInstance?.closePopup();
      mapInstance?.off("moveend", onMoveEnd);
    };
    mapInstance?.on({
      moveend: onMoveEnd,
    });
    mapInstance?.flyTo(coordinate);
  };

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
            <Table.ColumnHeader textAlign={"center"} width={"50px"}>
              No.
            </Table.ColumnHeader>
            <Table.ColumnHeader>Id</Table.ColumnHeader>
            <Table.ColumnHeader>State</Table.ColumnHeader>
            <Table.ColumnHeader width={"10px"}>Action</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {markers?.map((marker, index) => (
            <Table.Row key={index} cursor={"pointer"}>
              <Table.Cell textAlign={"center"}>{index + 1}</Table.Cell>
              <Table.Cell>{marker.id}</Table.Cell>
              <Table.Cell>{marker.geoDataModel?.name}</Table.Cell>
              <Table.Cell>
                <HStack>
                  <Button
                    size={"2xs"}
                    colorPalette={"green"}
                    onClick={() =>
                      toggleEdit(latLng([marker.lat, marker.lng]), marker.id!)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    size={"2xs"}
                    colorPalette={"red"}
                    onClick={() => handleDelete(marker.id!)}
                  >
                    Delete
                  </Button>
                  <Tooltip
                    showArrow
                    content="Locate"
                    positioning={{ placement: "top" }}
                  >
                    <Button
                      size={"2xs"}
                      colorPalette={"blue"}
                      aria-label="Locate"
                      onClick={() =>
                        mapInstance?.flyTo(
                          { lat: marker.lat, lng: marker.lng },
                          12
                        )
                      }
                    >
                      <IoMdLocate />
                    </Button>
                  </Tooltip>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};

export default MarkerTable;
