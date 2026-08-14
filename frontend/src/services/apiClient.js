const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '')

const DEV_FALLBACK_BASES = ['', 'http://127.0.0.1:8010', 'http://localhost:8010', 'http://127.0.0.1:8000', 'http://localhost:8000']

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function buildUrl(base, path) {
  return base ? `${base}${path}` : path
}

async function getErrorMessage(response) {
  const error = await response.json().catch(() => ({}))
  const detail = error.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(', ')
  if (typeof error.message === 'string') return error.message
  return 'Request failed'
}

async function request(path, options = {}) {
  const baseCandidates = API_BASE ? [API_BASE] : DEV_FALLBACK_BASES
  let lastError = null

  for (let i = 0; i < baseCandidates.length; i += 1) {
    const base = baseCandidates[i]
    const hasMoreCandidates = i < baseCandidates.length - 1

    try {
      const response = await fetch(buildUrl(base, path), {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      })

      if (!response.ok) {
        const message = await getErrorMessage(response)
        const error = new ApiError(message, response.status)

        // If the Vite proxy is pointed at a wrong backend port, try direct local ports.
        const shouldRetryWithFallback = !API_BASE && !base && [502, 503, 504].includes(response.status) && hasMoreCandidates
        if (shouldRetryWithFallback) {
          lastError = error
          continue
        }

        throw error
      }

      const contentType = response.headers.get('content-type') || ''
      return contentType.includes('application/json') ? response.json() : response.text()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      const networkError = new ApiError(error?.message || 'Network request failed', 0)
      if (!API_BASE && hasMoreCandidates) {
        lastError = networkError
        continue
      }
      throw networkError
    }
  }

  throw lastError || new ApiError('Unable to connect to backend API', 0)
}

export const apiClient = {
  get: (path, params) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : ''
    return request(`${path}${query}`)
  },
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
}

export { ApiError }
