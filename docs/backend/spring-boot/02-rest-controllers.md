# Spring Boot — REST controllers

```java
package com.example.tasks.controller;

import com.example.tasks.model.Task;
import com.example.tasks.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class TaskController {

    private final TaskService tasks;

    public TaskController(TaskService tasks) {
        this.tasks = tasks;
    }

    @GetMapping
    public List<Task> list() {
        return tasks.findAll();
    }

    @GetMapping("/{id}")
    public Task show(@PathVariable Long id) {
        return tasks.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task create(@Valid @RequestBody Task task) {
        return tasks.create(task);
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @Valid @RequestBody Task task) {
        return tasks.update(id, task);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        tasks.delete(id);
    }
}
```

## Mapeo HTTP

| Anotación | Verbo |
|---|---|
| `@GetMapping` | GET |
| `@PostMapping` | POST |
| `@PutMapping` | PUT |
| `@PatchMapping` | PATCH |
| `@DeleteMapping` | DELETE |

## De dónde sale cada dato

| Anotación | Origen |
|---|---|
| `@PathVariable` | `/tasks/{id}` |
| `@RequestParam` | `?status=pending` |
| `@RequestBody` | JSON |
| `@RequestHeader` | cabecera |

## Errores con una sola clase

```java
@ResponseStatus(HttpStatus.NOT_FOUND)
public class TaskNotFoundException extends RuntimeException {
    public TaskNotFoundException(Long id) {
        super("Task not found: " + id);
    }
}
```

```java
@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(TaskNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> notFound(TaskNotFoundException ex) {
        return Map.of("error", ex.getMessage());
    }
}
```

## CORS

`@CrossOrigin` en el controlador vale para un ejercicio. Para toda la API:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173", "http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
}
```

## Validación del body

```java
public class TaskRequest {
    @NotBlank
    @Size(max = 180)
    private String title;
    private String description;
    @Pattern(regexp = "pending|in_progress|done")
    private String status;
    // getters y setters
}
```

El parámetro del controller lleva `@Valid`.
