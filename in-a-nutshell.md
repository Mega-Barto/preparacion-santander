# En pocas palabras

Referencia offline para la prueba técnica. Textos en español; código y rutas en inglés. Empieza por [verificacion.md](verificacion.md) en el puesto. Este archivo es el mapa mental de todo el repo.

## Qué hay

| Bloque | Para qué |
|---|---|
| `docs/` | Apuntes. El `00-cheatsheet.md` cabe en una pantalla; `01+` es detalle para copiar |
| `docs/marca/` | Press kit Home Elements: colores, tipografía y lineamientos |
| `ejemplos/` | Un mini-proyecto por tecnología, independientes |
| `integracion/` | Task Manager real: Symfony API + Vue + React + PostgreSQL |
| `snippets/` | Pegar: DB, fetch, CRUD, JWT, validaciones |
| `tools/` | Adminer (cliente Postgres en navegador); opcional, ver [tools/README.md](tools/README.md) |

## Stack de referencia

Symfony **6.4** (PHP 8.1+) · Spring Boot **3.3** (Java 17+) · PostgreSQL **14–16** · Vue **3** + Pinia + Router · React **18** + Context + Router · Vite · Maven

## Orden el día de la prueba

1. `verificacion.md` → versiones, `pdo_pgsql`, PostgreSQL, plan B.
2. Este archivo → dónde está cada cosa y puertos.
3. Cheatsheet de la tecnología del enunciado (`docs/.../00-cheatsheet.md`).
4. Ejemplo suelto o `integracion/` según lo que pidan.
5. `snippets/` cuando falte un trozo concreto (JWT, CORS, validación…).

## Puertos (no mezclar)

| Puerto | Quién |
|---|---|
| 8000 | Symfony (`ejemplos/symfony-crud` **o** `integracion/backend`, no los dos) |
| 8080 | Spring Boot |
| 5173 | Vue integración |
| 5174 | Vue ejemplo (sin API) |
| 5175 | React ejemplo (sin API) |
| 3000 | React integración |
| 5432 | PostgreSQL |
| 8081 | Adminer (`tools/`, opcional; no confundir con Spring en 8080) |

## Documentación (entrada rápida)

| Tech | Cheatsheet | Temas `01+` |
|---|---|---|
| Symfony | [00](docs/backend/symfony/00-cheatsheet.md) | estructura, rutas, Doctrine, forms, servicios, API REST |
| Spring | [00](docs/backend/spring-boot/00-cheatsheet.md) | estructura, REST, JPA, Security, Maven |
| PostgreSQL | [00](docs/database/postgresql/00-cheatsheet.md) | tipos, queries, relaciones, funciones |
| Vue | [00](docs/frontend/vue/00-cheatsheet.md) | Composition API, componentes, router, Pinia |
| React | [00](docs/frontend/react/00-cheatsheet.md) | hooks, componentes, router, Context |

## Ejemplos sueltos

| Carpeta | Idea | Levantar |
|---|---|---|
| `ejemplos/symfony-crud` | CRUD HTML + Doctrine + migraciones | `:8000` |
| `ejemplos/springboot-crud` | API REST + JPA | `:8080` → `GET /api/tasks` |
| `ejemplos/postgresql-scripts` | esquema, queries, función, trigger | solo `psql` |
| `ejemplos/vue-app` | todo-list Pinia, sin API | `:5174` |
| `ejemplos/react-app` | todo-list Context, sin API | `:5175` |

## Integración (el entregable modelo)

```
Vue :5173  ──┐
             ├──►  Symfony :8000 ──►  PostgreSQL :5432 (DB `tasks`)
React :3000 ─┘
```

```powershell
psql -U postgres -c "CREATE DATABASE tasks"
psql -U postgres -d tasks -f integracion/database/init.sql
psql -U postgres -d tasks -f integracion/database/seed.sql

cd integracion\backend   # composer install → php -S localhost:8000 -t public
cd integracion\frontend-vue   # npm i → npm run dev   → :5173
cd integracion\frontend-react # npm i → npm run dev   → :3000
```

Contrato: `GET/POST/PUT/DELETE /api/tasks` · `status` ∈ `pending` | `in_progress` | `done` · frontends leen `VITE_API_URL` (default `http://127.0.0.1:8000`).

## Comandos que se usan mil veces

```powershell
# Symfony
php bin/console make:entity Task
php bin/console make:migration
php bin/console doctrine:migrations:migrate
php bin/console debug:router
php -S localhost:8000 -t public

# Spring
mvn spring-boot:run
curl.exe http://127.0.0.1:8080/api/tasks

# Front
npm install
npm run dev

# PostgreSQL
psql -U postgres -h 127.0.0.1 -c "SELECT version();"
Get-Service *postgres*

# Adminer (opcional)
cd tools
php -S 127.0.0.1:8081 adminer-6.3.0.php
```

## Snippets

| Archivo | Cuándo |
|---|---|
| [conexion-db.md](snippets/conexion-db.md) | `DATABASE_URL` / `application.properties` |
| [fetch-axios.md](snippets/fetch-axios.md) | cliente HTTP y errores |
| [crud-completo.md](snippets/crud-completo.md) | los 4 verbos en Symfony, Vue y React |
| [auth-jwt.md](snippets/auth-jwt.md) | Lexik JWT + header `Authorization` |
| [validaciones.md](snippets/validaciones.md) | Assert, `@Valid`, Vuelidate, Zod |

## Memorízalo en 30 segundos

- **Symfony**: Maker + Doctrine + `.env` `DATABASE_URL` + Nelmio CORS si hay frontend.
- **Spring**: capas Controller → Service → Repository → Entity; `ddl-auto=update` en demo.
- **Vue**: `<script setup>`, `ref`/`reactive`, Pinia para estado, `:key` en listas.
- **React**: no mutar estado, `useEffect(..., [])` al montar, `key={id}`, Context en la integración.
- **Postgres**: sin servicio no hay persistencia; sin `pdo_pgsql` Symfony no conecta. Cliente: pgAdmin → `psql` → Adminer en `tools/`.
- **Sin red / sin backend**: enseña `vue-app` / `react-app` (JSON local) o scripts SQL.

## Plan B express

| Fallo | Salida |
|---|---|
| Sin Symfony CLI | `php -S localhost:8000 -t public` |
| `could not find driver` | activar `pdo_pgsql` en `php.ini` |
| Java 11 | apuntar `JAVA_HOME` a JDK 17+ |
| Puerto ocupado | Symfony 8001 · Vue `--port 5176` · React `--port 3001` · Spring `--server.port=8081` |
| Clave Postgres distinta | copiar la que sí entre a `.env` / `application.properties` |
| Sin pgAdmin / prefieres GUI | `tools/adminer-6.3.0.php` en `:8081` ([tools/README.md](tools/README.md)) |
| `npm install` sin red | copiar `src/` a un proyecto ya instalado en el puesto |
| Nada de backend | `ejemplos/vue-app`, `ejemplos/react-app`, `ejemplos/postgresql-scripts` |

Detalle de cada plan B: [verificacion.md](verificacion.md) §7.
