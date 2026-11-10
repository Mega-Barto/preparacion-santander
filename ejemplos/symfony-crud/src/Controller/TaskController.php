<?php

namespace App\Controller;

use App\Entity\Task;
use App\Form\TaskType;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class TaskController extends AbstractController
{
    #[Route('/', name: 'home', methods: ['GET'])]
    public function home(): Response
    {
        return $this->redirectToRoute('task_index');
    }

    #[Route('/tasks', name: 'task_index', methods: ['GET'])]
    public function index(TaskRepository $tasks): Response
    {
        return $this->render('task/index.html.twig', [
            'tasks' => $tasks->findLatest(),
        ]);
    }

    #[Route('/tasks/new', name: 'task_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $em): Response
    {
        $task = new Task();
        $form = $this->createForm(TaskType::class, $task);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($task);
            $em->flush();
            $this->addFlash('success', 'Tarea creada');

            return $this->redirectToRoute('task_show', ['id' => $task->getId()]);
        }

        return $this->render('task/form.html.twig', [
            'form' => $form,
            'title' => 'Nueva tarea',
        ]);
    }

    #[Route('/tasks/{id}', name: 'task_show', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function show(Task $task): Response
    {
        return $this->render('task/show.html.twig', [
            'task' => $task,
        ]);
    }

    #[Route('/tasks/{id}/edit', name: 'task_edit', requirements: ['id' => '\d+'], methods: ['GET', 'POST'])]
    public function edit(Task $task, Request $request, EntityManagerInterface $em): Response
    {
        $form = $this->createForm(TaskType::class, $task);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->flush();
            $this->addFlash('success', 'Tarea actualizada');

            return $this->redirectToRoute('task_show', ['id' => $task->getId()]);
        }

        return $this->render('task/form.html.twig', [
            'form' => $form,
            'title' => 'Editar tarea',
        ]);
    }

    #[Route('/tasks/{id}/delete', name: 'task_delete', requirements: ['id' => '\d+'], methods: ['POST'])]
    public function delete(Task $task, Request $request, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('delete'.$task->getId(), (string) $request->request->get('_token'))) {
            $em->remove($task);
            $em->flush();
            $this->addFlash('success', 'Tarea eliminada');
        }

        return $this->redirectToRoute('task_index');
    }
}
