import { SEQUENTIAL_BLUE } from '../../../constants/chartPalette'

const GURGAON_CENTER = [28.4595, 77.0266]

export function getMapCenter(sectorInsights) {
  const withCoords = sectorInsights.filter((s) => Number.isFinite(s.latitude) && Number.isFinite(s.longitude))
  if (withCoords.length === 0) return GURGAON_CENTER

  const lat = withCoords.reduce((sum, s) => sum + s.latitude, 0) / withCoords.length
  const lon = withCoords.reduce((sum, s) => sum + s.longitude, 0) / withCoords.length
  return [lat, lon]
}

/** Marker radius scaled by listing count — more listings, bigger dot. */
export function markerRadius(listingCount, maxListingCount) {
  const minR = 6
  const maxR = 22
  if (!maxListingCount) return minR
  return minR + (maxR - minR) * Math.sqrt(listingCount / maxListingCount)
}

/** Marker color on the sequential blue ramp, keyed by price rank within the dataset. */
export function markerColor(averagePrice, minPrice, maxPrice, isDark) {
  const ramp = isDark ? SEQUENTIAL_BLUE.dark : SEQUENTIAL_BLUE.light
  if (maxPrice === minPrice) return ramp[Math.floor(ramp.length / 2)]
  const t = Math.max(0, Math.min(1, (averagePrice - minPrice) / (maxPrice - minPrice)))
  return ramp[Math.min(ramp.length - 1, Math.floor(t * ramp.length))]
}

/** [lat, lon, intensity] tuples for leaflet.heat, intensity normalized 0..1 by price/sqft. */
export function buildHeatmapPoints(sectorInsights) {
  const values = sectorInsights.map((s) => s.pricePerSqft).filter(Number.isFinite)
  if (values.length === 0) return []
  const min = Math.min(...values)
  const max = Math.max(...values)

  return sectorInsights
    .filter((s) => Number.isFinite(s.latitude) && Number.isFinite(s.longitude) && Number.isFinite(s.pricePerSqft))
    .map((s) => {
      const intensity = max === min ? 0.6 : 0.2 + 0.8 * ((s.pricePerSqft - min) / (max - min))
      return [s.latitude, s.longitude, intensity]
    })
}

const LUXURY_SHARE_THRESHOLD = 0.3

export function computeLuxurySectors(properties) {
  const bySector = new Map()
  for (const p of properties) {
    if (!p.sector) continue
    if (!bySector.has(p.sector)) bySector.set(p.sector, { total: 0, luxury: 0, lat: p.latitude, lon: p.longitude })
    const entry = bySector.get(p.sector)
    entry.total += 1
    if (p.luxury_category === 'High') entry.luxury += 1
  }

  const result = []
  for (const [sector, entry] of bySector.entries()) {
    const share = entry.total ? entry.luxury / entry.total : 0
    if (share >= LUXURY_SHARE_THRESHOLD && entry.luxury >= 3) {
      result.push({ sector, share, luxuryCount: entry.luxury, latitude: entry.lat, longitude: entry.lon })
    }
  }
  return result
}
