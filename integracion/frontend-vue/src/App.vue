<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useTaskStore } from './stores/tasks'

const store = useTaskStore()
</script>

<template>
  <header>
    <strong>Symfony + Vue</strong>
    <nav>
      <RouterLink to="/tasks">Tareas ({{ store.pendingCount }} abiertas)</RouterLink>
      <RouterLink to="/tasks/new">Nueva</RouterLink>
    </nav>
  </header>
  <main>
    <p v-if="store.error" class="error">{{ store.error }}</p>
    <RouterView />
  </main>
</template>
