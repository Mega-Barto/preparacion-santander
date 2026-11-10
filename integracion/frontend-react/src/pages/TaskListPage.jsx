import { useState } from 'react'
import { useTasks } from '../state/TaskContext'

export function TaskListPage() {
  const { items, loading, update, remove } = useTasks()
  const [rowError, setRowError] = useState('')

  async function changeStatus(task, status) {
    setRowError('')
    try {
      await update(task.id, { status })
    } catch (e) {
      setRowError(e.message)
    }
  }

  async function onRemove(id) {
    setRowError('')
    try {
      await remove(id)
    } catch (e) {
      setRowError(e.message)
    }
  }

  if (loading && items.length === 0) return <p>Cargando…</p>

  return (
    <>
      <h1>Tareas</h1>
      {rowError ? <p className="error">{rowError}</p> : null}
      {items.length === 0 ? <p>No hay tareas.</p> : null}
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>
                <select value={task.status} onChange={(event) => changeStatus(task, event.target.value)}>
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En curso</option>
                  <option value="done">Hecha</option>
                </select>
              </td>
              <td>
                <button type="button" onClick={() => onRemove(task.id)}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
