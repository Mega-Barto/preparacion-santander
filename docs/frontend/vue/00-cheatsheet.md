# Vue 3 — Cheatsheet

Versión de referencia: **Vue 3** + **Vite** + **Pinia** + **Vue Router 4**.

## Proyecto nuevo

```bash
npm create vue@latest vue-app
# elige: Router, Pinia. TypeScript no hace falta si el tiempo aprieta.
cd vue-app
npm install
npm run dev
```

Puerto de Vite: **5173**.

Si `create vue` pide red y no hay, copia `ejemplos/vue-app/` y ejecuta `npm install` (hace falta caché de npm o red para las dependencias).

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Single File Component

```vue
<script setup>
import { ref } from 'vue'

const title = ref('')
const emit = defineEmits(['save'])

function submit() {
  emit('save', title.value)
  title.value = ''
}
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model="title" placeholder="Título" />
    <button type="submit">Guardar</button>
  </form>
</template>
```

`<script setup>` es la Composition API sin `setup()`. Úsalo por defecto.

## Directivas

| Directiva | Uso |
|---|---|
| `v-bind:href` o `:href` | atributo |
| `v-on:click` o `@click` | evento |
| `v-model` | input bidireccional |
| `v-if` / `v-else` | crear o destruir |
| `v-show` | solo CSS `display` |
| `v-for="task in tasks" :key="task.id"` | lista |
| `@submit.prevent` | evita el reload del form |

## Reactividad

```js
import { ref, reactive, computed, watch } from 'vue'

const count = ref(0)
count.value++          // en script hace falta .value

const form = reactive({ title: '', status: 'pending' })
form.title = 'Hola'    // reactive no usa .value

const pending = computed(() => tasks.value.filter(t => t.status === 'pending'))
```

En el template, `count` se desenrolla solo: `{{ count }}`, no `{{ count.value }}`.

## Llamar a una API

```js
const tasks = ref([])
const error = ref('')

async function load() {
  const response = await fetch('http://127.0.0.1:8000/api/tasks')
  if (!response.ok) {
    error.value = 'No se pudieron cargar las tareas'
    return
  }
  tasks.value = await response.json()
}
```

## Errores frecuentes

| Síntoma | Causa |
|---|---|
| La lista no se actualiza | Mutaste un objeto que no es `ref`/`reactive` |
| `task.id` duplicado en consola | Falta `:key` estable |
| CORS | El backend no permite `http://localhost:5173` |
| Pantalla en blanco | Error de sintaxis en el SFC; mira la terminal de Vite |
