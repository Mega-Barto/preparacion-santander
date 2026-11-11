# Lista de posibles desafíos técnicos

Organizados de más probable a menos probable, con indicación de qué usar del repo.

---

## ★ Nivel 1 — Casi seguro

### 1. CRUD completo con API REST (el más común)

> "Crea una API con los endpoints para gestionar [entidad]: listar, ver uno, crear, editar y borrar."

- **Entidad típica:** Producto, Cliente, Empleado, Tarea, Pedido, Propiedad, Préstamo.
- **Stack:** Symfony 6 **o** Spring Boot 3 + PostgreSQL.
- **Qué usar:**
  - Backend de referencia: `integracion/backend/src/Controller/TaskApiController.php`
  - Patrón de entidad: `integracion/backend/src/Entity/Task.php`
  - Snippet verbos: `snippets/crud-completo.md`
  - Conexión DB: `snippets/conexion-db.md`
- **Checklist mínimo:**
  - [ ] `GET /api/{entidades}` → 200 + array JSON
  - [ ] `GET /api/{entidades}/{id}` → 200 o 404
  - [ ] `POST /api/{entidades}` → 201 + objeto creado
  - [ ] `PUT /api/{entidades}/{id}` → 200 o 404
  - [ ] `DELETE /api/{entidades}/{id}` → 204 vacío
  - [ ] Validaciones con `#[Assert\...]` (Symfony) o `@Valid` + `@NotBlank` (Spring)
  - [ ] CORS si hay frontend (`nelmio_cors.yaml`)

---

### 2. CRUD con interfaz web (Twig o frontend JS)

> "Haz que se pueda crear, editar y borrar desde el navegador."

- **Variante A — HTML clásico (Symfony + Twig):**
  - Referencia: `ejemplos/symfony-crud/`
  - Patrón: `src/Form/TaskType.php` + `templates/task/`
  - Incluye token CSRF en el borrado
- **Variante B — SPA con Vue:**
  - Referencia: `integracion/frontend-vue/` o `ejemplos/vue-app/`
  - Patrón: store Pinia → `client.js` → API
- **Variante C — SPA con React:**
  - Referencia: `integracion/frontend-react/` o `ejemplos/react-app/`
  - Patrón: Context + `useReducer` → `taskService.js` → API

---

### 3. Filtrar y ordenar una lista

> "Que el listado se pueda filtrar por estado / categoría / fecha."

- **SQL:**
  ```sql
  SELECT * FROM productos WHERE categoria = $1 ORDER BY precio ASC;
  ```
- **Symfony:**
  ```php
  $this->repo->findBy(['status' => $status], ['createdAt' => 'DESC']);
  // O con QueryBuilder para filtros opcionales:
  $qb->andWhere('t.status = :status')->setParameter('status', $status);
  ```
- **Spring Boot:** método derivado `findByStatusOrderByCreatedAtDesc(String status)` en el repositorio.
- **Vue/React:** recibir `?status=pending` como query param en la URL y pasarlo a la API, o filtrar en el frontend con `.filter()`.
- **Referencia SQL:** `ejemplos/postgresql-scripts/03-queries.sql` (WHERE + ORDER BY + LIMIT)

---

### 4. Paginación

> "El listado no debe devolver todos los registros de golpe; implementa paginación."

- **SQL:**
  ```sql
  SELECT * FROM tasks ORDER BY created_at DESC LIMIT 10 OFFSET 0;
  -- Página 2: OFFSET 10; página 3: OFFSET 20...
  ```
- **Symfony:** `$this->repo->findBy([], ['createdAt' => 'DESC'], 10, ($page - 1) * 10)`
- **Spring Boot:** `repository.findAll(PageRequest.of(page, 10, Sort.by("createdAt").descending()))`
- **Frontend:** botones "Anterior / Siguiente" que cambian un `ref page` y llaman a la API con `?page=2&limit=10`.
- **Respuesta sugerida:**
  ```json
  { "data": [...], "total": 47, "page": 2, "limit": 10 }
  ```

---

## ★★ Nivel 2 — Probable

### 5. Relación uno a muchos (1:N)

> "Un usuario tiene muchas tareas / Un cliente tiene muchos pedidos / Una categoría tiene muchos productos."

- **SQL:**
  ```sql
  -- Tabla hija tiene FK
  ALTER TABLE tasks ADD COLUMN user_id BIGINT REFERENCES users(id) ON DELETE CASCADE;
  -- JOIN para obtener dueño
  SELECT t.*, u.name FROM tasks t JOIN users u ON u.id = t.user_id;
  ```
- **Symfony Doctrine:**
  ```php
  // En Task:
  #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'tasks')]
  private ?User $user = null;

  // En User:
  #[ORM\OneToMany(mappedBy: 'user', targetEntity: Task::class)]
  private Collection $tasks;
  ```
- **Spring Boot JPA:**
  ```java
  // En Task:
  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  // En User:
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
  private List<Task> tasks = new ArrayList<>();
  ```
- **Referencia SQL:** esquema `01-schema.sql` en `ejemplos/postgresql-scripts/` (tabla `tasks` con `owner_id`)

---

### 6. Relación muchos a muchos (N:M)

> "Una tarea puede tener varias etiquetas / Un producto puede pertenecer a varias categorías."

- **SQL:**
  ```sql
  CREATE TABLE task_tags (
    task_id BIGINT REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id  BIGINT REFERENCES tags(id)  ON DELETE CASCADE,
    PRIMARY KEY (task_id, tag_id)
  );
  ```
- **Symfony:**
  ```php
  #[ORM\ManyToMany(targetEntity: Tag::class)]
  #[ORM\JoinTable(name: 'task_tags')]
  private Collection $tags;
  ```
- **Spring Boot:**
  ```java
  @ManyToMany
  @JoinTable(name = "task_tags",
    joinColumns = @JoinColumn(name = "task_id"),
    inverseJoinColumns = @JoinColumn(name = "tag_id"))
  private List<Tag> tags = new ArrayList<>();
  ```
- **Referencia SQL:** `ejemplos/postgresql-scripts/01-schema.sql` y query many-to-many en `03-queries.sql`

---

### 7. Autenticación con JWT

> "Añade login. Solo los usuarios autenticados pueden crear o borrar."

- **Referencia completa:** `snippets/auth-jwt.md`
- **Symfony — pasos:**
  1. `composer require symfony/security-bundle lexik/jwt-authentication-bundle`
  2. `php bin/console make:user User` → entidad con email + password
  3. Configurar `security.yaml` (firewall `login` + `api`, `access_control`)
  4. `php bin/console lexik:jwt:generate-keypair`
- **Frontend — guardar y enviar el token:**
  ```js
  // Login
  const { token } = await api.post('/api/login', { email, password })
  localStorage.setItem('token', token)

  // Peticiones protegidas
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
  ```
- **Respuesta si no hay token:** 401 Unauthorized.
- **CORS:** asegurarse de que `allow_headers` incluye `Authorization`.

---

### 8. Búsqueda de texto libre

> "Implementa un buscador que filtre por nombre o descripción."

- **SQL:**
  ```sql
  -- Contiene (case-insensitive, solo PostgreSQL)
  WHERE title ILIKE '%palabra%'
  -- Con índice para textos largos (full-text search)
  WHERE to_tsvector('spanish', title || ' ' || description) @@ to_tsquery('palabra')
  ```
- **Symfony QueryBuilder:**
  ```php
  $qb->andWhere('t.title LIKE :q OR t.description LIKE :q')
     ->setParameter('q', '%'.$search.'%');
  ```
- **Spring Boot:** `findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String q, String q2)`
- **Frontend:** input con debounce que envía `?q=texto` a la API.
  ```js
  let debounceTimer
  function onSearch(q) {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => fetchAll({ q }), 300)
  }
  ```

---

### 9. Validaciones en frontend

> "El formulario no debe enviar datos inválidos al servidor."

- **Vue — Vuelidate o validación nativa:**
  ```vue
  <!-- HTML5 nativo (más rápido de implementar): -->
  <input v-model.trim="form.title" required minlength="3" maxlength="180" />
  <p v-if="errors.title">{{ errors.title }}</p>
  ```
- **React — Zod o validación nativa:**
  ```jsx
  function validate(form) {
    const errors = {}
    if (!form.title.trim()) errors.title = 'Requerido'
    if (form.title.length > 180) errors.title = 'Máximo 180 caracteres'
    return errors
  }
  ```
- **Referencia:** `snippets/validaciones.md`
- **Regla de oro:** validar en frontend **y** en backend. El frontend mejora UX; el backend es la fuente de verdad.

---

### 10. Estadísticas / dashboard básico

> "Muestra cuántas tareas hay por estado / cuántos productos por categoría."

- **SQL:**
  ```sql
  SELECT status, COUNT(*) AS total FROM tasks GROUP BY status ORDER BY total DESC;
  ```
- **Symfony:** query Builder con `groupBy` y `select('t.status, COUNT(t.id) as total')`.
- **Spring Boot:**
  ```java
  @Query("SELECT t.status, COUNT(t) FROM Task t GROUP BY t.status")
  List<Object[]> countByStatus();
  ```
- **Frontend — mostrar con barras simples:**
  ```vue
  <div v-for="stat in stats" :key="stat.status"
       :style="{ width: (stat.total / maxTotal * 100) + '%' }">
    {{ stat.status }}: {{ stat.total }}
  </div>
  ```
- **Referencia SQL:** `ejemplos/postgresql-scripts/03-queries.sql` (bloque `GROUP BY`)

---

### 11. Subida de archivos / imagen

> "Permite subir una imagen o documento asociado a la entidad."

- **Symfony:**
  ```php
  // En TaskType:
  ->add('file', FileType::class, ['required' => false])

  // En el controlador:
  $file = $form->get('file')->getData();
  if ($file) {
      $filename = uniqid().'.'.$file->guessExtension();
      $file->move($this->getParameter('uploads_dir'), $filename);
      $task->setFilename($filename);
  }
  ```
- **Frontend fetch multipart:**
  ```js
  const fd = new FormData()
  fd.append('title', form.title)
  fd.append('file', fileInput.files[0])
  fetch('/api/tasks', { method: 'POST', body: fd })
  // No poner Content-Type: el navegador lo pone solo con el boundary correcto
  ```

---

## ★★★ Nivel 3 — Menos probable pero posible

### 12. Roles y permisos

> "Los administradores pueden borrar; los usuarios normales solo pueden ver y crear."

- **Symfony:** `#[IsGranted('ROLE_ADMIN')]` en el método del controlador, o `access_control` en `security.yaml`.
- **Spring Boot:** `@PreAuthorize("hasRole('ADMIN')")` en el servicio o controlador.
- **Frontend:** guardar el rol en el token JWT (claim `roles`) y ocultar/mostrar botones según el rol.
  ```js
  const payload = JSON.parse(atob(token.split('.')[1]))
  const isAdmin = payload.roles?.includes('ROLE_ADMIN')
  ```

---

### 13. Historial / auditoría de cambios

> "Guarda un log cada vez que se cambie el estado de una entidad."

- **SQL (trigger):**
  ```sql
  CREATE TABLE task_status_log (
      id         BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      task_id    BIGINT NOT NULL,
      old_status VARCHAR(20),
      new_status VARCHAR(20) NOT NULL,
      changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE OR REPLACE FUNCTION log_task_status() RETURNS trigger LANGUAGE plpgsql AS $$
  BEGIN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      INSERT INTO task_status_log (task_id, old_status, new_status)
      VALUES (NEW.id, OLD.status, NEW.status);
    END IF;
    RETURN NEW;
  END;
  $$;

  CREATE TRIGGER trg_log_task_status
  AFTER UPDATE OF status ON tasks
  FOR EACH ROW EXECUTE FUNCTION log_task_status();
  ```
- **Referencia completa:** `ejemplos/postgresql-scripts/04-funciones.sql`
- **Alternativa desde la app:** guardar el log en el servicio/controlador antes o después de hacer `flush()`.

---

### 14. Exportar datos a CSV

> "Añade un botón para descargar el listado en CSV."

- **Symfony:**
  ```php
  #[Route('/api/tasks/export.csv', methods: ['GET'])]
  public function exportCsv(): Response
  {
      $tasks  = $this->tasks->findAll();
      $rows   = ["id,title,status,createdAt"];
      foreach ($tasks as $t) {
          $rows[] = "{$t->getId()},{$t->getTitle()},{$t->getStatus()},{$t->getCreatedAt()->format('Y-m-d')}";
      }
      return new Response(
          implode("\n", $rows),
          200,
          ['Content-Type' => 'text/csv', 'Content-Disposition' => 'attachment; filename="tasks.csv"']
      );
  }
  ```
- **Frontend:**
  ```js
  window.open('http://127.0.0.1:8000/api/tasks/export.csv')
  // O con Blob para no abrir nueva pestaña:
  const blob = new Blob([csvText], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = 'tasks.csv'; a.click()
  ```

---

### 15. Formulario multipaso (wizard)

> "El alta de la entidad tiene varios pasos: datos básicos → detalles → confirmación."

- **Vue — con ref de paso actual:**
  ```vue
  <script setup>
  const step = ref(1)
  const form = reactive({ title: '', description: '', status: 'pending', tags: [] })
  </script>
  <template>
    <StepBasico   v-if="step === 1" :form="form" @next="step = 2" />
    <StepDetalles v-if="step === 2" :form="form" @back="step = 1" @next="step = 3" />
    <StepConfirm  v-if="step === 3" :form="form" @back="step = 2" @submit="onSubmit" />
  </template>
  ```
- **React — con useState de paso:**
  ```jsx
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' })
  // Pasar setForm hacia abajo o usar Context
  ```
- El formulario completo se envía solo en el último paso.

---

### 16. Internacionalización (i18n)

> "La app tiene que funcionar en español e inglés."

- **Vue — vue-i18n:**
  ```js
  // messages.js
  export const es = { save: 'Guardar', pending: 'Pendiente' }
  export const en = { save: 'Save',    pending: 'Pending'   }
  // En template: {{ $t('save') }}
  ```
- **React — react-i18next:** misma idea con `useTranslation()` y archivos `public/locales/es/common.json`.
- **Symfony:** `translator.yaml` + archivos `translations/messages.es.yaml`.

---

## Resumen rápido por prioridad

| # | Desafío | Stack | Prioridad |
|---|---|---|---|
| 1 | CRUD API REST | Symfony / Spring Boot | ★★★★★ |
| 2 | CRUD con interfaz web | Twig / Vue / React | ★★★★★ |
| 3 | Filtrar y ordenar | Todos | ★★★★☆ |
| 4 | Paginación | Todos | ★★★★☆ |
| 5 | Relación 1:N | Doctrine / JPA + SQL | ★★★★☆ |
| 6 | Autenticación JWT | Symfony + Lexik | ★★★☆☆ |
| 7 | Búsqueda de texto | SQL + backend + frontend | ★★★☆☆ |
| 8 | Validaciones frontend | Vue / React | ★★★☆☆ |
| 9 | Estadísticas básicas | SQL GROUP BY + frontend | ★★★☆☆ |
| 10 | Relación N:M | Doctrine / JPA + SQL | ★★☆☆☆ |
| 11 | Subida de archivos | Symfony | ★★☆☆☆ |
| 12 | Roles y permisos | Symfony Security | ★★☆☆☆ |
| 13 | Historial / trigger | SQL PL/pgSQL | ★★☆☆☆ |
| 14 | Exportar CSV | Symfony / frontend | ★★☆☆☆ |
| 15 | Wizard multipaso | Vue / React | ★★☆☆☆ |
| 16 | i18n | Vue / React | ★☆☆☆☆ |

---

## Dominios más usados en pruebas bancarias / fintech

Si el enunciado usa un dominio distinto a tareas, los patrones son los mismos. Solo cambian los nombres de campos.

| Dominio | Entidades típicas | Campo diferencial |
|---|---|---|
| Banca / Fintech | Cuenta, Transacción, Cliente, Préstamo | `amount DECIMAL(15,2)`, `currency`, `iban` |
| Inmobiliario | Propiedad, Agente, Cliente, Visita | `price`, `surface`, `address`, `status` |
| E-commerce | Producto, Pedido, Línea de pedido, Cliente | `sku`, `stock`, `unitPrice`, `quantity` |
| RRHH | Empleado, Departamento, Puesto, Nómina | `salary`, `startDate`, `department` |
| Salud | Paciente, Cita, Médico, Diagnóstico | `appointmentDate`, `specialty`, `status` |

> Truco: cuando te den un dominio nuevo, pregúntate "¿tiene esto estados? ¿relaciones 1:N?"
> Si sí → mismos patrones del Task Manager.

---

## Qué sacar del repo según lo que pidan

| Lo que piden | Qué abrir primero |
|---|---|
| API REST desde cero | `integracion/step-by-step.md` § Fase 1–6 |
| Frontend Vue conectado a API | `integracion/step-by-step.md` § Fase 7 |
| Frontend React conectado a API | `integracion/step-by-step.md` § Fase 8 |
| CRUD HTML con Twig | `ejemplos/step-by-step.md` § 2 (symfony-crud) |
| Spring Boot API | `ejemplos/step-by-step.md` § 3 (springboot-crud) |
| SQL con relaciones | `ejemplos/step-by-step.md` § 1 (postgresql-scripts) |
| JWT | `snippets/auth-jwt.md` |
| Validaciones | `snippets/validaciones.md` |
| Paginación / filtros | `snippets/crud-completo.md` + `docs/.../00-cheatsheet.md` |
| Vue sin backend | `ejemplos/vue-app/` + `ejemplos/step-by-step.md` § 4 |
| React sin backend | `ejemplos/react-app/` + `ejemplos/step-by-step.md` § 5 |
