# Task Manager — Symfony + Vue y Symfony + React

Un solo backend. Cada frontend es un proyecto aparte y habla con la misma API.

```
navegador :5173  Vue   --\
                          -->  Symfony :8000  -->  PostgreSQL :5432  base tasks
navegador :3000  React --/
```

No hace falta levantar los dos frontends a la vez.

## 1. Base de datos

Con `psql`:

```powershell
psql -U postgres -c "CREATE DATABASE tasks"
psql -U postgres -d tasks -f database/init.sql
psql -U postgres -d tasks -f database/seed.sql
```

Con **pgAdmin** (si está instalado): crea la BD `tasks`, abre Query Tool sobre esa base y ejecuta `database/init.sql` y luego `database/seed.sql`.

Con **Adminer** (navegador, opcional): desde la raíz del repo, `cd tools` y `php -S 127.0.0.1:8081 adminer-6.3.0.php` → http://127.0.0.1:8081. Detalle en [tools/README.md](../tools/README.md).

Si usuario o clave no son `postgres` / `postgres`, edita `backend/.env.local` (créalo a partir de `.env`).

## 2. API

```powershell
cd backend
composer install
symfony server:start --port=8000
```

Sin Symfony CLI:

```powershell
php -S localhost:8000 -t public
```

Comprueba:

```powershell
curl http://127.0.0.1:8000/api/tasks
```

Tienen que salir las 5 tareas del seed.

## 3. Frontend Vue

```powershell
cd frontend-vue
npm install
npm run dev
```

http://127.0.0.1:5173

## 4. Frontend React

```powershell
cd frontend-react
npm install
npm run dev
```

http://127.0.0.1:3000

## Contrato de la API

| Método | Ruta | Cuerpo | Respuesta |
|---|---|---|---|
| GET | `/api/tasks` | — | 200, array |
| GET | `/api/tasks/{id}` | — | 200 o 404 |
| POST | `/api/tasks` | `{ "title", "description", "status" }` | 201 |
| PUT | `/api/tasks/{id}` | mismos campos | 200 |
| DELETE | `/api/tasks/{id}` | — | 204 vacío |

`status` solo admite `pending`, `in_progress` o `done`.

La URL base se cambia sin tocar el código:

- Vue y React leen `VITE_API_URL` (hay un `.env.example` en cada frontend).
- Por defecto es `http://127.0.0.1:8000`.

## Estilos (marca)

Ambos frontends usan la identidad visual de Home Elements (tipografía Ubuntu, tokens de color del press kit). Detalle de tokens, clases y criterios de edición: [css.md](css.md).
