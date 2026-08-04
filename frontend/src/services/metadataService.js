import { apiClient } from './apiClient'

export const metadataService = {
  getOptions: () => apiClient.get('/api/metadata/options'),
}
