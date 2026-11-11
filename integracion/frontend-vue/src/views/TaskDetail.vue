<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api/client'
import { useTaskStore } from '../stores/tasks'

const props = defineProps({ id: { type: String, required: true } })
const store = useTaskStore()
const router = useRouter()
const task = ref(null)
const status = ref('pending')
const localError = ref('')

async function load() {
  localError.value = ''
  const cached = store.find(props.id)
  if (cached) {
    task.value = cached
    status.value = cached.status
    return
  }
  try {
    task.value = await api.show(props.id)
    status.value = task.value.status
  } catch (e) {
    localError.value = api.messageFrom(e)
    task.value = null
  }
}

onMounted(load)
watch(() => props.id, load)

async function saveStatus() {
  localError.value = ''
  try {
    task.value = await store.update(props.id, { status: status.value })
  } catch (e) {
    localError.value = api.messageFrom(e)
  }
}

async function remove() {
  await store.remove(props.id)
  router.push({ name: 'tasks' })
}
</script>

<template>
  <p v-if="localError" class="error">{{ localError }}</p>
  <p v-if="!task && !localError">Cargando…</p>
  <article v-if="task">
    <h1>{{ task.title }}</h1>
    <p>{{ task.description || 'Sin descripción' }}</p>
    <p>Creada: {{ task.createdAt }}</p>
    <label>
      Estado
      <select v-model="status">
        <option value="pending">Pendiente</option>
        <option value="in_progress">En curso</option>
        <option value="done">Hecha</option>
      </select>
    </label>
    <button type="button" class="primary" @click="saveStatus">Guardar estado</button>
    <button type="button" @click="remove">Borrar</button>
  </article>
</template>
