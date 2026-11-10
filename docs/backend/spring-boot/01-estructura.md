# Spring Boot — Estructura

## Árbol Maven

```
task-api/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/example/tasks/
    │   │   ├── TasksApplication.java
    │   │   ├── controller/
    │   │   ├── service/
    │   │   ├── repository/
    │   │   └── model/
    │   └── resources/
    │       └── application.properties
    └── test/java/...
```

El paquete de la clase con `@SpringBootApplication` es la raíz del escaneo. Todo lo que esté en ese paquete o en un subpaquete se detecta solo.

## Clase main

```java
package com.example.tasks;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TasksApplication {
    public static void main(String[] args) {
        SpringApplication.run(TasksApplication.class, args);
    }
}
```

## Responsabilidad de cada capa

| Capa | Hace | No hace |
|---|---|---|
| Controller | HTTP, códigos, DTO | SQL ni reglas largas |
| Service | reglas, transacciones | `HttpServletRequest` |
| Repository | persistencia | decidir códigos HTTP |
| Entity | mapeo tabla | validación de la petición mezclada con JSON público si el enunciado pide DTO |

## Inyección

Por constructor (preferida). Spring Boot 3 no exige `@Autowired` si hay un solo constructor.

```java
@Service
public class TaskService {
    private final TaskRepository tasks;

    public TaskService(TaskRepository tasks) {
        this.tasks = tasks;
    }
}
```

## Perfiles

`application-dev.properties` se activa con:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

o `spring.profiles.active=dev`.

## Logs

```properties
logging.level.org.hibernate.SQL=DEBUG
logging.level.com.example.tasks=DEBUG
```
