# JWT con Symfony (Lexik) y el frontend

Solo si el enunciado pide login. El Task Manager de `integracion/` es público a propósito.

## Paquetes

```bash
composer require symfony/security-bundle
composer require lexik/jwt-authentication-bundle
php bin/console lexik:jwt:generate-keypair
```

Eso crea `config/jwt/private.pem` y `public.pem`. No los subas a un repo público. En la prueba basta con que existan en el proyecto.

`.env`:

```dotenv
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=frase_local
```

## `config/packages/lexik_jwt_authentication.yaml`

```yaml
lexik_jwt_authentication:
    secret_key: '%env(resolve:JWT_SECRET_KEY)%'
    public_key: '%env(resolve:JWT_PUBLIC_KEY)%'
    pass_phrase: '%env(JWT_PASSPHRASE)%'
    token_ttl: 3600
```

## `config/packages/security.yaml` (recorte)

```yaml
security:
    password_hashers:
        App\Entity\User: bcrypt
    providers:
        app_user_provider:
            entity:
                class: App\Entity\User
                property: email
    firewalls:
        login:
            pattern: ^/api/login
            stateless: true
            json_login:
                check_path: /api/login
                username_path: email
                password_path: password
                success_handler: lexik_jwt_authentication.handler.authentication_success
                failure_handler: lexik_jwt_authentication.handler.authentication_failure
        api:
            pattern: ^/api
            stateless: true
            jwt: ~
        dev:
            pattern: ^/(_(profiler|wdt)|css|images|js)/
            security: false
        main:
            lazy: true
            provider: app_user_provider
    access_control:
        - { path: ^/api/login, roles: PUBLIC_ACCESS }
        - { path: ^/api, roles: IS_AUTHENTICATED_FULLY }
```

`POST /api/login` con cuerpo `{"email":"...","password":"..."}` responde `{"token":"..."}`.

La entidad `User` tiene que implementar `UserInterface` y `PasswordAuthenticatedUserInterface`. Generarla:

```bash
php bin/console make:user User
```

## Frontend

Guardar el token y mandarlo en cada petición que no sea el login:

```javascript
localStorage.setItem('token', data.token)

fetch('http://127.0.0.1:8000/api/tasks', {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})
```

Un 401 significa token ausente, caducado o firma inválida. Revisa que la cabecera se llame exactamente `Authorization` y que el valor empiece por `Bearer `.

## CORS

`allow_headers` tiene que incluir `Authorization` y `Content-Type`. En este repo ya está así en `integracion/backend/config/packages/nelmio_cors.yaml`.
