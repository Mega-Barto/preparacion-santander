# Estilos de los frontends

Vue y React comparten la misma identidad visual de **Home Elements**, tomada de [docs/marca/press-kit.md](../docs/marca/press-kit.md).

| Proyecto | Archivo CSS |
|---|---|
| Vue | `frontend-vue/src/assets/app.css` |
| React | `frontend-react/src/app.css` |

Los dos archivos deben mantenerse alineados: mismos tokens, tipografía y reglas de componentes.

---

## Tipografía

Familia: **Ubuntu** (Google Fonts), pesos `300`, `400`, `500`, `700`.

```css
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');

:root {
  --font-primary: 'Ubuntu', sans-serif;
}
```

| Peso | Uso |
|---|---|
| 300 | Texto secundario del brand (eslogan) |
| 400 | Cuerpo |
| 500 | Labels, nav, encabezados de tabla |
| 700 | Títulos y nombre de marca |

---

## Tokens de color

Definidos en `:root` y alineados con el press kit:

| Token | HEX | Uso en la UI |
|---|---|---|
| `--color-primary` | `#263D5B` | Títulos, marca, nav activo, texto de énfasis |
| `--color-secondary` | `#54758B` | Párrafos, nav inactivo, encabezados de tabla |
| `--color-accent` | `#E5A23A` | CTAs (`submit`, `.primary`), hover de enlaces |
| `--color-light` | `#F5F6F7` | Fondos suaves, botones secundarios, chips de nav |
| `--color-white` | `#FFFFFF` | Superficies (header, main, inputs) |
| `--color-dark` | `#252525` | Texto principal |
| `--color-gray` | `#858B91` | Texto auxiliar |

Otros tokens de layout:

| Token | Valor | Uso |
|---|---|---|
| `--radius` | `0.5rem` | Bordes de header, main y controles |
| `--shadow` | sombra suave en primary | Elevación de superficies |

---

## Estructura visual

1. **Fondo de página:** degradado claro + acento radial suave (no flat).
2. **Header y main:** tarjetas blancas centradas (`max-width: 48rem`), con borde sutil y sombra.
3. **Brand (`.brand`):** nombre Home Elements + eslogan “Cada día mejor · Symfony + …”.
4. **Nav:** enlaces tipo chip; activo/hover en primary.
5. **Formularios:** inputs con borde secondary; focus con anillo suave.
6. **Botones:**
   - `submit` y `.primary` → accent (CTA).
   - `type="button"` sin `.primary` → light (acciones secundarias / borrar).
7. **Errores (`.error`):** fondo rojo claro, sin romper la paleta de marca.
8. **Responsive:** header en columna y tablas con scroll horizontal bajo `640px`.

---

## Clases relevantes

| Clase / selector | Dónde | Efecto |
|---|---|---|
| `.brand` | `App.vue` / `App.jsx` | Bloque de marca + eslogan |
| `nav a.active` | React (`NavLink`) | Chip activo |
| `a.router-link-active` | Vue Router | Chip activo |
| `.primary` | botones CTA no-submit | Fondo accent |
| `.error` | mensajes de API/validación | Alerta visible |

---

## Criterios al editar

- No inventar colores fuera de los tokens del press kit.
- Usar accent con moderación (solo CTAs y highlights).
- Mantener contraste texto/fondo legible.
- Si cambias un CSS, replica el cambio en el otro frontend.
