import { useQuery } from '@tanstack/react-query'
import { recommendService } from '../../../services/recommendService'
import { queryKeys } from '../../../constants/queryKeys'

export function useRecommendOptions() {
  return useQuery({
    queryKey: queryKeys.recommendOptions,
    queryFn: recommendService.getOptions,
    staleTime: 5 * 60 * 1000,
  })
}
