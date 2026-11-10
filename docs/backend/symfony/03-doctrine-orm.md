# Symfony — Doctrine ORM

## Configuración

`config/packages/doctrine.yaml` usa `DATABASE_URL` del `.env`.

```dotenv
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/app?serverVersion=16&charset=utf8"
```

```bash
php bin/console doctrine:database:create
```

## Entidad

```php
namespace App\Entity;

use App\Repository\TaskRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: TaskRepository::class)]
#[ORM\Table(name: 'tasks')]
class Task
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 180)]
    private string $title = '';

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 20)]
    private string $status = 'pending';

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }
    public function getTitle(): string { return $this->title; }
    public function setTitle(string $title): void { $this->title = $title; }
    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): void { $this->description = $description; }
    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): void { $this->status = $status; }
    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }
}
```

## Relaciones que salen en una prueba

```php
// Muchos tasks pertenecen a un usuario
#[ORM\ManyToOne(inversedBy: 'tasks')]
#[ORM\JoinColumn(nullable: false)]
private User $owner;

// Un usuario tiene muchos tasks
#[ORM\OneToMany(mappedBy: 'owner', targetEntity: Task::class, orphanRemoval: true)]
private Collection $tasks;
```

| Relación | Dónde va el FK |
|---|---|
| ManyToOne | en la entidad del "muchos" |
| OneToMany | lado inverso, no crea columna |
| ManyToMany | tabla intermedia automática |
| OneToOne | en el lado dueño (`inversedBy` / `mappedBy`) |

## Repositorio

```php
namespace App\Repository;

use App\Entity\Task;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class TaskRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Task::class);
    }

    /** @return Task[] */
    public function findByStatus(string $status): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.status = :status')
            ->setParameter('status', $status)
            ->orderBy('t.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
```

## EntityManager — CRUD

```php
public function __construct(private EntityManagerInterface $em) {}

// Crear
$this->em->persist($task);
$this->em->flush();

// Leer
$task = $this->em->getRepository(Task::class)->find($id);
$all = $this->em->getRepository(Task::class)->findAll();
$one = $this->em->getRepository(Task::class)->findOneBy(['title' => 'Demo']);

// Actualizar: modificar el objeto y flush
$task->setStatus('done');
$this->em->flush();

// Borrar
$this->em->remove($task);
$this->em->flush();
```

## Migraciones

```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
php bin/console doctrine:migrations:migrate prev   # deshacer la última
```

En una prueba corta, si no piden migraciones versionadas:

```bash
php bin/console doctrine:schema:update --force
```

Úsalo solo en desarrollo. En la respuesta explica que en producción se usan migraciones.

## DQL rápido

```php
$dql = 'SELECT t FROM App\Entity\Task t WHERE t.status = :status ORDER BY t.createdAt DESC';
$query = $this->em->createQuery($dql)->setParameter('status', 'pending');
$tasks = $query->getResult();
```

## Tipos de columna habituales

| PHP | Atributo |
|---|---|
| `int` | `#[ORM\Column]` |
| `string` | `#[ORM\Column(length: 255)]` |
| `text` | `#[ORM\Column(type: 'text')]` |
| `bool` | `#[ORM\Column]` |
| `\DateTimeImmutable` | `#[ORM\Column]` |
| `float` / decimal | `#[ORM\Column(type: 'decimal', precision: 10, scale: 2)]` |
