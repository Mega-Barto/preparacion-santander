# Referencia para la prueba técnica

Material para consultar sin IA: apuntes cortos, un ejemplo por tecnología y un Task Manager con la misma API Symfony consumida por Vue y por React.

Empieza por [verificacion.md](verificacion.md). Ahí está cómo comprobar que PHP, Java, Node y PostgreSQL responden en el equipo, y cómo abrir estos Markdown.

Mapa de todo el repo en una sola lectura: [in-a-nutshell.md](in-a-nutshell.md).

Los textos están en español. Los nombres de clases, variables y rutas están en inglés.

Identidad de marca (Home Elements): [docs/marca/press-kit.md](docs/marca/press-kit.md).

## Documentación

| Tecnología | Entrada |
|---|---|
| Symfony 6.4 | [docs/backend/symfony/00-cheatsheet.md](docs/backend/symfony/00-cheatsheet.md) |
| Spring Boot 3 | [docs/backend/spring-boot/00-cheatsheet.md](docs/backend/spring-boot/00-cheatsheet.md) |
| PostgreSQL | [docs/database/postgresql/00-cheatsheet.md](docs/database/postgresql/00-cheatsheet.md) |
| Vue 3 | [docs/frontend/vue/00-cheatsheet.md](docs/frontend/vue/00-cheatsheet.md) |
| React 18 | [docs/frontend/react/00-cheatsheet.md](docs/frontend/react/00-cheatsheet.md) |

Cada carpeta sigue el orden `00`, `01`, `02`… El `00` cabe en una pantalla. El resto es el detalle para copiar.

## Ejemplos sueltos

No dependen unos de otros.

| Carpeta | Qué es | Cómo se levanta |
|---|---|---|
| [ejemplos/symfony-crud](ejemplos/symfony-crud/README.md) | CRUD HTML con formularios, Doctrine y migraciones | puerto 8000 |
| [ejemplos/springboot-crud](ejemplos/springboot-crud/README.md) | API REST con JPA | puerto 8080 |
| [ejemplos/postgresql-scripts](ejemplos/postgresql-scripts/README.md) | Esquema, consultas, función y trigger | solo `psql` |
| [ejemplos/vue-app](ejemplos/vue-app/README.md) | Todo-list con Pinia, sin API | puerto 5174 |
| [ejemplos/react-app](ejemplos/react-app/README.md) | Todo-list con Context, sin API | puerto 5175 |

## Integración

[integracion/README.md](integracion/README.md)

Un backend Symfony en el **8000**. Vue en el **5173** y React en el **3000**. Los dos frontends llaman a `GET/POST/PUT/DELETE /api/tasks`. La base se crea con `integracion/database/init.sql` y `seed.sql`.

No uses los tres servidores Symfony a la vez (`ejemplos/symfony-crud` y `integracion/backend` quieren el 8000).

## Snippets

| Archivo | Para qué |
|---|---|
| [snippets/conexion-db.md](snippets/conexion-db.md) | `DATABASE_URL` y `application.properties` |
| [snippets/fetch-axios.md](snippets/fetch-axios.md) | Cliente HTTP y errores |
| [snippets/crud-completo.md](snippets/crud-completo.md) | Los cuatro verbos en Symfony, Vue y React |
| [snippets/auth-jwt.md](snippets/auth-jwt.md) | Lexik JWT y cabecera `Authorization` |
| [snippets/validaciones.md](snippets/validaciones.md) | Assert, `@Valid`, Vuelidate y Zod |

## Puertos

| Servicio | Puerto |
|---|---|
| Symfony (ejemplo o integración) | 8000 |
| Spring Boot | 8080 |
| Vue de la integración | 5173 |
| Vue de ejemplo | 5174 |
| React de ejemplo | 5175 |
| React de la integración | 3000 |
| PostgreSQL | 5432 |
