const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    // Pydantic 422 `detail` can be a string or a list of {msg} objects.
    const detail = error.detail
    const message =
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail.map((d) => d.msg).join(', ')
          : JSON.stringify(detail) || 'Request failed'
    throw new ApiError(message, response.status)
  }

  return response.json()
}

export const apiClient = {
  get: (path, params) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : ''
    return request(`${path}${query}`)
  },
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
}

export { ApiError }
