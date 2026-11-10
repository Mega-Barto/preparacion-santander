<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '../stores/tasks'

const props = defineProps({ id: { type: String, required: true } })
const store = useTaskStore()
const router = useRouter()

onMounted(async () => {
  if (store.items.length === 0) {
    await store.fetchAll()
  }
})

const task = computed(() => store.find(props.id))

function remove() {
  store.remove(props.id)
  router.push({ name: 'tasks' })
}
</script>

<template>
  <p v-if="!task">No existe esa tarea.</p>
  <article v-else>
    <h1>{{ task.title }}</h1>
    <p>{{ task.description || 'Sin descripción' }}</p>
    <p>Estado: {{ task.status }}</p>
    <button type="button" @click="remove">Borrar</button>
  </article>
</template>
