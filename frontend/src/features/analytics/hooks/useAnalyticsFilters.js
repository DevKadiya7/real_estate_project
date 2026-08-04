import { useMemo, useState } from 'react'
import { computeFilterBounds, filterProperties } from '../utils/aggregate'

const DEFAULT_FILTERS = {
  propertyType: 'all',
  sector: 'all',
  bedrooms: [],
  bathrooms: [],
  priceRange: [0, 20],
  areaRange: [0, 10000],
  readyToMove: false,
  furnished: false,
  luxuryOnly: false,
}

/**
 * Owns the Analysis page's filter state and derives the filtered property
 * list from it — every chart/map/sector-card reads `filtered`, none of them
 * touch `properties` or `filters` directly.
 * @param {import('../../../types/property').PropertyRecord[]} properties
 */
export function useAnalyticsFilters(properties) {
  const bounds = useMemo(() => computeFilterBounds(properties || []), [properties])
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [boundsInitialized, setBoundsInitialized] = useState(false)

  if (!boundsInitialized && properties?.length) {
    setBoundsInitialized(true)
    setFilters((current) => ({ ...current, priceRange: bounds.priceRange, areaRange: bounds.areaRange }))
  }

  const filtered = useMemo(() => filterProperties(properties || [], filters), [properties, filters])

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const reset = () => setFilters({ ...DEFAULT_FILTERS, priceRange: bounds.priceRange, areaRange: bounds.areaRange })

  return { filters, updateFilter, reset, filtered, bounds }
}
