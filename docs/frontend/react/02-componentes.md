# React — Componentes

## Función, no clase

Escribe componentes de función. Las clases (`extends Component`) solo si el enunciado muestra una y hay que retocarla.

## Props

```jsx
export function TaskItem({ task, onToggle, onRemove }) {
  return (
    <article>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <button type="button" onClick={() => onToggle(task.id)}>Estado</button>
      <button type="button" onClick={() => onRemove(task.id)}>Borrar</button>
    </article>
  )
}
```

Las props son de solo lectura.

## Lista

```jsx
export function TaskList({ tasks, onRemove }) {
  if (tasks.length === 0) {
    return <p>No hay tareas.</p>
  }
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskItem task={task} onRemove={onRemove} />
        </li>
      ))}
    </ul>
  )
}
```

## Formulario controlado

```jsx
export function TaskForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending'
  })

  function update(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(form)
    setForm({ title: '', description: '', status: 'pending' })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={form.title} onChange={update} required maxLength={180} />
      <textarea name="description" value={form.description} onChange={update} />
      <select name="status" value={form.status} onChange={update}>
        <option value="pending">Pendiente</option>
        <option value="in_progress">En curso</option>
        <option value="done">Hecha</option>
      </select>
      <button type="submit">Guardar</button>
    </form>
  )
}
```

El atributo `name` coincide con la clave del estado. Un solo `update` sirve para todos los campos.

## Estilos

Para la prueba, un `App.css` con pocas clases basta. Evita montar una librería de UI si no está ya instalada.

## Composición

```jsx
export function Card({ children }) {
  return <section className="card">{children}</section>
}
```

`children` es la prop especial de lo que va entre las etiquetas.
