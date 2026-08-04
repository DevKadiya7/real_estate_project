import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../services/analyticsService'
import { queryKeys } from '../constants/queryKeys'

/**
 * Fetches the full property dataset once — every chart, the map, the filter
 * panel, and sector insights on the Analysis page derive from this single
 * cached list via client-side aggregation (see features/analytics/utils/aggregate.js).
 * @returns {import('@tanstack/react-query').UseQueryResult<import('../types/property').PropertyRecord[]>}
 */
export function useProperties() {
  return useQuery({
    queryKey: queryKeys.properties,
    queryFn: analyticsService.getProperties,
    staleTime: 10 * 60 * 1000,
  })
}
