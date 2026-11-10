# Vue 3 — Componentes

## Registro

Con `<script setup>`, un import basta. No hay `components: { }`.

```vue
<script setup>
import TaskItem from './TaskItem.vue'
</script>

<template>
  <TaskItem
    v-for="task in tasks"
    :key="task.id"
    :task="task"
    @remove="remove"
  />
</template>
```

## Lista

Siempre `:key` con un id, no con el índice, si la lista se reordena o se borra.

```vue
<ul>
  <li v-for="task in tasks" :key="task.id">{{ task.title }}</li>
</ul>
<p v-if="tasks.length === 0">No hay tareas.</p>
```

## Formulario controlado

```vue
<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['submit'])
const form = reactive({
  title: '',
  description: '',
  status: 'pending'
})

function onSubmit() {
  emit('submit', { ...form })
  form.title = ''
  form.description = ''
  form.status = 'pending'
}
</script>

<template>
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
```

`v-model.trim` quita espacios. `required` es validación nativa del navegador, suficiente para un primer corte.

## Clases dinámicas

```vue
<span :class="{ done: task.status === 'done' }">{{ task.status }}</span>
```

## Slot

```vue
<!-- Card.vue -->
<template>
  <section class="card">
    <slot />
  </section>
</template>
```

```vue
<Card>
  <TaskForm @submit="create" />
</Card>
```

## Dónde vive cada cosa

| Pieza | Carpeta |
|---|---|
| Pantallas de ruta | `src/views/` |
| Trozos reutilizables | `src/components/` |
| Estado global | `src/stores/` |
| HTTP | `src/api/` |
| Rutas | `src/router/index.js` |

Una vista puede ser "tonta" y recibir datos por props, o leer el store. En el ejemplo integrado las vistas hablan con Pinia para no encadenar props.
