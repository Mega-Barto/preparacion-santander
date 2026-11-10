# Verificación del equipo

Ábrelo antes que el resto. Sirve para saber qué hay instalado en el portátil de la prueba y cómo leer este repositorio sin conexión a una IA.

Anota en un papel la versión que responda cada comando. Si uno falla, pasa al plan B de esa herramienta y no bloquees las demás.

## 1. Versiones instaladas

Ejecuta esto en PowerShell, en cualquier carpeta:

```powershell
php -v
composer -V
symfony version
java -version
mvn -v
node -v
npm -v
psql --version
```

| Herramienta | Salida razonable | Si no está |
|---|---|---|
| PHP | 8.1, 8.2 o 8.3 | No podrás levantar Symfony. Revisa el plan B |
| Composer | 2.x | Symfony se puede haber creado ya; sin Composer no instalas paquetes |
| Symfony CLI | cualquier versión reciente | Sustituto: `php -S localhost:8000 -t public` |
| Java | 17 o 21 | Spring Boot 3 no arranca con 11 |
| Maven | 3.8+ | Busca `mvnw.cmd` dentro del proyecto |
| Node.js | 18 o 20 | Sin Node no hay Vue ni React |
| npm | 9 o 10 | Viene con Node. Si falta, reinstalar Node |
| psql | PostgreSQL 14, 15 o 16 | La base puede estar instalada y el cliente no estar en el PATH |

Extensiones PHP que Symfony + PostgreSQL necesitan:

```powershell
php -m | findstr /I "pdo pgsql ctype iconv mbstring openssl"
php --ini
```

Tiene que salir `pdo_pgsql`. `php --ini` dice qué archivo editar si falta.

Dónde está cada binario:

```powershell
where.exe php
where.exe composer
where.exe java
where.exe mvn
where.exe node
where.exe npm
where.exe psql
```

`JAVA_HOME` (Spring a veces lo exige):

```powershell
echo $env:JAVA_HOME
```

Tiene que apuntar a un JDK 17+, no a un JRE suelto ni a Java 11.

## 2. Cómo leer la documentación de este repositorio

Los apuntes son Markdown. No hace falta un servidor.

**Visual Studio Code o Cursor**, si el puesto lo tiene:

```powershell
cd ruta\de\este\repositorio
code .
```

Abre `README.md`. Los enlaces relativos saltan al archivo.

**Bloc de notas**, si no hay editor: los `.md` se leen igual. Empieza por este archivo y por `docs/backend/symfony/00-cheatsheet.md`.

**Navegador**, solo si hay Python:

```powershell
python --version
python -m http.server 8080
```

Entra en `http://127.0.0.1:8080/`. El navegador muestra el listado de carpetas. No renderiza Markdown: verás el texto con las marcas `#`. Es suficiente para buscar un comando. Para la vista con títulos, usa el editor.

Si `python` no existe, prueba `py -m http.server 8080`.

No dependas de internet para estos apuntes. Ya están en la carpeta.

## 3. PostgreSQL

```powershell
Get-Service *postgres*
psql -U postgres -h 127.0.0.1 -c "SELECT version();"
```

Si pide contraseña y no la sabes, prueba en este orden: vacía (pulsa Enter), `postgres`, `admin`, la clave que te hayan dado en el enunciado.

Usuario distinto:

```powershell
psql -U TU_USUARIO -h 127.0.0.1 -d postgres -c "SELECT current_user;"
```

Sin contraseña en local, a veces funciona el usuario de Windows con peer/trust. Si `psql` dice que no te reconoce, crea la URL con el usuario que sí entre y úsala en `.env` o en `application.properties`.

Crear una base de prueba y borrarla:

```powershell
psql -U postgres -c "CREATE DATABASE prueba_conexion"
psql -U postgres -c "DROP DATABASE prueba_conexion"
```

El servicio apagado:

```powershell
Get-Service *postgres*
Start-Service postgresql-x64-16
```

El nombre exacto es el que haya impreso `Get-Service`. `Start-Service` puede pedir consola de administrador. Si no puedes arrancarlo, pregunta al vigilante: sin el servicio no hay persistencia, pero sí puedes enseñar el frontend con los ejemplos que leen `tasks.json`.

## 4. Symfony puede crear un proyecto

```powershell
php -v
php -m | findstr pgsql
symfony check:requirements
```

`check:requirements` tiene que marcar PHP y las extensiones en verde. Los avisos de `intl` o `apcu` no impiden un CRUD.

No hace falta crear un proyecto vacío si vas a usar `ejemplos/symfony-crud` o `integracion/backend`. Si quieres confirmar Composer:

```powershell
cd $env:TEMP
composer create-project symfony/skeleton:"6.4.*" symfony-probe --no-interaction
cd symfony-probe
php -S localhost:8000 -t public
```

Abre `http://127.0.0.1:8000`. Tiene que responder la página de bienvenida de Symfony. Luego para el servidor con Ctrl+C. No pierdas más de unos minutos en esto: si `ejemplos/symfony-crud` ya arranca, el probe sobra.

## 5. Node puede instalar

```powershell
node -v
npm -v
node -e "console.log('ok')"
```

Tiene que imprimir `ok`.

Dentro de un ejemplo, la prueba real es instalar y levantar:

```powershell
cd ejemplos\vue-app
npm install
npm run dev
```

Si `npm install` falla por red, no reinsistas en bucle. Pregunta si hay proxy o caché (`npm config get registry`). Los ejemplos ya traen el código; sin `node_modules` no arrancan, pero el fuente se puede leer y copiar a un proyecto que el puesto ya tenga instalado.

Comprobar que Vite se puede invocar sin instalarlo a nivel global:

```powershell
npx vite --version
```

No hace falta `npm install -g @vue/cli` ni Create React App. Este repositorio usa Vite.

## 6. Spring Boot arranca

Con la base creada (`CREATE DATABASE springboot_crud`) y usuario `postgres` / clave `postgres`:

```powershell
cd ejemplos\springboot-crud
mvn spring-boot:run
```

Cuando veas `Tomcat started on port 8080`:

```powershell
curl.exe http://127.0.0.1:8080/api/tasks
```

Una lista vacía `[]` es un éxito. Ctrl+C para parar.

Si Maven baja medio internet la primera vez, es normal: el puesto necesita acceso a Maven Central. Si no hay red y no hay `~/.m2` con los jars, Spring no va a arrancar. En ese caso enseña el código y, si puedes, Symfony.

## 7. Plan B

### `php` no se reconoce

El instalador no añadió la carpeta al PATH de esta consola.

```powershell
Get-ChildItem C:\php, C:\xampp\php, C:\tools\php -ErrorAction SilentlyContinue
```

Si aparece `php.exe`, abre la consola así:

```powershell
$env:Path = "C:\ruta\donde\esta\php;" + $env:Path
php -v
```

Eso solo dura en esa ventana. Repítelo en cada terminal nueva o copia el `php.exe` que hayas encontrado.

### `could not find driver`

Falta `pdo_pgsql`, no falta PostgreSQL. `php --ini`, edita ese `php.ini`, quita el `;` de `extension=pdo_pgsql` y abre otra terminal.

### `symfony` no se reconoce

No lo necesitas. En la carpeta del proyecto:

```powershell
php -S localhost:8000 -t public
```

Las migraciones siguen siendo `php bin/console doctrine:migrations:migrate`.

### `java` es 11 o no existe, pero hay otro JDK

```powershell
Get-ChildItem "C:\Program Files\Java", "C:\Program Files\Eclipse Adoptium" -ErrorAction SilentlyContinue
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path
java -version
```

### `mvn` no se reconoce

Busca un wrapper o un Maven descomprimido:

```powershell
where.exe /R C:\ mvn.cmd
```

Puede tardar. Si lo encuentras, añade su carpeta `bin` al PATH de la misma forma que con PHP.

### El puerto ya está ocupado

Síntoma: `Address already in use`.

| Quién | Qué hacer |
|---|---|
| Symfony | `php -S localhost:8001 -t public` y cambia `VITE_API_URL` |
| Vue (5173) | `npm run dev -- --port 5176` |
| React (3000) | `npm run dev -- --port 3001` |
| Spring (8080) | `mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081` |

El frontend y el backend tienen que usar el puerto en el que el otro está de verdad. CORS en este repo ya acepta cualquier puerto de `localhost`.

### PostgreSQL rechaza la clave

No insistas con `postgres/postgres` si el puesto usa otra. Cuando `psql` entre, copia ese usuario y esa clave a:

- `integracion/backend/.env` → `DATABASE_URL`
- `ejemplos/symfony-crud/.env` → `DATABASE_URL`
- `ejemplos/springboot-crud/src/main/resources/application.properties`

### `npm install` no tiene red

Lee el fuente y copia los archivos a un proyecto que ya exista en el equipo (`package.json` con `vue` o `react` ya instalados). La estructura de `src/` de los ejemplos está pensada para eso.

### Nada de backend arranca

Puedes seguir con `ejemplos/vue-app` y `ejemplos/react-app`: no usan base de datos. Y con `ejemplos/postgresql-scripts` si solo `psql` funciona.
