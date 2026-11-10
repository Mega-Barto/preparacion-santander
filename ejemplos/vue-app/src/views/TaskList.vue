<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import TaskItem from '../components/TaskItem.vue'
import { useTaskStore } from '../stores/tasks'

const store = useTaskStore()
const { items, loading, error } = storeToRefs(store)

const cycle = { pending: 'in_progress', in_progress: 'done', done: 'pending' }

onMounted(() => {
  if (items.value.length === 0) {
    store.fetchAll()
  }
})

function toggle(id) {
  const task = store.find(id)
  if (!task) return
  store.update(id, { status: cycle[task.status] || 'pending' })
}
</script>

<template>
  <h1>Tareas</h1>
  <p v-if="loading">Cargando…</p>
  <p v-else-if="error">{{ error }}</p>
  <p v-else-if="items.length === 0">No hay tareas.</p>
  <TaskItem
    v-for="task in items"
    :key="task.id"
    :task="task"
    @toggle="toggle"
    @remove="store.remove"
  />
</template>
