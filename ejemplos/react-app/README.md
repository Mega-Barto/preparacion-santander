# Todo-list React 18 (sin backend)

La lista inicial llega con `fetch` de `public/tasks.json`. El resto de cambios vive en un Context + `useReducer` y se pierde al recargar.

## Arrancar

```powershell
cd ejemplos/react-app
npm install
npm run dev
```

Puerto **5175**.

## Rutas

| Ruta | Página |
|---|---|
| `/tasks` | listado |
| `/tasks/new` | formulario |

## Qué mirar

| Pieza | Archivo |
|---|---|
| Reducer y contexto | `src/state/TaskContext.jsx` |
| HTTP | `src/api/taskService.js` |
| Listado | `src/pages/TaskListPage.jsx` |
| Formulario | `src/pages/TaskFormPage.jsx` |
| Ítem | `src/components/TaskItem.jsx` |
