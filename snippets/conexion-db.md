# Conexión a PostgreSQL

Ajusta usuario, clave y nombre de base. El puerto por defecto es **5432**.

## Comprobar que el servidor responde

```powershell
psql -U postgres -h 127.0.0.1 -p 5432 -c "SELECT version();"
```

Crear la base:

```powershell
psql -U postgres -c "CREATE DATABASE tasks"
```

## Symfony (`.env` o `.env.local`)

```dotenv
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/tasks?serverVersion=16&charset=utf8"
```

Si la versión instalada no es 16, cambia `serverVersion`. Para verla: `SHOW server_version;` dentro de `psql`.

PHP tiene que tener la extensión:

```powershell
php -m | findstr pgsql
```

Tiene que aparecer `pdo_pgsql`. Si no, habilita `extension=pdo_pgsql` en el `php.ini` que usa el CLI (`php --ini`).

Probar desde el proyecto:

```powershell
php bin/console doctrine:query:sql "SELECT 1"
```

## Spring Boot (`application.properties`)

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tasks
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

`ddl-auto=update` crea la tabla a partir de la entidad. No hace falta un `CREATE TABLE` a mano.

## JDBC frente a URL de Symfony

| Framework | Formato |
|---|---|
| Symfony / Doctrine | `postgresql://usuario:clave@host:5432/base` |
| Spring | `jdbc:postgresql://host:5432/base` y usuario/clave aparte |

La clave con caracteres especiales (`@`, `#`, `%`) hay que escaparla en la URL. En Symfony usa codificación URL (`@` → `%40`). En Spring, si la clave va en `spring.datasource.password`, no hace falta escaparla.
