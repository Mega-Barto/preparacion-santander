# React — Hooks

## `useState`

```jsx
const [tasks, setTasks] = useState([])
const [form, setForm] = useState({ title: '', description: '', status: 'pending' })

setForm({ ...form, title: event.target.value })
```

Si el estado nuevo depende del anterior, usa la forma funcional:

```jsx
setTasks((current) => current.filter((task) => task.id !== id))
```

## `useEffect`

```jsx
useEffect(() => {
  load()
}, [])
```

| Dependencias | Cuándo corre |
|---|---|
| sin segundo argumento | después de cada render (casi nunca lo quieres) |
| `[]` | al montar |
| `[id]` | al montar y cuando `id` cambia |
| función return | limpieza al desmontar o antes de repetir el efecto |

No declares funciones async directamente como callback de `useEffect`. Declara `async function load()` dentro y llámala.

## `useMemo` y `useCallback`

```jsx
const pending = useMemo(
  () => tasks.filter((task) => task.status !== 'done'),
  [tasks]
)
```

En un CRUD de examen no optimices antes de que vaya lento. `useMemo` no sustituye a un cálculo incorrecto.

## `useRef`

Guarda un valor que no debe redibujar (un id de timer, o un input para hacer `.focus()`).

```jsx
const titleRef = useRef(null)
titleRef.current?.focus()
```

## `useId`

Ids únicos para `label` + `input` si hay varios formularios en la página. Opcional en un ejercicio.

## Reglas de los hooks

1. Solo se llaman en el nivel superior del componente (no dentro de un `if`).
2. Solo se llaman desde componentes o desde hooks propios (`useTasks`).
3. El nombre de un hook propio empieza por `use`.

## Hook propio

```jsx
export function useTasks(service) {
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')

  async function refresh() {
    try {
      setTasks(await service.list())
      setError('')
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return { tasks, error, refresh, setTasks }
}
```

Si el estado lo necesitan varias rutas, prefiere Context (`04-estado-contexto.md`) antes que levantar el hook en cada página.
