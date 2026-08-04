import { useQuery } from '@tanstack/react-query'
import { metadataService } from '../services/metadataService'
import { queryKeys } from '../constants/queryKeys'

// Shared across the predictor form (defaults, dropdown options) and the
// analysis page (sector filter chips) — lives outside any single feature.
export function useMetadataOptions() {
  return useQuery({
    queryKey: queryKeys.metadataOptions,
    queryFn: metadataService.getOptions,
    staleTime: 5 * 60 * 1000,
  })
}
