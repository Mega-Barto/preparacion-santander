# fetch y axios

Base de la API de este repo: `http://127.0.0.1:8000`.

## fetch (React y JS plano)

```javascript
const baseURL = 'http://127.0.0.1:8000'

export async function listTasks() {
  const response = await fetch(`${baseURL}/api/tasks`)
  if (!response.ok) {
    throw new Error('HTTP ' + response.status)
  }
  return response.json()
}

export async function createTask(payload) {
  const response = await fetch(`${baseURL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || data.errors || 'HTTP ' + response.status)
  }
  return data
}

export async function updateTask(id, payload) {
  const response = await fetch(`${baseURL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!response.ok) throw new Error('HTTP ' + response.status)
  return response.json()
}

export async function deleteTask(id) {
  const response = await fetch(`${baseURL}/api/tasks/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('HTTP ' + response.status)
}
```

Un 204 no tiene cuerpo: no llames a `response.json()` después de un DELETE.

Con JWT:

```javascript
headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
}
```

## axios (Vue, en este repo)

```bash
npm install axios
```

```javascript
import axios from 'axios'

const http = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: { 'Content-Type': 'application/json' }
})

export const api = {
  list: () => http.get('/api/tasks').then((r) => r.data),
  create: (payload) => http.post('/api/tasks', payload).then((r) => r.data),
  update: (id, payload) => http.put(`/api/tasks/${id}`, payload).then((r) => r.data),
  remove: (id) => http.delete(`/api/tasks/${id}`)
}
```

axios lanza excepción si el estado no es 2xx. El cuerpo del error está en `error.response.data`.

```javascript
try {
  await api.create({ title: '' })
} catch (error) {
  console.error(error.response?.status, error.response?.data)
}
```

Token en todas las peticiones:

```javascript
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

## Qué suele fallar

| Síntoma en el navegador | Causa |
|---|---|
| CORS / preflight | El backend no permite el origen (`localhost:5173` o `:3000`) |
| `Failed to fetch` sin status | La API no está levantada, o la URL es `https` contra `http` |
| 415 | Falta `Content-Type: application/json` |
| 422 | El JSON no pasa la validación (`title` vacío o `status` raro) |
