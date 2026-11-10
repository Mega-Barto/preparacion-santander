# Symfony — API REST JSON

Referencia usada en `integracion/backend`. Sin API Platform: controladores que devuelven JSON. Es más fácil de explicar en una prueba de 3 horas.

## Dependencias

```bash
composer require nelmio/cors-bundle
composer require symfony/serializer-pack
```

## Controlador

```php
namespace App\Controller;

use App\Entity\Task;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/tasks')]
class TaskApiController extends AbstractController
{
    public function __construct(
        private TaskRepository $tasks,
        private EntityManagerInterface $em,
        private ValidatorInterface $validator,
    ) {}

    #[Route('', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $data = array_map([$this, 'toArray'], $this->tasks->findBy([], ['createdAt' => 'DESC']));
        return $this->json($data);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $task = $this->tasks->find($id);
        if (!$task) {
            return $this->json(['error' => 'Task not found'], Response::HTTP_NOT_FOUND);
        }
        return $this->json($this->toArray($task));
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true) ?? [];
        $task = new Task();
        $task->setTitle((string) ($payload['title'] ?? ''));
        $task->setDescription($payload['description'] ?? null);
        if (!empty($payload['status'])) {
            $task->setStatus((string) $payload['status']);
        }

        $errors = $this->validator->validate($task);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->em->persist($task);
        $this->em->flush();
        return $this->json($this->toArray($task), Response::HTTP_CREATED);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $task = $this->tasks->find($id);
        if (!$task) {
            return $this->json(['error' => 'Task not found'], Response::HTTP_NOT_FOUND);
        }
        $payload = json_decode($request->getContent(), true) ?? [];
        if (array_key_exists('title', $payload)) {
            $task->setTitle((string) $payload['title']);
        }
        if (array_key_exists('description', $payload)) {
            $task->setDescription($payload['description']);
        }
        if (array_key_exists('status', $payload)) {
            $task->setStatus((string) $payload['status']);
        }
        $this->em->flush();
        return $this->json($this->toArray($task));
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $task = $this->tasks->find($id);
        if (!$task) {
            return $this->json(['error' => 'Task not found'], Response::HTTP_NOT_FOUND);
        }
        $this->em->remove($task);
        $this->em->flush();
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    private function toArray(Task $task): array
    {
        return [
            'id' => $task->getId(),
            'title' => $task->getTitle(),
            'description' => $task->getDescription(),
            'status' => $task->getStatus(),
            'createdAt' => $task->getCreatedAt()->format(\DateTimeInterface::ATOM),
        ];
    }
}
```

## CORS (`config/packages/nelmio_cors.yaml`)

```yaml
nelmio_cors:
    defaults:
        origin_regex: true
        allow_origin: ['^http://localhost:[0-9]+$', '^http://127.0.0.1:[0-9]+$']
        allow_methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE']
        allow_headers: ['Content-Type', 'Authorization']
        max_age: 3600
    paths:
        '^/api/': ~
```

## Códigos de estado

| Acción | Código |
|---|---|
| GET colección / ítem | 200 |
| POST creado | 201 |
| PUT/PATCH actualizado | 200 |
| DELETE | 204 sin cuerpo |
| Validación | 422 |
| No existe | 404 |
| JSON mal formado | 400 |

## Probar sin frontend

```bash
curl -s http://127.0.0.1:8000/api/tasks
curl -s -X POST http://127.0.0.1:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Estudiar Doctrine\",\"status\":\"pending\"}"
```

## Serializer (alternativa a `toArray`)

```php
return $this->json($task, 200, [], ['groups' => ['task:read']]);
```

```php
#[Groups(['task:read'])]
private ?int $id = null;
```

En la prueba, un método `toArray()` se explica más rápido y no depende de grupos.
