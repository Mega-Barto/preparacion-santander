# CRUD Spring Boot + JPA

API REST de tareas. Hibernate crea o actualiza la tabla al arrancar (`ddl-auto=update`). No incluye frontend.

## Requisitos

- Java 17 o superior
- Maven 3.8+
- PostgreSQL en `localhost:5432`

## Base de datos

```powershell
psql -U postgres -c "CREATE DATABASE springboot_crud"
```

Si tu usuario o clave no son `postgres` / `postgres`, edita `src/main/resources/application.properties`.

## Arrancar

```powershell
cd ejemplos/springboot-crud
mvn spring-boot:run
```

La API queda en `http://127.0.0.1:8080`.

```powershell
curl http://127.0.0.1:8080/api/tasks
curl -X POST http://127.0.0.1:8080/api/tasks -H "Content-Type: application/json" -d "{\"title\":\"Repasar JPA\",\"status\":\"pending\"}"
```

## Endpoints

| Método | Ruta | Código |
|---|---|---|
| GET | `/api/tasks` | 200 |
| GET | `/api/tasks/{id}` | 200 o 404 |
| POST | `/api/tasks` | 201 |
| PUT | `/api/tasks/{id}` | 200 |
| DELETE | `/api/tasks/{id}` | 204 |

## Qué mirar en el código

| Pieza | Archivo |
|---|---|
| Arranque | `TasksApplication.java` |
| Entidad | `model/Task.java` |
| Repositorio | `repository/TaskRepository.java` |
| Reglas | `service/TaskService.java` |
| HTTP | `controller/TaskController.java` |
| Errores | `controller/ApiExceptionHandler.java` |
