<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  task: { type: Object, required: true }
})
const emit = defineEmits(['toggle', 'remove'])

const labels = { pending: 'Pendiente', in_progress: 'En curso', done: 'Hecha' }
</script>

<template>
  <article>
    <h2>
      <RouterLink :to="{ name: 'task-detail', params: { id: task.id } }">{{ task.title }}</RouterLink>
    </h2>
    <p>{{ labels[task.status] || task.status }}</p>
    <button type="button" @click="emit('toggle', task.id)">Cambiar estado</button>
    <button type="button" @click="emit('remove', task.id)">Borrar</button>
  </article>
</template>
