import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  headers: { 'Content-Type': 'application/json' }
})

function messageFrom(error) {
  const data = error.response?.data
  if (typeof data?.errors === 'string') return data.errors
  if (typeof data?.error === 'string') return data.error
  return error.message || 'Error de red'
}

export const api = {
  async list() {
    const response = await http.get('/api/tasks')
    return response.data
  },
  async show(id) {
    const response = await http.get(`/api/tasks/${id}`)
    return response.data
  },
  async create(payload) {
    const response = await http.post('/api/tasks', payload)
    return response.data
  },
  async update(id, payload) {
    const response = await http.put(`/api/tasks/${id}`, payload)
    return response.data
  },
  async remove(id) {
    await http.delete(`/api/tasks/${id}`)
  },
  messageFrom
}
