# Vue Router 4

## Instalar

```bash
npm install vue-router@4
```

`npm create vue` ya lo deja montado si lo marcas.

## `src/router/index.js`

```js
import { createRouter, createWebHistory } from 'vue-router'
import TaskList from '../views/TaskList.vue'
import TaskForm from '../views/TaskForm.vue'
import TaskDetail from '../views/TaskDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/tasks' },
    { path: '/tasks', name: 'tasks', component: TaskList },
    { path: '/tasks/new', name: 'task-new', component: TaskForm },
    { path: '/tasks/:id', name: 'task-detail', component: TaskDetail, props: true }
  ]
})

export default router
```

`/tasks/new` tiene que declararse **antes** que `/tasks/:id` si no usas un requisito numérico. Si `:id` va primero, la palabra `new` se interpreta como id.

Con requisito:

```js
{ path: '/tasks/:id(\\d+)', name: 'task-detail', component: TaskDetail, props: true }
```

## `main.js`

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

createApp(App).use(createPinia()).use(router).mount('#app')
```

## Enlaces y navegación

```vue
<RouterLink to="/tasks">Listado</RouterLink>
<RouterLink :to="{ name: 'task-detail', params: { id: task.id } }">Detalle</RouterLink>
```

```js
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

router.push({ name: 'tasks' })
const id = route.params.id
```

## Layout

`App.vue`:

```vue
<template>
  <header>
    <RouterLink to="/tasks">Tareas</RouterLink>
    <RouterLink to="/tasks/new">Nueva</RouterLink>
  </header>
  <main>
    <RouterView />
  </main>
</template>
```

## Guard sencillo

```js
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    return { name: 'login' }
  }
})
```

## Query string

`/tasks?status=pending` → `route.query.status`.
