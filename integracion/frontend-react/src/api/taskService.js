const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

async function request(path, options = {}) {
  const response = await fetch(`${baseURL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })

  if (response.status === 204) return null

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message = data?.errors || data?.error || `HTTP ${response.status}`
    throw new Error(typeof message === 'string' ? message : 'Request failed')
  }

  return data
}

export function list() {
  return request('/api/tasks')
}

export function create(payload) {
  return request('/api/tasks', { method: 'POST', body: JSON.stringify(payload) })
}

export function update(id, payload) {
  return request(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export function remove(id) {
  return request(`/api/tasks/${id}`, { method: 'DELETE' })
}
