# Spring Boot — Cheatsheet

Versión de referencia: **Spring Boot 3.3** (Java 17+).

## Crear un proyecto

En [start.spring.io](https://start.spring.io) o con el CLI, si existe:

```bash
spring init --dependencies=web,data-jpa,postgresql,validation --java-version=17 --boot-version=3.3.5 task-api
```

Dependencias típicas: **Spring Web**, **Spring Data JPA**, **PostgreSQL Driver**, **Validation**.

## Arranque

```bash
mvn spring-boot:run
mvn -q -DskipTests package && java -jar target/*.jar
```

Puerto por defecto: **8080**.

## `application.properties`

```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/tasks
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

`ddl-auto=update` crea o altera tablas en desarrollo. En un entregable serio se usan migraciones (Flyway/Liquibase).

## Capas

```
src/main/java/com/example/tasks/
├── TasksApplication.java
├── controller/TaskController.java
├── service/TaskService.java
├── repository/TaskRepository.java
├── model/Task.java
└── dto/TaskRequest.java
```

## Anotaciones que hay que soltar de memoria

| Anotación | Dónde |
|---|---|
| `@SpringBootApplication` | clase main |
| `@RestController` `@RequestMapping` | API |
| `@Service` | lógica |
| `@Repository` | Spring Data (opcional si extiende `JpaRepository`) |
| `@Entity` `@Id` `@GeneratedValue` | JPA |
| `@Valid` | dispara Bean Validation en el body |

## Comandos Maven

```bash
mvn clean test
mvn dependency:tree
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

## Errores frecuentes

| Síntoma | Qué mirar |
|---|---|
| `Connection refused` a 5432 | PostgreSQL apagado o URL incorrecta |
| `Failed to determine a suitable driver class` | Falta dependencia `postgresql` o no hay `spring.datasource.url` |
| 400 en POST | JSON no coincide con el DTO o falta `Content-Type: application/json` |
| 404 | Falta `@RestController` o el context path no es `/` |
| Puerto en uso | Cambiar `server.port` |
