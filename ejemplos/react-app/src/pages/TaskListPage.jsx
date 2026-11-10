import { TaskItem } from '../components/TaskItem'
import { useTasks } from '../state/TaskContext'

const cycle = { pending: 'in_progress', in_progress: 'done', done: 'pending' }

export function TaskListPage() {
  const { items, loading, error, update, remove } = useTasks()

  function toggle(id) {
    const task = items.find((item) => item.id === id)
    if (!task) return
    update(id, { status: cycle[task.status] || 'pending' })
  }

  if (loading) return <p>Cargando…</p>
  if (error) return <p>{error}</p>

  return (
    <>
      <h1>Tareas</h1>
      {items.length === 0 ? <p>No hay tareas.</p> : null}
      {items.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={toggle} onRemove={remove} />
      ))}
    </>
  )
}
