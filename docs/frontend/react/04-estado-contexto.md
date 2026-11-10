# React — Estado con Context y useReducer

Para la integración, la lista de tareas vive en un contexto. Así `TaskListPage` y `TaskFormPage` no se pasan la lista por props a través del router.

## Reducer

```jsx
export const initialState = {
  items: [],
  loading: false,
  error: ''
}

export function taskReducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true, error: '' }
    case 'loaded':
      return { ...state, loading: false, items: action.items }
    case 'created':
      return { ...state, items: [action.item, ...state.items] }
    case 'updated':
      return {
        ...state,
        items: state.items.map((task) => (task.id === action.item.id ? action.item : task))
      }
    case 'removed':
      return { ...state, items: state.items.filter((task) => task.id !== action.id) }
    case 'failed':
      return { ...state, loading: false, error: action.error }
    default:
      return state
  }
}
```

El reducer es síncrono. Las llamadas HTTP van fuera, en el provider.

## Provider

```jsx
import { createContext, useContext, useEffect, useReducer } from 'react'
import * as taskService from '../api/taskService'

const TaskContext = createContext(null)

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  async function fetchAll() {
    dispatch({ type: 'loading' })
    try {
      dispatch({ type: 'loaded', items: await taskService.list() })
    } catch (e) {
      dispatch({ type: 'failed', error: e.message })
    }
  }

  async function create(payload) {
    const item = await taskService.create(payload)
    dispatch({ type: 'created', item })
    return item
  }

  async function update(id, payload) {
    const item = await taskService.update(id, payload)
    dispatch({ type: 'updated', item })
    return item
  }

  async function remove(id) {
    await taskService.remove(id)
    dispatch({ type: 'removed', id })
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const value = { ...state, fetchAll, create, update, remove }
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks debe usarse dentro de TaskProvider')
  }
  return context
}
```

## Dónde envolver

```jsx
<BrowserRouter>
  <TaskProvider>
    <App />
  </TaskProvider>
</BrowserRouter>
```

## Consumir

```jsx
const { items, loading, error, remove } = useTasks()
```

## Context frente a estado local

| Situación | Herramienta |
|---|---|
| Un input | `useState` en el formulario |
| Lista compartida por rutas | Context |
| Aplicación grande | Una librería (Redux, Zustand). No la introduzcas el día de la prueba si no estaba en el enunciado |
