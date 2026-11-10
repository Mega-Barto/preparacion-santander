import { createContext, useContext, useEffect, useReducer } from 'react'
import { list } from '../api/taskService'

const TaskContext = createContext(null)

const initialState = { items: [], loading: false, error: '' }

function taskReducer(state, action) {
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

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  async function fetchAll() {
    dispatch({ type: 'loading' })
    try {
      dispatch({ type: 'loaded', items: await list() })
    } catch (e) {
      dispatch({ type: 'failed', error: e.message })
    }
  }

  function create(payload) {
    const maxId = state.items.reduce((max, task) => Math.max(max, task.id), 0)
    const item = {
      id: maxId + 1,
      title: payload.title,
      description: payload.description || '',
      status: payload.status || 'pending',
      createdAt: new Date().toISOString()
    }
    dispatch({ type: 'created', item })
    return item
  }

  function update(id, payload) {
    const current = state.items.find((task) => task.id === id)
    if (!current) return null
    const item = { ...current, ...payload }
    dispatch({ type: 'updated', item })
    return item
  }

  function remove(id) {
    dispatch({ type: 'removed', id })
  }

  useEffect(() => {
    fetchAll()
  }, [])

  return (
    <TaskContext.Provider value={{ ...state, fetchAll, create, update, remove }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks debe usarse dentro de TaskProvider')
  }
  return context
}
