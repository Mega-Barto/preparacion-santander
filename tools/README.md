# Tools

Utilidades opcionales para el puesto de la prueba. No forman parte de la API ni de los frontends.

## Adminer 6.3.0

Archivo: [adminer-6.3.0.php](adminer-6.3.0.php) (licencia Apache 2.0 / GPL del propio Adminer).

Cliente web de PostgreSQL (también MySQL/SQLite). Úsalo si no hay pgAdmin o prefieres el navegador. **Plan C**: el camino principal sigue siendo `psql` o pgAdmin del sistema.

### Arrancar (fuera del docroot de Symfony)

Desde la raíz del repo, en PowerShell:

```powershell
cd tools
php -S 127.0.0.1:8081 adminer-6.3.0.php
```

Abre http://127.0.0.1:8081

| Campo | Valor típico |
|---|---|
| Sistema | PostgreSQL |
| Servidor | `127.0.0.1` (o `127.0.0.1:5432`) |
| Usuario | el que entre con `psql` (`postgres` u otro) |
| Contraseña | la misma |
| Base de datos | vacía al entrar, o `tasks` / `symfony_crud` / … |

### Crear BD y cargar SQL

1. Entra sin elegir base (o elige `postgres`).
2. Crea la base (`tasks`, etc.) desde la UI o con SQL: `CREATE DATABASE tasks;`
3. Abre esa base → pestaña SQL → pega el contenido de `init.sql` y ejecuta; luego `seed.sql`.
4. Comprueba que las tablas y filas están ahí.

No copies este archivo a `public/` de Symfony ni a `integracion/backend/public/`: quedaría expuesto en el mismo puerto que la API.

### Puerto

**8081** por defecto en estos apuntes. Si Spring ya usa 8080, no choques: Adminer va en 8081. Si 8081 está ocupado:

```powershell
php -S 127.0.0.1:8082 adminer-6.3.0.php
```

### Si no arranca

- Sin PHP → no hay Adminer; usa `psql` o pgAdmin.
- Sin `pdo_pgsql` → Adminer puede fallar al conectar a Postgres; activa la extensión (ver `verificacion.md`).
- El puesto bloquea abrir PHP propio → vuelve a `psql`.
