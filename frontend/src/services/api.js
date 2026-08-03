const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    const message =
      typeof error?.detail === 'string'
        ? error.detail
        : error?.detail
        ? JSON.stringify(error.detail)
        : JSON.stringify(error)

    throw new Error(message || 'Request failed')
  }

  return response.json().catch(() => null)
}

export const getMetadataOptions = () => request('/api/metadata/options')

export const predictPrice = (payload) =>
  request('/api/predict', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const getSectorStats = () => request('/api/analytics/sector-stats')

export const getFeatureText = () => request('/api/analytics/feature-text')

export const getAreaVsPrice = (propertyType) => request(`/api/analytics/area-vs-price?property_type=${encodeURIComponent(propertyType)}`)

export const getBedroomPie = (sector) => request(`/api/analytics/bedroom-pie?sector=${encodeURIComponent(sector)}`)

export const getRecommendOptions = () => request('/api/recommend/options')

export const getNearbyProperties = (location, radiusKm) =>
  request(`/api/recommend/nearby?location=${encodeURIComponent(location)}&radius_km=${encodeURIComponent(radiusKm)}`)

export const getRecommendations = (propertyName, topN = 5) =>
  request('/api/recommend', {
    method: 'POST',
    body: JSON.stringify({ property_name: propertyName, top_n: topN }),
  })
