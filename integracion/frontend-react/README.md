# Frontend React contra la API Symfony

Puerto **3000**. La API tiene que estar en `http://127.0.0.1:8000`.

```powershell
cd integracion/frontend-react
copy .env.example .env
npm install
npm run dev
```

El listado carga las tareas, el formulario hace el alta y cada fila puede cambiar el estado (PUT) o borrarla (DELETE).

## Rutas

| Ruta | Página |
|---|---|
| `/tasks` | listado |
| `/tasks/new` | alta |
