# Frontend Vue contra la API Symfony

Puerto **5173**. La API tiene que estar en `http://127.0.0.1:8000` (ver `../README.md`).

```powershell
cd integracion/frontend-vue
copy .env.example .env
npm install
npm run dev
```

`copy` en PowerShell. En cmd también vale. Si omites el `.env`, el cliente usa el mismo valor por defecto.

## Rutas

| Ruta | Vista |
|---|---|
| `/tasks` | listado |
| `/tasks/new` | alta |
| `/tasks/:id` | detalle y edición de estado |
