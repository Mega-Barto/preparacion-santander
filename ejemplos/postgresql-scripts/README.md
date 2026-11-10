# Scripts SQL de referencia

Dominio de tareas, el mismo que el resto del repositorio. Son scripts comentados para consultar y para ejecutar a mano. No dependen de Symfony ni de Spring.

## Requisitos

PostgreSQL en marcha y el cliente `psql` en el PATH.

## Ejecutar

```powershell
psql -U postgres -c "CREATE DATABASE tasks_demo"
psql -U postgres -d tasks_demo -f 01-schema.sql
psql -U postgres -d tasks_demo -f 02-seed.sql
psql -U postgres -d tasks_demo -f 03-queries.sql
psql -U postgres -d tasks_demo -f 04-funciones.sql
```

`03-queries.sql` y `04-funciones.sql` son de lectura y de objetos extra (vista, función, trigger). Se pueden lanzar más de una vez, salvo el trigger: el archivo hace `DROP ... IF EXISTS` antes de crearlo.

Si el usuario no es `postgres`, cambia `-U`. Si pide contraseña, añádela cuando `psql` la solicite o usa la variable de entorno `PGPASSWORD` solo en tu sesión.
