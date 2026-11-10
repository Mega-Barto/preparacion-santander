import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTasks } from '../state/TaskContext'

export function TaskFormPage() {
  const { create } = useTasks()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' })

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    create(form)
    navigate('/tasks')
  }

  return (
    <>
      <h1>Nueva tarea</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Título
          <input name="title" value={form.title} onChange={updateField} required maxLength={180} />
        </label>
        <label>
          Descripción
          <textarea name="description" value={form.description} onChange={updateField} />
        </label>
        <label>
          Estado
          <select name="status" value={form.status} onChange={updateField}>
            <option value="pending">Pendiente</option>
            <option value="in_progress">En curso</option>
            <option value="done">Hecha</option>
          </select>
        </label>
        <button type="submit">Guardar</button>
      </form>
    </>
  )
}
