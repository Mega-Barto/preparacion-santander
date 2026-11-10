# Symfony — Formularios y validación

## Form type

```php
namespace App\Form;

use App\Entity\Task;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TaskType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, ['label' => 'Título'])
            ->add('description', TextareaType::class, [
                'label' => 'Descripción',
                'required' => false,
            ])
            ->add('status', ChoiceType::class, [
                'label' => 'Estado',
                'choices' => [
                    'Pendiente' => 'pending',
                    'En curso' => 'in_progress',
                    'Hecha' => 'done',
                ],
            ])
            ->add('save', SubmitType::class, ['label' => 'Guardar']);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(['data_class' => Task::class]);
    }
}
```

## Controlador

```php
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

    return $this->render('task/new.html.twig', [
        'form' => $form,
    ]);
}
```

## Twig

```twig
{{ form_start(form) }}
    {{ form_row(form.title) }}
    {{ form_row(form.description) }}
    {{ form_row(form.status) }}
    {{ form_row(form.save) }}
{{ form_end(form) }}
```

`form_end` añade el token CSRF si no se pintó a mano.

## Validación en la entidad

```php
use Symfony\Component\Validator\Constraints as Assert;

#[Assert\NotBlank(message: 'El título es obligatorio')]
#[Assert\Length(min: 3, max: 180)]
private string $title = '';

#[Assert\Choice(choices: ['pending', 'in_progress', 'done'])]
private string $status = 'pending';
```

Validar sin formulario:

```php
$errors = $validator->validate($task);
if (count($errors) > 0) {
    return $this->json((string) $errors, 422);
}
```

## CSRF

Activado por defecto en formularios HTML. En una API JSON no se usa CSRF: se protege con token (JWT) y CORS.

## Editar

El mismo `TaskType` sirve. Pasas la entidad existente a `createForm` y no llamas a `persist` si Doctrine ya la está gestionando; basta `flush()`.
