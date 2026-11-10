<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useTaskStore } from './stores/tasks'

const store = useTaskStore()
</script>

<template>
  <header>
    <strong>Vue · tareas locales</strong>
    <nav>
      <RouterLink to="/tasks">Listado ({{ store.pendingCount }} abiertas)</RouterLink>
      <RouterLink to="/tasks/new">Nueva</RouterLink>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>
