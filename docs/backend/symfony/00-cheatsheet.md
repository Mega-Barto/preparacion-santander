# Symfony — Cheatsheet

Versión de referencia: **Symfony 6.4 LTS** (PHP 8.1+).

## Crear un proyecto

```bash
# Proyecto web completo (Twig, Doctrine, etc. se añaden después)
symfony new mi-proyecto --version=6.4

# Solo API / micro (skeleton mínimo)
composer create-project symfony/skeleton:"6.4.*" mi-api

cd mi-proyecto
symfony check:requirements
```

Si no hay Symfony CLI:

```bash
composer create-project symfony/skeleton:"6.4.*" mi-proyecto
php -S localhost:8000 -t public
```

## Paquetes que se piden casi siempre

```bash
composer require symfony/orm-pack
composer require symfony/maker-bundle --dev
composer require symfony/form symfony/validator
composer require symfony/twig-bundle
composer require nelmio/cors-bundle
composer require symfony/serializer-pack
```

## Maker (generar código)

```bash
php bin/console make:entity Task
php bin/console make:controller TaskController
php bin/console make:form TaskType
php bin/console make:migration
php bin/console make:crud Task
php bin/console make:user
php bin/console debug:router
php bin/console debug:container
php bin/console debug:autowiring
```

## Base de datos

```bash
php bin/console doctrine:database:create
php bin/console make:migration
php bin/console doctrine:migrations:migrate
php bin/console doctrine:schema:update --dump-sql
php bin/console doctrine:schema:validate
```

## Servidor

```bash
symfony server:start          # https://127.0.0.1:8000
symfony server:stop
php -S localhost:8000 -t public
```

## Variables de entorno

Archivo `.env` (nunca subir secretos reales; usar `.env.local`):

```dotenv
APP_ENV=dev
APP_SECRET=cambia_esto
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/app?serverVersion=16&charset=utf8"
```

## Estructura mínima que hay que recordar

```
config/packages/     configuración por bundle
config/routes.yaml   rutas YAML (o atributos en el controlador)
src/Controller/      controladores
src/Entity/          entidades Doctrine
src/Repository/
src/Form/
src/Service/         clases propias (autowire automático)
templates/           Twig
public/              punto de entrada (index.php) y assets
migrations/
```

## Errores frecuentes

| Síntoma | Causa habitual |
|---|---|
| `Class not found` | Falta `composer dump-autoload` o el namespace no es `App\` |
| 404 en ruta nueva | Caché: `php bin/console cache:clear` |
| `could not find driver` | Falta extensión `pdo_pgsql` en `php.ini` |
| CORS en el navegador | Falta Nelmio CORS o el origen del frontend no está permitido |
| Cambios en `.env` no aplican | Hay `.env.local` que los pisa, o caché de prod |
