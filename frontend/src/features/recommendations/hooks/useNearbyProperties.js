import { useQuery } from '@tanstack/react-query'
import { recommendService } from '../../../services/recommendService'
import { queryKeys } from '../../../constants/queryKeys'

// Fetches only after a search has been submitted (`enabled`) rather than on
// every keystroke — the query key still carries the params so results stay
// cached per (location, radius) pair.
export function useNearbyProperties(location, radiusKm, enabled) {
  return useQuery({
    queryKey: queryKeys.nearbyProperties(location, radiusKm),
    queryFn: () => recommendService.getNearby(location, radiusKm),
    enabled,
  })
}
