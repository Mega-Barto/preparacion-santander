# PostgreSQL — Consultas

## Filtros

```sql
SELECT id, title, status, created_at
FROM tasks
WHERE status = 'pending'
  AND title ILIKE '%doctrine%'
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;
```

`ILIKE` ignora mayúsculas. `LIKE` no.

## JOIN

```sql
SELECT t.id, t.title, u.email
FROM tasks t
INNER JOIN users u ON u.id = t.owner_id
WHERE u.email = 'ana@example.com';
```

| Join | Filas que conserva |
|---|---|
| `INNER JOIN` | solo coincidencias |
| `LEFT JOIN` | todas las de la izquierda, NULL si no hay match |
| `RIGHT JOIN` | todas las de la derecha |

Tareas sin responsable:

```sql
SELECT t.*
FROM tasks t
LEFT JOIN users u ON u.id = t.owner_id
WHERE u.id IS NULL;
```

## Agregados

```sql
SELECT status, COUNT(*) AS total
FROM tasks
GROUP BY status
HAVING COUNT(*) > 1
ORDER BY total DESC;
```

`WHERE` filtra filas antes de agrupar. `HAVING` filtra grupos.

## Fechas

```sql
SELECT *
FROM tasks
WHERE created_at >= NOW() - INTERVAL '7 days';

SELECT date_trunc('day', created_at) AS day, COUNT(*)
FROM tasks
GROUP BY 1
ORDER BY 1;
```

## Subconsulta y EXISTS

```sql
SELECT *
FROM users u
WHERE EXISTS (
    SELECT 1 FROM tasks t WHERE t.owner_id = u.id AND t.status = 'pending'
);
```

## Insert, update, delete

```sql
INSERT INTO tasks (title, description, status)
VALUES ('Repasar JOIN', 'Incluye LEFT JOIN', 'pending')
RETURNING id, created_at;

UPDATE tasks
SET status = 'done'
WHERE id = 1
RETURNING *;

DELETE FROM tasks
WHERE status = 'done' AND created_at < NOW() - INTERVAL '1 year';
```

`RETURNING` evita un segundo `SELECT`.

## UPSERT

```sql
INSERT INTO tasks (id, title, status)
VALUES (1, 'Actualizada', 'in_progress')
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    status = EXCLUDED.status;
```

## NULL

`NULL = NULL` no es verdadero. Usa `IS NULL` / `IS NOT NULL`.

`COUNT(*)` cuenta filas. `COUNT(description)` no cuenta los NULL.
