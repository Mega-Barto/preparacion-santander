# Symfony — Servicios e inyección de dependencias

## Regla práctica

Si la clase está bajo `src/` y no es una entidad, Symfony la puede inyectar. No hace falta declararla en YAML.

```php
namespace App\Service;

use App\Entity\Task;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;

class TaskManager
{
    public function __construct(
        private TaskRepository $tasks,
        private EntityManagerInterface $em,
    ) {}

    public function create(string $title, ?string $description): Task
    {
        $task = new Task();
        $task->setTitle($title);
        $task->setDescription($description);
        $this->em->persist($task);
        $this->em->flush();
        return $task;
    }

    /** @return Task[] */
    public function openTasks(): array
    {
        return $this->tasks->findByStatus('pending');
    }
}
```

Uso en el controlador: añadir `TaskManager $tasks` al constructor o a la acción.

## Cuándo sí tocar `services.yaml`

- La clase no vive en `src/`.
- Quieres un alias de interfaz.
- Hay parámetros (un string de configuración).

```yaml
services:
    App\Service\Mailer:
        arguments:
            $from: '%env(MAIL_FROM)%'
```

## Bind de parámetros

```yaml
services:
    _defaults:
        bind:
            $tasksPerPage: 20
```

```php
public function __construct(private int $tasksPerPage) {}
```

## Interfaces

```php
interface TaskRepositoryInterface
{
    public function findOpen(): array;
}
```

```yaml
services:
    App\Domain\TaskRepositoryInterface: '@App\Repository\DoctrineTaskRepository'
```

## Eventos (por si lo piden)

```php
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

#[AsEventListener]
class SendTaskCreatedMail
{
    public function __invoke(TaskCreatedEvent $event): void
    {
        // reaccionar
    }
}
```

## Contenedor en la prueba

```bash
php bin/console debug:autowiring Task
php bin/console debug:container TaskManager
```

No uses `$this->get('nombre')` salvo que el enunciado lo pida. Inyecta por constructor.

## Lo que no se inyecta

- Entidades (`Task`): se crean con `new` o las devuelve el repositorio.
- DTO de entrada: se hidratan desde el `Request`.
