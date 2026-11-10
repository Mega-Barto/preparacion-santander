-- Datos de ejemplo. Ejecutar después de 01-schema.sql.

INSERT INTO users (email, name) VALUES
    ('ana@example.com', 'Ana Ruiz'),
    ('luis@example.com', 'Luis Gómez');

INSERT INTO tags (name) VALUES ('sql'), ('symfony'), ('repaso');

INSERT INTO tasks (title, description, status, owner_id) VALUES
    ('Repasar JOIN', 'INNER y LEFT JOIN con usuarios', 'pending', 1),
    ('Crear índice por estado', 'idx_tasks_status', 'in_progress', 1),
    ('Probar CASCADE', 'Borrar un tag y ver task_tags', 'pending', 2),
    ('Cerrar tareas viejas', NULL, 'done', 2),
    ('Documentar CHECK', 'status solo admite tres valores', 'pending', NULL);

INSERT INTO task_tags (task_id, tag_id) VALUES
    (1, 1),
    (2, 1),
    (5, 3);
