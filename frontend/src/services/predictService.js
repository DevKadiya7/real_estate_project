import { apiClient } from './apiClient'

export const predictService = {
  predict: (payload) => apiClient.post('/api/predict', payload),
}
