import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { recommendService } from '../../../services/recommendService'

export function useRecommendMutation() {
  return useMutation({
    mutationFn: ({ propertyName, topN }) => recommendService.recommend(propertyName, topN),
    onError: (error) => toast.error(error.message || 'Recommendation failed'),
  })
}
