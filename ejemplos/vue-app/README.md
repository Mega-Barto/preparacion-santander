# Todo-list Vue 3 (sin backend)

La lista inicial se carga con `fetch` desde `public/tasks.json`. Crear, cambiar estado y borrar solo afectan a la memoria de Pinia: al recargar vuelve el JSON.

Sirve para practicar Composition API, componentes, Vue Router y Pinia sin levantar Symfony.

## Arrancar

```powershell
cd ejemplos/vue-app
npm install
npm run dev
```

Abre la URL que imprima Vite (puerto **5174** en este ejemplo, para no chocar con la integración, que usa 5173).

## Rutas

| Ruta | Vista |
|---|---|
| `/tasks` | listado |
| `/tasks/new` | formulario |
| `/tasks/:id` | detalle |

## Qué mirar

| Pieza | Archivo |
|---|---|
| Store | `src/stores/tasks.js` |
| HTTP | `src/api/client.js` |
| Rutas | `src/router/index.js` |
| Listado | `src/views/TaskList.vue` |
| Formulario | `src/views/TaskForm.vue` |
