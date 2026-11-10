# Vue 3 — Composition API

## `ref` y `reactive`

- `ref` para primitivos y también para arrays u objetos si quieres reemplazarlos enteros (`tasks.value = [...]`).
- `reactive` para un formulario cuyo interior cambia campo a campo. No reasignes el objeto completo (`form = {}` rompe la reactividad).

## `computed`

```js
const remaining = computed(() => tasks.value.filter(t => t.status !== 'done').length)
```

No pongas efectos secundarios dentro. Es una derivación.

## `watch` y `watchEffect`

```js
watch(() => route.params.id, (id) => {
  loadOne(id)
})

watchEffect(() => {
  document.title = `${remaining.value} pendientes`
})
```

`watch` reacciona a una fuente concreta. `watchEffect` rastrea todo lo que leas dentro.

## Ciclo de vida

```js
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  load()
})
```

En `<script setup>` no existe `mounted()`. Son funciones `onMounted`, `onUpdated`, `onUnmounted`.

## Props y emits

```vue
<script setup>
const props = defineProps({
  task: { type: Object, required: true }
})
const emit = defineEmits(['remove', 'toggle'])
</script>

<template>
  <article>
    <h2>{{ task.title }}</h2>
    <button type="button" @click="emit('toggle', task.id)">Cambiar estado</button>
    <button type="button" @click="emit('remove', task.id)">Borrar</button>
  </article>
</template>
```

No mutar `props`. Pide al padre que cambie el dato mediante un evento, o cámbialo en el store.

## Composable (lógica reutilizable)

`src/composables/useTasks.js`:

```js
import { ref } from 'vue'

export function useTasks() {
  const tasks = ref([])
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      const response = await fetch('/api/tasks')
      tasks.value = await response.json()
    } finally {
      loading.value = false
    }
  }

  return { tasks, loading, load }
}
```

Un composable es una función que usa la API de Vue. No es un componente.

## Provide / inject

Sirve para no pasar props por cinco niveles. Si el estado es de la aplicación (la lista de tareas), Pinia es más claro que `provide`.
