# Symfony — Rutas y controladores

## Ruta con atributos (forma actual)

```php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class TaskController extends AbstractController
{
    #[Route('/tasks', name: 'task_index', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('task/index.html.twig', [
            'tasks' => [],
        ]);
    }

    #[Route('/tasks/{id}', name: 'task_show', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function show(int $id): Response
    {
        return $this->render('task/show.html.twig', ['id' => $id]);
    }
}
```

Prefijo para todo el controlador:

```php
#[Route('/api/tasks')]
class TaskApiController extends AbstractController
{
    #[Route('', name: 'api_task_list', methods: ['GET'])]
    public function list(): Response { /* ... */ }
}
```

## Parámetros

| Sintaxis | Significado |
|---|---|
| `{id}` | segmento obligatorio |
| `{slug?}` | opcional |
| `requirements: ['id' => '\d+']` | solo dígitos |
| `methods: ['POST']` | verbo HTTP |
| `defaults: ['page' => 1]` | valor por defecto |

## Inyección en la acción

Symfony resuelve argumentos por tipo o por nombre:

```php
public function create(Request $request, EntityManagerInterface $em): Response
```

- `Request` → petición actual
- servicios → por type-hint
- `{id}` → argumento con el mismo nombre

## Respuestas

```php
return new Response('texto', 200);
return $this->json(['ok' => true], 201);
return $this->redirectToRoute('task_index');
return $this->render('task/index.html.twig', ['tasks' => $tasks]);
```

## Generar URL en Twig y en PHP

```twig
<a href="{{ path('task_show', {id: task.id}) }}">Ver</a>
```

```php
$url = $this->generateUrl('task_show', ['id' => $task->getId()]);
```

## Rutas en YAML (alternativa)

`config/routes.yaml`:

```yaml
task_index:
    path: /tasks
    controller: App\Controller\TaskController::index
    methods: [GET]
```

## Comprobar

```bash
php bin/console debug:router
php bin/console debug:router task_show
php bin/console router:match /tasks/1
```

## Acceso y usuario

```php
$this->denyAccessUnlessGranted('ROLE_USER');
$user = $this->getUser();
```

## Flash messages

```php
$this->addFlash('success', 'Tarea creada');
```

```twig
{% for message in app.flashes('success') %}
    <div>{{ message }}</div>
{% endfor %}
```
