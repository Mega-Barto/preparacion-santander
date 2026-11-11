# PostgreSQL — Cheatsheet

## Cliente

Orden el día de la prueba: **pgAdmin** (si está en el menú) → **`psql`** → **Adminer** en `tools/` (navegador, opcional).

### pgAdmin

1. Abre pgAdmin 4 → registra servidor `127.0.0.1`, puerto `5432`, usuario/clave los que entren.
2. Clic derecho en Databases → Create → Database (`tasks`, etc.).
3. Tools → Query Tool → abre/pega `init.sql` y `seed.sql` **con la BD correcta seleccionada**.

### psql

```bash
psql --version
psql -U postgres -h 127.0.0.1 -p 5432 -d postgres
psql -U postgres -c "SELECT version();"
```

Dentro de `psql`:

| Comando | Acción |
|---|---|
| `\l` | bases de datos |
| `\c app` | cambiar de base |
| `\dt` | tablas |
| `\d tasks` | columnas, índices, FKs |
| `\du` | roles |
| `\q` | salir |
| `\i init.sql` | ejecutar un archivo |
| `\x` | salida expandida (una columna por línea) |

### Adminer (navegador)

Detalle: [tools/README.md](../../../tools/README.md).

```powershell
cd tools
php -S 127.0.0.1:8081 adminer-6.3.0.php
```

http://127.0.0.1:8081 — sistema PostgreSQL, servidor `127.0.0.1`, misma clave que `psql`. No lo pongas en `public/` de Symfony.

## Crear base y rol

```sql
CREATE USER app WITH PASSWORD 'app';
CREATE DATABASE tasks OWNER app;
GRANT ALL PRIVILEGES ON DATABASE tasks TO app;
```

En PostgreSQL 15+ también hace falta permiso sobre el esquema:

```sql
\c tasks
GRANT ALL ON SCHEMA public TO app;
```

## Arrancar / parar el servicio (Windows)

```powershell
Get-Service *postgres*
Start-Service postgresql-x64-16
```

El nombre exacto sale en `Get-Service`. Si no eres administrador, el servicio ya debería estar en ejecución en el equipo de la prueba.

## URL que usan los frameworks

```
postgresql://USUARIO:CLAVE@127.0.0.1:5432/NOMBRE_BD
jdbc:postgresql://localhost:5432/NOMBRE_BD
```

## Backup y restore

```bash
pg_dump -U postgres -d tasks -f tasks.sql
psql -U postgres -d tasks -f tasks.sql
```

## Extensión PHP

Symfony necesita `pdo_pgsql` habilitada en `php.ini`:

```ini
extension=pdo_pgsql
extension=pgsql
```

Comprobar: `php -m | findstr pgsql`
