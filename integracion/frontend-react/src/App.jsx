import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { useTasks } from './state/TaskContext'
import { TaskListPage } from './pages/TaskListPage'
import { TaskFormPage } from './pages/TaskFormPage'

export default function App() {
  const { items, error } = useTasks()
  const open = items.filter((task) => task.status !== 'done').length

  return (
    <>
      <header>
        <div className="brand">
          <strong>Home Elements</strong>
          <span>Cada día mejor · Symfony + React</span>
        </div>
        <nav>
          <NavLink to="/tasks">Tareas ({open} abiertas)</NavLink>
          <NavLink to="/tasks/new">Nueva</NavLink>
        </nav>
      </header>
      <main>
        {error ? <p className="error">{error}</p> : null}
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/tasks/new" element={<TaskFormPage />} />
          <Route path="*" element={<p>No existe esta página.</p>} />
        </Routes>
      </main>
    </>
  )
}
