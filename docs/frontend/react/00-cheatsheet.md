# React — Cheatsheet

Versión de referencia: **React 18** con **Vite** y **React Router 6**.

## Proyecto nuevo

```bash
npm create vite@latest react-app -- --template react
cd react-app
npm install
npm install react-router-dom
npm run dev
```

Vite usa el puerto **5173** por defecto. Si Vue ya lo ocupa, Vite ofrece el siguiente. En la integración de este repo el frontend React está fijado en el **3000** para no chocar con Vue.

Create React App (`npx create-react-app`) sigue funcionando pero tarda más. Si el puesto solo tiene CRA, el código de componentes no cambia; cambian `index.js` y el script `react-scripts`.

## Arranque (`src/main.jsx`)

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

## Componente

```jsx
import { useState } from 'react'

export function TaskForm({ onSave }) {
  const [title, setTitle] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onSave(title)
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button type="submit">Guardar</button>
    </form>
  )
}
```

## Reglas que se olvidan

- El estado no se muta: `setTasks([...tasks, created])`, no `tasks.push`.
- La lista necesita `key` estable: `key={task.id}`.
- Los handlers van como `onClick={fn}`, no `onClick="fn()"`.
- `className`, no `class`. `htmlFor`, no `for`.
- Un componente devuelve un solo nodo padre (o un fragmento `<>...</>`).

## Fetch

```jsx
useEffect(() => {
  let cancelled = false
  fetch('http://127.0.0.1:8000/api/tasks')
    .then((response) => {
      if (!response.ok) throw new Error('HTTP ' + response.status)
      return response.json()
    })
    .then((data) => {
      if (!cancelled) setTasks(data)
    })
    .catch((e) => {
      if (!cancelled) setError(e.message)
    })
  return () => {
    cancelled = true
  }
}, [])
```

El array vacío significa "solo al montar".

## Errores frecuentes

| Síntoma | Causa |
|---|---|
| Bucle infinito de peticiones | `useEffect` sin array de dependencias, y dentro hay un `setState` |
| Input que no se puede escribir | `value={title}` sin `onChange` |
| Pantalla en blanco | Error de render; abre la consola del navegador |
| CORS | Origen del dev server no permitido en Symfony |
