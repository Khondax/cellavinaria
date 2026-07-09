# 🍷 Cellavinaria

Gestión personal de bodega de vinos con **Astro 7 + Tailwind CSS + Preact**. Visualiza tu colección de vinos organizados en vinotecas físicas, con filtros avanzados y gestión de inventario.

# Recursos empleados para agentes
## Habilidades:
### Rendimiento:
- `karpathy-guidelines` (multica-ai/andrej-karpathy-skills)
### Buenas prácticas y patrones de programación:
- `nodejs-backend-patterns` (wshobson/agents)
- `nodejs-best-practices` (sickn33/antigravity-awesome-skills)
- `tailwind-css-patterns` (giuseppe-trisciuoglio/developer-kit)
- `typescript-advanced-types` (wshobson/agents)
- `vitest` (antfu/skills)
- `seo` (addyosmani/web-quality-skills)
- `deploy-to-vercel` (vercel-labs/agent-skills)
### Diseño:
- `accessibility` (addyosmani/web-quality-skills)
- `astro` (astrolicious/agent-skills)
- `frontend-design` (anthropics/skills)

## MCPs:
- 

## Herramientas:
- `Improve` -> Para elaborar planes de mejora (Shadcn/improve)

## ✨ Características Implementadas

- ✅ **Vista de Vinotecas**: Visualización en grid de las vinotecas físicas (Gran Canaria 3x6, Santander 6x5)
- ✅ **Gestión de Inventario**: Sistema de posiciones que mapea cada slot del rack a un vino específico
- ✅ **Content Collections**: Biblioteca completa de vinos en MDX con validación Zod
- ✅ **Vista de Lista**: Listado completo de vinos actualmente en vinotecas
- ✅ **Metadata SEO**: Open Graph, Twitter Card, metadatos completos
- ✅ **Responsive Design**: Optimizado para mobile, tablet y desktop
- ✅ **TypeScript strict mode**: Tipado fuerte en toda la aplicación

## 🚧 Próximas Mejoras

- ⏳ **Filtros Interactivos**: Componentes Preact para filtrar por tipo de uva, variedad, región, precio, puntuación
- ⏳ **Tooltips y Modal**: Hover con info básica + click para detalle completo
- ⏳ **Imágenes de Botellas**: Integración de imágenes reales de vinos
- ⏳ **Tests con Vitest**: Cobertura de utilidades, helpers y validaciones
- ⏳ **Deploy a Vercel**: CI/CD automático con GitHub Actions

---

## 🚀 Estructura del proyecto

Dentro del proyecto de Astro se encuentran las siguientes carpetas y ficheros:

```text
├── public/
├── src/
│   ├── components/
│   │   ├── RackPosition.astro         # Posición individual del rack (ocupada/vacía)
│   │   ├── VinotecaRackView.astro     # Vista completa de vinoteca con grid
│   │   └── WineCard.astro             # Tarjeta de vino para vista de lista
│   ├── content/
│   │   └── wines/                     # Colección de vinos (MDX) - Biblioteca completa
│   ├── data/
│   │   ├── inventory.ts               # Estado actual de vinotecas (posición → vino)
│   │   └── vinotecas.ts               # Configuración física de racks y helpers
│   ├── layouts/
│   │   └── BaseLayout.astro           # Layout base con SEO y navegación
│   ├── pages/
│   │   ├── index.astro                # Landing: Vista de vinotecas
│   │   └── vinos.astro                # Vista de lista con filtros
│   ├── types/
│   │   └── wine.ts                    # TypeScript types (Wine, WineWithLocation, etc.)
│   └── content.config.ts              # Schema Zod para colecciones
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── tsconfig.json
```

## 📊 Arquitectura de Datos

### Content Collections (MDX) = Biblioteca Completa
Los archivos MDX en `src/content/wines/` representan la **biblioteca completa de vinos** (histórico de todos los vinos probados/comprados), **SIN información de ubicación**.

Cada vino incluye:
- Identificación: nombre, tipo de uva, variedad, bodega, región, país
- Datos comerciales: precio, puntuación
- Consumo óptimo: rango de años (fechaToma inicio/fin)
- Notas de cata: markdown con maridaje, temperatura, aromas, etc.

### Inventory (TypeScript) = Estado Actual de Vinotecas
El archivo `src/data/inventory.ts` mapea cada **posición** de cada vinoteca a un **vino** (o `null` si está vacía).

```typescript
export const inventory: Inventory = {
  'gran-canaria': {
    1: null,
    2: 'ribera-emilio-moro-2020',  // slug del vino en content/wines
    3: 'rioja-marques-riscal-reserva',
    // ... hasta 18
  },
  'santander': {
    1: 'barolo-fontanafredda-2019',
    // ... hasta 30
  },
};
```

### Vinotecas (TypeScript) = Estructura Física
El archivo `src/data/vinotecas.ts` define las **estructuras físicas** de las vinotecas (layouts de racks):

```typescript
export const vinotecas = {
  'gran-canaria': {
    nombre: 'Vinoteca Gran Canaria',
    capacidad: 18,
    filas: 3,
    columnas: 6,
    layout: [[1,2,3,4,5,6], [7,8,9,10,11,12], [13,14,15,16,17,18]],
  },
  // ...
};
```

Esta separación permite:
- ✅ Duplicados: mismo vino en múltiples posiciones
- ✅ Histórico: vinos consumidos siguen en la biblioteca
- ✅ Flexibilidad: mover vinos sin modificar MDX files


## 🧞 Comandos

Todos los comandos se ejecutan desde la raiz del proyecto, en una terminal indica:
All commands are run from the root of the project, from a terminal:

| Command                   | Action                                                       |
| :------------------------ | :----------------------------------------------------------- |
| `pnpm install`            | Instala dependencias                                         |
| `pnpm dev`                | Inicia el servidor local de desarrollo en `localhost:4321`   |
| `pnpm build`              | Compila la versión de producción en `./dist/`                |
| `pnpm preview`            | Vista previa de tu build, antes del despliegue               |
| `pnpm test`               | Ejecuta tests en modo watch (Vitest)                         |
| `pnpm test:run`           | Ejecuta tests una sola vez                                   |
| `pnpm format`             | Formatea el código con Prettier                              |

**Nota**: Para ejecutar el servidor de desarrollo, usa `ASTRO_TELEMETRY_DISABLED=1 pnpm dev` para evitar delays de telemetría.

---

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Añadir tus vinos
Crea archivos MDX en `src/content/wines/`:

```mdx
---
nombre: Tu Vino Favorito
tipoUva: tempranillo
variedad: tinto
bodega: Bodega XYZ
region: Rioja
pais: España
precio: 25.00
puntuacion: 9
fechaToma:
  inicio: 2026
  fin: 2030
---

Notas de cata y descripción del vino...
```

### 3. Actualizar el inventario
Edita `src/data/inventory.ts` para mapear posiciones:

```typescript
export const inventory: Inventory = {
  'gran-canaria': {
    1: 'tu-vino-favorito',  // slug del archivo MDX
    2: null,                 // posición vacía
    // ...
  },
};
```

### 4. Ejecutar el servidor
```bash
ASTRO_TELEMETRY_DISABLED=1 pnpm dev
```

Visita `http://localhost:4321` para ver tus vinotecas.

---

## 📝 Licencia

MIT - Siéntete libre de fork y adaptar para tu propia colección.