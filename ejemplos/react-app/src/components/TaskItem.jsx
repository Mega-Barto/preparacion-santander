const labels = { pending: 'Pendiente', in_progress: 'En curso', done: 'Hecha' }

export function TaskItem({ task, onToggle, onRemove }) {
  return (
    <article>
      <h2>{task.title}</h2>
      <p>{labels[task.status] || task.status}</p>
      <button type="button" onClick={() => onToggle(task.id)}>Cambiar estado</button>
      <button type="button" onClick={() => onRemove(task.id)}>Borrar</button>
    </article>
  )
}
