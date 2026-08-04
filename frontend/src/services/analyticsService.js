import { apiClient } from './apiClient'

export const analyticsService = {
  getSectorStats: () => apiClient.get('/api/analytics/sector-stats'),
  getFeatureText: () => apiClient.get('/api/analytics/feature-text'),
  getAreaVsPrice: (propertyType) => apiClient.get('/api/analytics/area-vs-price', { property_type: propertyType }),
  getBedroomPie: (sector) => apiClient.get('/api/analytics/bedroom-pie', { sector }),
  getProperties: () => apiClient.get('/api/analytics/properties'),
}
