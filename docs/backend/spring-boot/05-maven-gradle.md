# Spring Boot — Maven (y Gradle)

## `pom.xml` mínimo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.5</version>
    </parent>
    <groupId>com.example</groupId>
    <artifactId>task-api</artifactId>
    <version>0.0.1</version>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

El `parent` ya trae versiones y el plugin de test. No hace falta declarar la versión de cada starter.

## Ciclo de vida

| Comando | Qué hace |
|---|---|
| `mvn compile` | compila `src/main` |
| `mvn test` | tests en `src/test` |
| `mvn package` | jar en `target/` |
| `mvn spring-boot:run` | arranca sin empaquetar |
| `mvn clean` | borra `target/` |

El plugin `spring-boot-maven-plugin` genera un jar ejecutable con las dependencias.

## Wrapper

Si el equipo no tiene `mvn` en el PATH pero el proyecto trae wrapper:

```bash
mvnw.cmd spring-boot:run
```

## Gradle equivalente

```bash
./gradlew bootRun
./gradlew test
```

`build.gradle`:

```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.3.5'
    id 'io.spring.dependency-management' version '1.1.6'
}
java { toolchain { languageVersion = JavaLanguageVersion.of(17) } }
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    runtimeOnly 'org.postgresql:postgresql'
}
```

Si el enunciado no dice Gradle, quédate en Maven: es lo que suele estar instalado junto a Spring en un puesto de prueba.

## Java en Windows

```powershell
java -version
echo $env:JAVA_HOME
where.exe java
```

Boot 3 no arranca con Java 11. Tiene que ser 17 o superior.
