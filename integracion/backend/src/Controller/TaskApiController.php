<?php

namespace App\Controller;

use App\Entity\Task;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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
    ) {
    }

    #[Route('', name: 'api_task_list', methods: ['GET'])]
    public function list(): Response
    {
        $data = array_map(
            [$this, 'toArray'],
            $this->tasks->findBy([], ['createdAt' => 'DESC'])
        );

        return $this->json($data);
    }

    #[Route('/{id}', name: 'api_task_show', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function show(int $id): Response
    {
        $task = $this->tasks->find($id);
        if (!$task) {
            return $this->json(['error' => 'Task not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->toArray($task));
    }

    #[Route('', name: 'api_task_create', methods: ['POST'])]
    public function create(Request $request): Response
    {
        $payload = json_decode($request->getContent(), true);
        if (!is_array($payload)) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

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

    #[Route('/{id}', name: 'api_task_update', requirements: ['id' => '\d+'], methods: ['PUT'])]
    public function update(int $id, Request $request): Response
    {
        $task = $this->tasks->find($id);
        if (!$task) {
            return $this->json(['error' => 'Task not found'], Response::HTTP_NOT_FOUND);
        }

        $payload = json_decode($request->getContent(), true);
        if (!is_array($payload)) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        if (array_key_exists('title', $payload)) {
            $task->setTitle((string) $payload['title']);
        }
        if (array_key_exists('description', $payload)) {
            $task->setDescription($payload['description']);
        }
        if (array_key_exists('status', $payload)) {
            $task->setStatus((string) $payload['status']);
        }

        $errors = $this->validator->validate($task);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->em->flush();

        return $this->json($this->toArray($task));
    }

    #[Route('/{id}', name: 'api_task_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function delete(int $id): Response
    {
        $task = $this->tasks->find($id);
        if (!$task) {
            return $this->json(['error' => 'Task not found'], Response::HTTP_NOT_FOUND);
        }

        $this->em->remove($task);
        $this->em->flush();

        return new Response('', Response::HTTP_NO_CONTENT);
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
