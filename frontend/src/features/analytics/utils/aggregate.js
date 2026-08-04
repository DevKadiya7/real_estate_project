// Pure, framework-free aggregation functions over the property dataset.
// Every chart/map/sector-card on the Analysis page is a thin render on top
// of one of these — no aggregation logic lives in components.

const CRORE_LABEL_STEP = 0.5

/** Real, naturally-ordered lifecycle stages — stands in for a listing-date
 * trend the dataset doesn't have (see refactor plan's data-reality notes). */
export const POSSESSION_ORDER = [
  'Under Construction',
  'New Property',
  'Relatively New',
  'Moderately Old',
  'Old Property',
]

const isFinite = (value) => typeof value === 'number' && Number.isFinite(value)

/** @param {import('../../../types/property').PropertyRecord[]} properties */
export function filterProperties(properties, filters) {
  if (!properties) return []

  return properties.filter((p) => {
    if (filters.propertyType !== 'all' && p.property_type !== filters.propertyType) return false
    if (filters.sector !== 'all' && p.sector !== filters.sector) return false
    if (filters.bedrooms.length > 0 && !filters.bedrooms.includes(Math.round(p.bedRoom ?? -1))) return false
    if (filters.bathrooms.length > 0 && !filters.bathrooms.includes(Math.round(p.bathroom ?? -1))) return false
    if (isFinite(p.price)) {
      if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false
    }
    if (isFinite(p.built_up_area)) {
      if (p.built_up_area < filters.areaRange[0] || p.built_up_area > filters.areaRange[1]) return false
    }
    if (filters.readyToMove && p.agePossession === 'Under Construction') return false
    if (filters.furnished && !(p.furnishing_type > 0)) return false
    if (filters.luxuryOnly && p.luxury_category !== 'High') return false
    return true
  })
}

export function computeFilterBounds(properties) {
  const prices = (properties || []).map((p) => p.price).filter(isFinite)
  const areas = (properties || []).map((p) => p.built_up_area).filter(isFinite)

  return {
    priceRange: [0, prices.length ? Math.ceil(Math.max(...prices) * 2) / 2 : 20],
    areaRange: [0, areas.length ? Math.ceil(Math.max(...areas) / 100) * 100 : 10000],
  }
}

export function computeMarketSummary(properties) {
  const prices = properties.map((p) => p.price).filter(isFinite).sort((a, b) => a - b)
  const pps = properties.map((p) => p.price_per_sqft).filter(isFinite)
  const areas = properties.map((p) => p.built_up_area).filter(isFinite)
  const luxuryCount = properties.filter((p) => p.luxury_category === 'High').length

  const sum = (arr) => arr.reduce((total, value) => total + value, 0)
  const median = prices.length
    ? prices.length % 2 === 0
      ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
      : prices[(prices.length - 1) / 2]
    : 0

  return {
    averagePrice: prices.length ? sum(prices) / prices.length : 0,
    medianPrice: median,
    totalListings: properties.length,
    averagePricePerSqft: pps.length ? sum(pps) / pps.length : 0,
    luxuryCount,
    averageArea: areas.length ? sum(areas) / areas.length : 0,
  }
}

export function computeSectorInsights(properties) {
  const cityPps = properties.map((p) => p.price_per_sqft).filter(isFinite)
  const cityAvgPps = cityPps.length ? cityPps.reduce((a, b) => a + b, 0) / cityPps.length : 0

  const bySector = new Map()
  for (const p of properties) {
    if (!p.sector) continue
    if (!bySector.has(p.sector)) bySector.set(p.sector, [])
    bySector.get(p.sector).push(p)
  }

  const insights = []
  for (const [sector, rows] of bySector.entries()) {
    const prices = rows.map((r) => r.price).filter(isFinite)
    const areas = rows.map((r) => r.built_up_area).filter(isFinite)
    const pps = rows.map((r) => r.price_per_sqft).filter(isFinite)
    const avgPps = pps.length ? pps.reduce((a, b) => a + b, 0) / pps.length : 0
    const lat = rows.find((r) => isFinite(r.latitude))?.latitude
    const lon = rows.find((r) => isFinite(r.longitude))?.longitude

    insights.push({
      sector,
      averagePrice: prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
      averageArea: areas.length ? areas.reduce((a, b) => a + b, 0) / areas.length : 0,
      listingCount: rows.length,
      pricePerSqft: avgPps,
      vsCityAvgPct: cityAvgPps ? ((avgPps - cityAvgPps) / cityAvgPps) * 100 : 0,
      priceSparkline: prices.slice().sort((a, b) => a - b),
      latitude: lat,
      longitude: lon,
    })
  }

  return insights.sort((a, b) => b.averagePrice - a.averagePrice)
}

export function computePriceHistogram(properties, binCount = 12) {
  const prices = properties.map((p) => p.price).filter(isFinite)
  if (prices.length === 0) return []

  const max = Math.max(...prices)
  const binSize = Math.max(CRORE_LABEL_STEP, Math.ceil((max / binCount) * 2) / 2)
  const bins = new Map()

  for (const price of prices) {
    const binIndex = Math.min(binCount - 1, Math.floor(price / binSize))
    const label = `${(binIndex * binSize).toFixed(1)}-${((binIndex + 1) * binSize).toFixed(1)}`
    bins.set(binIndex, { label, count: (bins.get(binIndex)?.count || 0) + 1, order: binIndex })
  }

  return [...bins.values()].sort((a, b) => a.order - b.order)
}

export function computePropertyTypePie(properties) {
  const counts = new Map()
  for (const p of properties) {
    const key = p.property_type || 'unknown'
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  return [...counts.entries()].map(([name, value]) => ({ name, value }))
}

const MAX_BEDROOM_SLICES = 7

export function computeBedroomDistribution(properties) {
  const counts = new Map()
  for (const p of properties) {
    if (!isFinite(p.bedRoom)) continue
    const key = Math.round(p.bedRoom)
    counts.set(key, (counts.get(key) || 0) + 1)
  }

  const sorted = [...counts.entries()].sort((a, b) => a[0] - b[0])
  const top = sorted.slice(0, MAX_BEDROOM_SLICES)
  const rest = sorted.slice(MAX_BEDROOM_SLICES)
  const otherCount = rest.reduce((total, [, count]) => total + count, 0)

  const rows = top.map(([bedrooms, count]) => ({ bedrooms: `${bedrooms} BHK`, count }))
  if (otherCount > 0) rows.push({ bedrooms: 'Other', count: otherCount })
  return rows
}

const BUBBLE_SAMPLE_CAP = 400

export function computeAreaPriceBubble(properties) {
  const rows = properties
    .filter((p) => isFinite(p.built_up_area) && isFinite(p.price) && isFinite(p.price_per_sqft))
    .map((p) => ({ area: p.built_up_area, price: p.price, pricePerSqft: p.price_per_sqft, bedRoom: p.bedRoom }))

  if (rows.length <= BUBBLE_SAMPLE_CAP) return rows

  const step = Math.ceil(rows.length / BUBBLE_SAMPLE_CAP)
  return rows.filter((_, index) => index % step === 0)
}

export function computeSectorBarData(properties) {
  return computeSectorInsights(properties).map((s) => ({ sector: s.sector, averagePrice: s.averagePrice }))
}

export function computePossessionBreakdown(properties) {
  const counts = new Map()
  for (const p of properties) {
    if (!p.agePossession) continue
    if (!counts.has(p.agePossession)) counts.set(p.agePossession, [])
    counts.get(p.agePossession).push(p.price)
  }

  return POSSESSION_ORDER.filter((stage) => counts.has(stage)).map((stage) => {
    const prices = (counts.get(stage) || []).filter(isFinite)
    return {
      stage,
      count: prices.length,
      averagePrice: prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
    }
  })
}
