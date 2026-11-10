# CRUD Symfony + Doctrine + PostgreSQL

Formularios Twig, no API. La API equivalente está en `integracion/backend`.

## Requisitos

- PHP 8.1+ con `pdo_pgsql` (`php -m` debe listar `pdo_pgsql`)
- Composer 2
- PostgreSQL

## Base de datos

```powershell
psql -U postgres -c "CREATE DATABASE symfony_crud"
```

Si el usuario o la clave no son `postgres` / `postgres`, copia `.env` a `.env.local` y cambia `DATABASE_URL`.

## Arrancar

```powershell
cd ejemplos/symfony-crud
composer install
php bin/console doctrine:migrations:migrate --no-interaction
php bin/console cache:clear
symfony server:start
```

Sin Symfony CLI:

```powershell
php -S localhost:8000 -t public
```

Abre `http://127.0.0.1:8000/tasks`.

## Plan B si las migraciones fallan

```powershell
psql -U postgres -d symfony_crud -f database/init.sql
```

## Qué mirar en el código

| Pieza | Archivo |
|---|---|
| Entidad | `src/Entity/Task.php` |
| Repositorio | `src/Repository/TaskRepository.php` |
| Formulario | `src/Form/TaskType.php` |
| Controlador | `src/Controller/TaskController.php` |
| Migración | `migrations/Version20241110000000.php` |
| Vistas | `templates/task/` |
