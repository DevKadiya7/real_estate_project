import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { predictService } from '../../../services/predictService'

export function usePredictMutation() {
  return useMutation({
    mutationFn: predictService.predict,
    onError: (error) => toast.error(error.message || 'Prediction failed'),
  })
}
