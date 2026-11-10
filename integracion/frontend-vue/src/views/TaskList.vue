<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '../stores/tasks'

const store = useTaskStore()
const { items, loading } = storeToRefs(store)

onMounted(() => store.fetchAll())

async function remove(id) {
  try {
    await store.remove(id)
  } catch (e) {
    store.error = e.response?.data?.error || e.message
  }
}
</script>

<template>
  <h1>Tareas</h1>
  <p v-if="loading">Cargando…</p>
  <p v-else-if="items.length === 0">No hay tareas.</p>
  <table v-else>
    <thead>
      <tr>
        <th>Título</th>
        <th>Estado</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="task in items" :key="task.id">
        <td>
          <RouterLink :to="{ name: 'task-detail', params: { id: task.id } }">{{ task.title }}</RouterLink>
        </td>
        <td>{{ task.status }}</td>
        <td><button type="button" @click="remove(task.id)">Borrar</button></td>
      </tr>
    </tbody>
  </table>
</template>
