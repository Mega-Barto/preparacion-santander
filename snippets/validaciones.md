# Validaciones

La misma regla en dos sitios: en el cliente para responder pronto, y en el servidor porque el cliente se puede saltar.

Reglas de `Task` en este repo:

- `title`: obligatorio, máximo 180
- `status`: `pending`, `in_progress` o `done`
- `description`: opcional

## Symfony (atributos en la entidad)

```php
use Symfony\Component\Validator\Constraints as Assert;

#[Assert\NotBlank]
#[Assert\Length(max: 180)]
private string $title = '';

#[Assert\Choice(choices: ['pending', 'in_progress', 'done'])]
private string $status = 'pending';
```

Con formulario, `isValid()` ya ejecuta estas reglas. En la API:

```php
$errors = $validator->validate($task);
if (count($errors) > 0) {
    return $this->json(['errors' => (string) $errors], 422);
}
```

## Spring Boot

```java
@NotBlank
@Size(max = 180)
private String title;

@Pattern(regexp = "pending|in_progress|done")
private String status = "pending";
```

En el controlador, `@Valid` delante del `@RequestBody`. Sin `@Valid` las anotaciones no se ejecutan.

Paquete: `spring-boot-starter-validation` (`jakarta.validation`, no `javax`).

## HTML nativo (Vue y React)

En el input: `required` y `maxLength={180}` (React) o `maxlength="180"` (Vue). No cubre el `status` si alguien manipula el valor, por eso el backend repite la regla.

## Vue — Vuelidate

```bash
npm install @vuelidate/core @vuelidate/validators
```

```javascript
import { useVuelidate } from '@vuelidate/core'
import { maxLength, required } from '@vuelidate/validators'

const form = reactive({ title: '', status: 'pending' })
const rules = {
  title: { required, maxLength: maxLength(180) },
  status: { required }
}
const v$ = useVuelidate(rules, form)

async function onSubmit() {
  const ok = await v$.value.$validate()
  if (!ok) return
  await store.create(form)
}
```

```vue
<span v-if="v$.title.$error">El título es obligatorio (máx. 180).</span>
```

## React — Zod, sin librería de formularios

```bash
npm install zod
```

```javascript
import { z } from 'zod'

const taskSchema = z.object({
  title: z.string().trim().min(1).max(180),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'done'])
})

const parsed = taskSchema.safeParse(form)
if (!parsed.success) {
  setLocalError(parsed.error.issues[0].message)
  return
}
await create(parsed.data)
```

## React Hook Form + Zod (si ya lo has usado)

```bash
npm install react-hook-form zod @hookform/resolvers
```

```javascript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(taskSchema),
  defaultValues: { title: '', description: '', status: 'pending' }
})
```

```jsx
<input {...register('title')} />
{errors.title ? <span>{errors.title.message}</span> : null}
```

Si el tiempo aprieta, quédate con `required` en el input y la validación del backend. Zod o Vuelidate solo si el enunciado pide mensajes de error por campo.
