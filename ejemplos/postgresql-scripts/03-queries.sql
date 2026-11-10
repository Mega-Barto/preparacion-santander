-- Consultas de referencia. No modifican datos, salvo el bloque final,
-- que está comentado.

-- Filtro, orden y paginación
SELECT id, title, status, created_at
FROM tasks
WHERE status = 'pending'
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;

-- Búsqueda sin distinguir mayúsculas
SELECT id, title
FROM tasks
WHERE title ILIKE '%join%';

-- INNER JOIN: solo tareas que tienen responsable
SELECT t.id, t.title, u.email
FROM tasks t
INNER JOIN users u ON u.id = t.owner_id;

-- LEFT JOIN: incluye tareas sin responsable (owner_id NULL)
SELECT t.id, t.title, u.email
FROM tasks t
LEFT JOIN users u ON u.id = t.owner_id;

-- Tareas sin responsable
SELECT t.id, t.title
FROM tasks t
LEFT JOIN users u ON u.id = t.owner_id
WHERE u.id IS NULL;

-- Many-to-many
SELECT t.title, tg.name AS tag
FROM tasks t
INNER JOIN task_tags tt ON tt.task_id = t.id
INNER JOIN tags tg ON tg.id = tt.tag_id
ORDER BY t.title, tg.name;

-- Agregado
SELECT status, COUNT(*) AS total
FROM tasks
GROUP BY status
ORDER BY total DESC;

-- Usuarios con alguna tarea pendiente
SELECT u.name
FROM users u
WHERE EXISTS (
    SELECT 1
    FROM tasks t
    WHERE t.owner_id = u.id
      AND t.status = 'pending'
);

-- Últimos 7 días (el seed usa now(), así que deberían salir)
SELECT id, title
FROM tasks
WHERE created_at >= NOW() - INTERVAL '7 days';

-- UPDATE y DELETE de ejemplo. Quita el comentario solo si quieres mutar el seed.
-- BEGIN;
-- UPDATE tasks SET status = 'done' WHERE id = 1 RETURNING id, status;
-- DELETE FROM tasks WHERE id = 4 RETURNING id;
-- ROLLBACK;
