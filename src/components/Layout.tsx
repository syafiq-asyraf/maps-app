import { Box, Grid, GridItem } from "@chakra-ui/react";
import Description from "./Description";
import Maps from "./Maps";
import Navigation from "./Navigation";

const Layout = () => {
  return (
    <Grid
      templateAreas={{
        base: `"main aside"`,
      }}
      templateColumns={{
        base: "1fr 500px",
      }}
    >
      <GridItem area="main" backgroundColor={"red"} position={"relative"}>
        <Box position={"absolute"} zIndex={"max"} right={0} padding={3}>
          <Description />
        </Box>
        <Maps />
      </GridItem>
      <GridItem area="aside" backgroundColor={"gray.900"}>
        <Navigation />
      </GridItem>
    </Grid>
  );
};

export default Layout;
