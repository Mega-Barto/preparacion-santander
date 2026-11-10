<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api/client'
import { useTaskStore } from '../stores/tasks'

const router = useRouter()
const store = useTaskStore()
const form = reactive({ title: '', description: '', status: 'pending' })
const localError = ref('')

async function onSubmit() {
  localError.value = ''
  try {
    await store.create({ ...form })
    router.push({ name: 'tasks' })
  } catch (e) {
    localError.value = api.messageFrom(e)
  }
}
</script>

<template>
  <h1>Nueva tarea</h1>
  <p v-if="localError" class="error">{{ localError }}</p>
  <form @submit.prevent="onSubmit">
    <label>
      Título
      <input v-model.trim="form.title" required maxlength="180" />
    </label>
    <label>
      Descripción
      <textarea v-model="form.description" />
    </label>
    <label>
      Estado
      <select v-model="form.status">
        <option value="pending">Pendiente</option>
        <option value="in_progress">En curso</option>
        <option value="done">Hecha</option>
      </select>
    </label>
    <button type="submit">Guardar</button>
  </form>
</template>
