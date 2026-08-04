import { apiClient } from './apiClient'

export const recommendService = {
  getOptions: () => apiClient.get('/api/recommend/options'),
  getNearby: (location, radiusKm) => apiClient.get('/api/recommend/nearby', { location, radius_km: radiusKm }),
  recommend: (propertyName, topN = 5) => apiClient.post('/api/recommend', { property_name: propertyName, top_n: topN }),
}
