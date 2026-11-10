# Pinia

## Instalar

```bash
npm install pinia
```

```js
// main.js
import { createPinia } from 'pinia'
app.use(createPinia())
```

## Store de tareas

`src/stores/tasks.js`:

```js
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
      error.value = e.message
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
    const index = items.value.findIndex((task) => task.id === id)
    if (index !== -1) items.value[index] = updated
    return updated
  }

  async function remove(id) {
    await api.remove(id)
    items.value = items.value.filter((task) => task.id !== id)
  }

  return { items, loading, error, pendingCount, fetchAll, create, update, remove }
})
```

Esta es la sintaxis **setup store**. La de `state/getters/actions` también es válida; no las mezcles en el mismo store.

## Usarlo en una vista

```vue
<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '../stores/tasks'

const store = useTaskStore()
const { items, loading, error } = storeToRefs(store)

onMounted(() => {
  store.fetchAll()
})
</script>
```

`storeToRefs` mantiene la reactividad al desestructurar. Las acciones se llaman en `store.fetchAll`, no se desestructuran con `storeToRefs`.

## Cuándo no hace falta Pinia

Si el estado vive en una sola vista, `ref` local es suficiente. El ejemplo `ejemplos/vue-app` no usa backend y puede guardar la lista en el componente raíz. La integración sí usa Pinia porque varias rutas comparten las tareas.
