# CRUD completo — los cuatro verbos

Dominio `Task`: `id`, `title`, `description`, `status`, `createdAt`.

## Symfony

Rutas en un controlador con prefijo `/api/tasks`:

| Método | Acción | Código |
|---|---|---|
| GET colección | `findBy([], ['createdAt' => 'DESC'])` | 200 |
| GET uno | `find($id)` o 404 | 200 / 404 |
| POST | `new Task()` + `persist` + `flush` | 201 |
| PUT | modificar la entidad ya gestionada + `flush` | 200 |
| DELETE | `remove` + `flush`, cuerpo vacío | 204 |

El controlador de referencia está en `integracion/backend/src/Controller/TaskApiController.php`.

Leer el JSON:

```php
$payload = json_decode($request->getContent(), true);
if (!is_array($payload)) {
    return $this->json(['error' => 'Invalid JSON'], 400);
}
```

No hace falta `persist` en el PUT si la entidad salió del repositorio en la misma petición: Doctrine ya la vigila.

## Vue (Pinia)

```javascript
async function fetchAll() {
  items.value = await api.list()
}
async function create(payload) {
  const created = await api.create(payload)
  items.value.unshift(created)
}
async function update(id, payload) {
  const updated = await api.update(id, payload)
  const index = items.value.findIndex((task) => task.id === updated.id)
  if (index !== -1) items.value[index] = updated
}
async function remove(id) {
  await api.remove(id)
  items.value = items.value.filter((task) => task.id !== id)
}
```

## React (useReducer)

```javascript
case 'loaded':
  return { ...state, items: action.items }
case 'created':
  return { ...state, items: [action.item, ...state.items] }
case 'updated':
  return {
    ...state,
    items: state.items.map((task) => (task.id === action.item.id ? action.item : task))
  }
case 'removed':
  return { ...state, items: state.items.filter((task) => task.id !== action.id) }
```

Las peticiones HTTP no van dentro del reducer. Van en el provider, y el reducer solo recibe el resultado. Ver `integracion/frontend-react/src/state/TaskContext.jsx`.

## Spring Boot

La misma tabla de verbos, con `@GetMapping`, `@PostMapping` (`201`), `@PutMapping` y `@DeleteMapping` (`204`). El ejemplo está en `ejemplos/springboot-crud`.

## Orden de prueba manual

```powershell
curl http://127.0.0.1:8000/api/tasks
curl -X POST http://127.0.0.1:8000/api/tasks -H "Content-Type: application/json" -d "{\"title\":\"Nueva\",\"status\":\"pending\"}"
curl -X PUT http://127.0.0.1:8000/api/tasks/1 -H "Content-Type: application/json" -d "{\"title\":\"Nueva\",\"status\":\"done\"}"
curl -X DELETE http://127.0.0.1:8000/api/tasks/1
```

En PowerShell, `curl` es un alias de `Invoke-WebRequest`. Si el JSON se deforma, usa `curl.exe`.
