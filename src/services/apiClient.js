const BASE_URL = (import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:3001/api/').replace(
  /(?<!:)\/\/+/g,
  '/',
)

const buildUrl = (path, params) => {
  const sanitizedPath = path.startsWith('/') ? path.slice(1) : path
  const url = new URL(sanitizedPath, BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`)

  if (params) {
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
  }

  return url
}

const request = async (method, path, { params, body } = {}) => {
  const response = await fetch(buildUrl(path, params), {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}))
    const message = errorPayload.error || errorPayload.message || 'Request failed'
    throw new Error(message)
  }

  return response.json()
}

export const apiClient = {
  get: (path, options) => request('GET', path, options),
  post: (path, options) => request('POST', path, options),
}

