import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { api } from '../api/client'

export const useTaskStore = defineStore('tasks', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref('')

  const pendingCount = computed(
    () => items.value.filter((task) => task.status !== 'done').length
  )

  async function fetchAll() {
    loading.value = true
    error.value = ''
    try {
      items.value = await api.list()
    } catch (e) {
      error.value = api.messageFrom(e)
    } finally {
      loading.value = false
    }
  }

  async function create(payload) {
    const created = await api.create(payload)
    items.value.unshift(created)
    return created
  }

  async function update(id, payload) {
    const updated = await api.update(id, payload)
    const index = items.value.findIndex((task) => task.id === updated.id)
    if (index === -1) items.value.unshift(updated)
    else items.value[index] = updated
    return updated
  }

  async function remove(id) {
    await api.remove(id)
    items.value = items.value.filter((task) => task.id !== Number(id))
  }

  function find(id) {
    return items.value.find((task) => task.id === Number(id)) || null
  }

  return { items, loading, error, pendingCount, fetchAll, create, update, remove, find }
})
