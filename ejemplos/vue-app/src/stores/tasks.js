import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchTasks } from '../api/client'

export const useTaskStore = defineStore('tasks', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref('')
  let nextId = 1

  const pendingCount = computed(
    () => items.value.filter((task) => task.status !== 'done').length
  )

  async function fetchAll() {
    loading.value = true
    error.value = ''
    try {
      items.value = await fetchTasks()
      nextId = items.value.reduce((max, task) => Math.max(max, task.id), 0) + 1
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  function create(payload) {
    const task = {
      id: nextId++,
      title: payload.title,
      description: payload.description || '',
      status: payload.status || 'pending',
      createdAt: new Date().toISOString()
    }
    items.value.unshift(task)
    return task
  }

  function update(id, payload) {
    const current = items.value.find((task) => task.id === Number(id))
    if (!current) return null
    Object.assign(current, payload)
    return current
  }

  function remove(id) {
    items.value = items.value.filter((task) => task.id !== Number(id))
  }

  function find(id) {
    return items.value.find((task) => task.id === Number(id)) || null
  }

  return { items, loading, error, pendingCount, fetchAll, create, update, remove, find }
})
