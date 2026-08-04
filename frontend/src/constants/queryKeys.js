export const queryKeys = {
  metadataOptions: ['metadata', 'options'],
  sectorStats: ['analytics', 'sector-stats'],
  featureText: ['analytics', 'feature-text'],
  areaVsPrice: (propertyType) => ['analytics', 'area-vs-price', propertyType],
  bedroomPie: (sector) => ['analytics', 'bedroom-pie', sector],
  properties: ['analytics', 'properties'],
  recommendOptions: ['recommend', 'options'],
  nearbyProperties: (location, radiusKm) => ['recommend', 'nearby', location, radiusKm],
}
