# Symfony — Estructura de un proyecto

## Árbol

```
mi-proyecto/
├── bin/console              CLI
├── config/
│   ├── bundles.php          bundles activos
│   ├── services.yaml        inyección de dependencias
│   ├── routes.yaml
│   └── packages/            un YAML por bundle
├── migrations/
├── public/
│   └── index.php            único punto de entrada HTTP
├── src/
│   ├── Kernel.php
│   ├── Controller/
│   ├── Entity/
│   ├── Repository/
│   ├── Form/
│   └── Service/
├── templates/
├── var/                     caché y logs (no se versiona)
├── vendor/                  dependencias Composer
├── .env
├── .env.local               overrides locales (no commitear)
└── composer.json
```

## Flujo de una petición

1. El servidor web apunta a `public/`.
2. `public/index.php` arranca el `Kernel`.
3. El router busca una ruta (atributo `#[Route]` o YAML).
4. Se instancia el controlador. Symfony inyecta servicios por el constructor o por el argumento de la acción.
5. La acción devuelve un `Response`, un `JsonResponse` o un array (que se renderiza con Twig si hay `@Template`, o se serializa si la ruta es API).

## `services.yaml` (lo que importa)

```yaml
services:
    _defaults:
        autowire: true
        autoconfigure: true

    App\:
        resource: '../src/'
        exclude:
            - '../src/DependencyInjection/'
            - '../src/Entity/'
            - '../src/Kernel.php'
```

Cualquier clase bajo `src/` que no sea entidad se registra sola. El type-hint del constructor es suficiente para inyectarla.

## Entornos

| Variable | Uso |
|---|---|
| `APP_ENV=dev` | Barra de debug, errores detallados |
| `APP_ENV=prod` | Caché compilada, sin profiler |
| `APP_DEBUG=0` | Oculta stack traces |

## Convenciones de nombres

| Qué | Dónde | Ejemplo |
|---|---|---|
| Entidad | `src/Entity/Task.php` | clase `Task` |
| Repositorio | `src/Repository/TaskRepository.php` | `TaskRepository` |
| Controlador | `src/Controller/TaskController.php` | `TaskController` |
| Formulario | `src/Form/TaskType.php` | `TaskType` |
| Servicio | `src/Service/TaskManager.php` | nombre de la responsabilidad |

Namespace raíz: `App\`.
