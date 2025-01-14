export const geojsonData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Polygon 1" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-0.12, 51.51],
            [-0.08, 51.51],
            [-0.08, 51.49],
            [-0.12, 51.49],
            [-0.12, 51.51],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Polygon 2" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-0.13, 51.52],
            [-0.09, 51.52],
            [-0.09, 51.5],
            [-0.13, 51.5],
            [-0.13, 51.52],
          ],
        ],
      },
    },
  ],
};
