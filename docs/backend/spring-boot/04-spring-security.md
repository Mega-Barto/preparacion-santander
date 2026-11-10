# Spring Boot — Security (lo mínimo)

Solo si el enunciado pide login. Para un CRUD abierto no añadas `spring-boot-starter-security`: desde Boot 3, al entrar en el classpath exige autenticación en todas las rutas.

## Dependencia

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

## Dejar una API abierta (desarrollo)

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }
}
```

CSRF se desactiva en APIs stateless. En formularios Thymeleaf se deja activo.

## Usuario en memoria

```java
@Bean
public UserDetailsService users(PasswordEncoder encoder) {
    UserDetails user = User.builder()
        .username("admin")
        .password(encoder.encode("admin"))
        .roles("ADMIN")
        .build();
    return new InMemoryUserDetailsManager(user);
}

@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

## Proteger solo escritura

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers(HttpMethod.GET, "/api/**").permitAll()
    .requestMatchers("/api/**").authenticated()
    .anyRequest().permitAll())
.httpBasic(Customizer.withDefaults())
```

El frontend manda `Authorization: Basic base64(user:pass)`.

## JWT (esquema, sin librería concreta)

1. `POST /api/login` valida usuario y devuelve un token firmado.
2. Un `OncePerRequestFilter` lee `Authorization: Bearer ...`.
3. Si el token es válido, coloca la autenticación en `SecurityContextHolder`.
4. El resto de la API exige `authenticated()`.

En Symfony el equivalente del repo está en `snippets/auth-jwt.md`. En Spring, si no recuerdas la librería (`jjwt` o `nimbus`), explica el filtro y el endpoint antes de pelearte con dependencias.

## Contraseñas

Nunca guardes la contraseña en claro. `BCryptPasswordEncoder` en el registro y `matches` en el login.

## Errores típicos

| Síntoma | Causa |
|---|---|
| 401 en todas las rutas | Entró Security y no hay `permitAll` ni usuario |
| 403 en POST | CSRF activo en una API JSON |
| Login correcto pero 401 | El cliente no envía `Authorization` |
