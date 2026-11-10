# React Router 6

## Instalar

```bash
npm install react-router-dom
```

## Rutas

```jsx
import { NavLink, Route, Routes } from 'react-router-dom'
import { TaskListPage } from './pages/TaskListPage'
import { TaskFormPage } from './pages/TaskFormPage'

export function App() {
  return (
    <>
      <nav>
        <NavLink to="/tasks">Tareas</NavLink>
        <NavLink to="/tasks/new">Nueva</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<TaskListPage />} />
        <Route path="/tasks/new" element={<TaskFormPage />} />
        <Route path="/tasks/:id" element={<TaskDetailPage />} />
      </Routes>
    </>
  )
}
```

Importa `Navigate` desde `react-router-dom`.

`/tasks/new` debe poder distinguirse de `/tasks/:id`. Declara `new` como ruta estática; React Router prioriza los segmentos estáticos frente a los dinámicos, pero no dejes de probar las dos URLs.

## `BrowserRouter`

Va una sola vez, envolviendo el árbol, en `main.jsx`. No lo pongas otra vez dentro de `App`.

## Leer parámetros

```jsx
import { useNavigate, useParams } from 'react-router-dom'

export function TaskDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  function close() {
    navigate('/tasks')
  }

  return <p>Tarea {id}</p>
}
```

## Navegar después de crear

```jsx
const navigate = useNavigate()

async function handleCreate(payload) {
  await createTask(payload)
  navigate('/tasks')
}
```

## `NavLink` activo

```css
nav a.active { font-weight: 700; }
```

`NavLink` añade la clase `active` sola.

## Query

```jsx
const [params] = useSearchParams()
const status = params.get('status')
```

## Ruta desconocida

```jsx
<Route path="*" element={<p>No existe esta página</p>} />
```
