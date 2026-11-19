# Contenido, Logos y Cobertura Comercial (@futbolenlapieluy1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar los logos oficiales de `public/logos/` y completar la información comercial faltante detectada en `docs/marca/` (categorías principales, medios de pago, plazos de envío, guía de talles y política de cambios) sin mostrar precios fijos para impulsar consultas por WhatsApp.

**Architecture:** Centralizar los nuevos datos de marca (categorías, medios de pago, envíos, talles/cambios y rutas de logos) en `src/lib/futbolenlapiel-data.ts`, e incorporarlos progresivamente en los componentes existentes del App Router (`TickerHeader`, `HeroSection`, `ModelosChapter`, `PedidoChapter`, `WordmarkFooter` y `src/app/layout.tsx`) usando `next/image` y respetando la paleta oficial (`#0A1B33`, `#A8D6F0`, `#8ECBF5`, `#1E5AA8`, `#F5EAD6`, `#000000`).

**Tech Stack:** Next.js 16.4.6 (App Router + Turbopack), React 19, TypeScript, Tailwind CSS v4, `next/image`, `lucide-react`, `pnpm`.

**Spec:** `docs/marca/informes_iniciales.md` y `docs/marca/informes_iniciales2.md` + archivos en `public/logos/`.

## Global Constraints

- Gestor de paquetes obligatorio: `pnpm` (`pnpm exec tsc --noEmit`, `pnpm run lint`, `pnpm run build`).
- Raíz de código fuente en `src/` con alias `@/*` -> `./src/*`.
- No mostrar precios fijos en ningún bloque; mantener el flujo de consulta por WhatsApp (`+598 092 864 559` / `wa.me/598092864559`) como CTA principal.
- Preservar la paleta oficial definida en `docs/marca/informes_iniciales2.md`: Marino `#0A1B33`, Celeste `#A8D6F0`, Celeste 2 `#8ECBF5`, Azul `#1E5AA8`, Crema `#F5EAD6`, Negro `#000000`.
- Todas las imágenes de logos deben cargarse desde `/logos/futbolenlapiel_horizontal_transparente.png` y `/logos/futbol_logo_mejorado_v2.png` con `alt` descriptivo en español rioplatense.
- Respetar el contenido real observado en la auditoría sin inventar stock numérico falso ni precios no aprobados por el dueño.

## Review Focus

- **Ausencia de precios fijos sin romper la conversión:** ningún componente debe mostrar precios inventados (ni `$185` ni montos fijos), pero sí debe explicar claramente qué incluye cada consulta (`Versión Jugador`, `Versión Fan`, `Retro`).
- **Legibilidad de logos sobre fondos claros y oscuros:** `futbolenlapiel_horizontal_transparente.png` sobre `TickerHeader` oscuro (`#0A1B33`/`#000000`) y `WordmarkFooter` claro (`#F5EAD6`), asegurando contraste adecuado en ambos casos.
- **Responsive en móvil (`<= 760px`):** el logo en `TickerHeader` y el emblema `futbol_logo_mejorado_v2.png` en `HeroSection` no deben superponerse con el kicker ni el selector de tallas en viewports angostos (`360px`).
- **Preselección de categoría en el formulario `#pedido`:** al hacer clic en una de las 4 categorías (`Actuales`, `Retros`, `Uruguay`, `Clubes`) en `ModelosChapter`, el campo de camiseta o consulta en `PedidoChapter` debe prellenarse o desplazarse a `#pedido` sin perder el estado de `selectedSize`.
- **Metadatos y favicon en Next.js 16:** los metadatos Open Graph / Twitter e ícono en `src/app/layout.tsx` deben apuntar a `/logos/futbol_logo_mejorado_v2.png` sin errores de build en Turbopack.

---

### Task 1: Datos de marca, categorías y bloques comerciales en `src/lib/futbolenlapiel-data.ts`

**Files:**
- Modify: `src/lib/futbolenlapiel-data.ts`

**Interfaces:**
- Produces:
  - `BRAND_LOGOS`: `{ horizontal: '/logos/futbolenlapiel_horizontal_transparente.png'; emblem: '/logos/futbol_logo_mejorado_v2.png' }`
  - `CATALOG_CATEGORIES`: `Array<{ id: 'actuales' | 'retros' | 'uruguay' | 'clubes'; title: string; subtitle: string; examples: string; defaultQuery: string }>`
  - `COMMERCIAL_INFO`: `{ payments: string[]; shipping: Array<{ zone: string; detail: string }>; sizingAndChanges: Array<{ label: string; detail: string }> }`

- [ ] **Step 1: Agregar constantes de logos, categorías y bloques comerciales en `src/lib/futbolenlapiel-data.ts`**

Definir `BRAND_LOGOS`, `CatalogCategoryId`, `CATALOG_CATEGORIES` (las 4 categorías: `Actuales`, `Retros`, `Uruguay`, `Clubes` con ejemplos reales tomados de `docs/marca/informes_iniciales2.md`: Uruguay 2026, Peñarol, Nacional, Noruega Haaland 9, Manchester United 1996 Cantona 7, España 1996 Luis Enrique 21, Brasil 1994 Romário 11, Argentina Messi 10) y `COMMERCIAL_INFO` (medios de pago, envíos Montevideo/Interior/retiro, guía rápida de talles S–XL y política de cambios a confirmar por WhatsApp).

- [ ] **Step 2: Verificar compilación TypeScript**

Run: `pnpm exec tsc --noEmit`
Expected: Exit code 0, sin errores de tipos.

- [ ] **Step 3: Commit**

```bash
git add src/lib/futbolenlapiel-data.ts
git commit -m "feat(data): add brand logos, catalog categories, and commercial info"
```

---

### Task 2: Integrar logos oficiales en `TickerHeader`, `HeroSection`, `WordmarkFooter` y `src/app/layout.tsx`

**Files:**
- Modify: `src/components/TickerHeader.tsx`
- Modify: `src/components/HeroSection.tsx`
- Modify: `src/components/WordmarkFooter.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `BRAND_LOGOS` de `@/lib/futbolenlapiel-data`
- Produces: Renderizado de `next/image` con `BRAND_LOGOS.horizontal` en `TickerHeader` y `WordmarkFooter`, y `BRAND_LOGOS.emblem` en `HeroSection` y metadatos `icons` / `openGraph.images` en `src/app/layout.tsx`.

- [ ] **Step 1: Integrar `BRAND_LOGOS.horizontal` en `TickerHeader.tsx`**

Reemplazar o acompañar el enlace texto `FUTBOL EN LA PIEL` (`href="#inicio"`) con `<Image src={BRAND_LOGOS.horizontal} alt="Fútbol en la Piel" width={140} height={32} priority className="h-6 max-md:h-5 w-auto object-contain" />` manteniendo `aria-label="Fútbol en la Piel, volver arriba"`.

- [ ] **Step 2: Integrar `BRAND_LOGOS.emblem` en `HeroSection.tsx`**

Añadir el emblema circular `<Image src={BRAND_LOGOS.emblem} alt="Sello oficial Fútbol en la Piel" width={48} height={48} priority className="w-11 h-11 max-md:w-9 max-md:h-9 rounded-full border border-[#F5EAD6]/25 bg-black object-cover shrink-0" />` junto al kicker `URUGUAY / ENVÍOS A TODO EL PAÍS` para reforzar identidad de marca desde el primer pantallazo sin tapar el canvas 3D.

- [ ] **Step 3: Integrar `BRAND_LOGOS.horizontal` en `WordmarkFooter.tsx` y metadatos en `src/app/layout.tsx`**

En `WordmarkFooter.tsx`, incorporar `BRAND_LOGOS.horizontal` (sobre un pill o contenedor marino `#0A1B33` si es texto claro sobre fondo crema `#F5EAD6`) en la columna de marca. En `src/app/layout.tsx`, agregar `icons: { icon: '/logos/futbol_logo_mejorado_v2.png', apple: '/logos/futbol_logo_mejorado_v2.png' }` y `openGraph.images` / `twitter.images` apuntando a `/logos/futbol_logo_mejorado_v2.png`.

- [ ] **Step 4: Verificar lint y typecheck**

Run: `pnpm exec tsc --noEmit && pnpm run lint`
Expected: Exit code 0 en ambos comandos.

- [ ] **Step 5: Commit**

```bash
git add src/components/TickerHeader.tsx src/components/HeroSection.tsx src/components/WordmarkFooter.tsx src/app/layout.tsx
git commit -m "feat(brand): integrate official logos across header, hero, footer, and metadata"
```

---

### Task 3: Categorías principales (`Actuales`, `Retros`, `Uruguay`, `Clubes`) en `ModelosChapter.tsx` y conexión con `PedidoChapter.tsx`

**Files:**
- Modify: `src/components/ModelosChapter.tsx`
- Modify: `src/components/FutbolEnLaPielExperience.tsx`
- Modify: `src/components/PedidoChapter.tsx`

**Interfaces:**
- Consumes: `CATALOG_CATEGORIES` de `@/lib/futbolenlapiel-data`
- Produces: Prop opcional `onSelectCategory?: (query: string) => void` desde `FutbolEnLaPielExperience` hacia `ModelosChapter` y `selectedCategoryQuery` hacia `PedidoChapter` para prellenar el campo `camiseta` al hacer clic en una categoría y hacer scroll suave a `#pedido`.

- [ ] **Step 1: Agregar estado `selectedCategoryQuery` en `FutbolEnLaPielExperience.tsx`**

Definir `const [categoryQuery, setCategoryQuery] = useState<string | null>(null)` y handler `handleSelectCategory(query: string)` que actualiza `categoryQuery` y desplaza suavemente a `#pedido` (`document.getElementById('pedido')?.scrollIntoView({ behavior: ... })`). Pasarlo a `ModelosChapter` y `PedidoChapter`.

- [ ] **Step 2: Renderizar las 4 categorías en `ModelosChapter.tsx`**

Debajo de las 3 tarjetas 3D (`cl-sw-grid`), agregar un bloque compacto de 4 tarjetas/botones para `Actuales`, `Retros`, `Uruguay` y `Clubes` con su subtítulo, ejemplos reales y CTA `"Consultar categoría →"` que dispara `onSelectCategory(cat.defaultQuery)`.

- [ ] **Step 3: Sincronizar `categoryQuery` en `PedidoChapter.tsx`**

Cuando `categoryQuery` cambia (y no es `null`), actualizar el input `camiseta` en `PedidoChapter` para que el usuario ya tenga el tema prellenado al completar su nombre, talle y versión.

- [ ] **Step 4: Verificar lint y typecheck**

Run: `pnpm exec tsc --noEmit && pnpm run lint`
Expected: Exit code 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/ModelosChapter.tsx src/components/FutbolEnLaPielExperience.tsx src/components/PedidoChapter.tsx
git commit -m "feat(catalog): add main categories grid linked to WhatsApp inquiry form"
```

---

### Task 4: Bloques de información comercial (pagos, envíos, talles y cambios) en `PedidoChapter.tsx` y `WordmarkFooter.tsx`

**Files:**
- Modify: `src/components/PedidoChapter.tsx`
- Modify: `src/components/WordmarkFooter.tsx`

**Interfaces:**
- Consumes: `COMMERCIAL_INFO` y `BRAND_LOGOS.emblem` de `@/lib/futbolenlapiel-data`

- [ ] **Step 1: Enriquecer las reglas de `PedidoChapter.tsx` con info comercial y sello de marca**

Reemplazar o ampliar las filas informativas junto al formulario (`#pedido`) usando `COMMERCIAL_INFO` para responder sin precios fijos las 4 dudas que frenan la compra según `docs/marca/informes_iniciales2.md`:
1. **Precios y stock:** Se confirman al instante por WhatsApp según modelo, versión (`Jugador` / `Fan` / `Retro`) y talle.
2. **Medios de pago:** Transferencia bancaria, Mercado Pago y efectivo (según modalidad de entrega).
3. **Envíos a todo Uruguay:** Montevideo e Interior por agencia; plazos y costo se confirman al coordinar.
4. **Talles y cambios:** Talles S a XL (corte Jugador más entallado que Fan); cambios sujetos a disponibilidad y prenda sin uso.
Incluir `BRAND_LOGOS.emblem` como sello discreto en la tarjeta del formulario.

- [ ] **Step 2: Actualizar columnas informativas de `WordmarkFooter.tsx`**

Alinear las columnas del footer con `COMMERCIAL_INFO` (categorías disponibles, envíos a todo el país, medios de pago, canal directo `@futbolenlapieluy1` y WhatsApp `+598 092 864 559`).

- [ ] **Step 3: Verificación completa (TypeScript, ESLint y Build de producción Turbopack)**

Run: `pnpm exec tsc --noEmit && pnpm run lint && pnpm run build`
Expected: Exit code 0, build exitoso con Turbopack sin errores ni warnings de imágenes o rutas.

- [ ] **Step 4: Commit**

```bash
git add src/components/PedidoChapter.tsx src/components/WordmarkFooter.tsx
git commit -m "feat(commercial): add payments, shipping, sizing, and exchange info blocks"
```
