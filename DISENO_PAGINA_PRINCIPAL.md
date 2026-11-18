# Diseño de la Página Principal y Componentes — Courtline (Drop 014)

Documentación de la arquitectura visual, estructura de componentes y contenido completo de la aplicación **Courtline — The West Loop Low** implementada en **Next.js App Router** con **Tailwind CSS v4**, **`motion/react`**, **`lucide-react`** y **WebGL2**.

---

## 1. Sistema de Diseño Global (`app/globals.css` y `app/layout.tsx`)

### Paleta de Colores
| Token CSS | Valor Hex / RGBA | Uso principal |
| :--- | :--- | :--- |
| `--field` | `#1E3FFF` | Fondo azul cobalto principal de la página y el escenario 3D |
| `--field-hi` | `#2A4BFF` | Luz radial central en el escenario y tarjetas de colorways |
| `--field-lo` | `#1733D9` | Borde oscuro radial y fondo de la barra superior (`TickerHeader`) |
| `--ice` | `#F4F6FF` | Texto principal sobre cobalto y fondo claro en secciones `#color` y `#club` |
| `--ink` | `#0A1033` | Texto oscuro sobre fondo `--ice` y sombras profundas |
| `--ember` | `#FF5A1F` | Acento principal (CTAs, talla seleccionada, segundos, reglas y bordes de barrido) |
| `--peri` | `#8FA2FF` | Acentos secundarios, divisores y tallas en el anillo 3D |
| `--glass` | `rgba(244, 246, 255, 0.13)` | Superficies translúcidas con `backdrop-filter: blur(20px) saturate(1.35)` |

### Tipografía (`next/font/google`)
- **Display (`--disp`)**: `Unbounded` (pesos `200` a `900`) — Títulos gigantes, anillo 3D, palabras con peso variable en scroll y wordmark `COURTLINE`.
- **Texto (`--text`)**: `Inter Tight` (pesos `400` a `700`) — Descripciones, etiquetas, formularios y bloques informativos.
- **Monospace (`--mono`)**: `JetBrains Mono` (pesos `400`, `500`, `700`) — Contadores, numeración del drop (`DROP 014`), stock por talla y códigos de confirmación.

### Espaciado Base
- Variable fluida `--pad: clamp(16px, 2.4vw, 36px)` para márgenes laterales consistentes entre desktop y móvil.

---

## 2. Arquitectura de la Página Principal (`app/page.tsx` → `CourtlineExperience`)

La página principal se compone de un **escenario fijo detrás de los dos primeros capítulos**, una **barra superior fija** y un flujo vertical de **5 capítulos (`#lace`, `#shoe`, `#color`, `#draw`, `#club`)**:

```text
[ TickerHeader ]                     (position: fixed, z-30)
[ SneakerStage ]                     (position: fixed, z-0 — activo en #lace y #shoe)
└── <main>                           (z-2)
    ├── 01. HeroSection (#lace)      — 100svh: Turntable interactivo, tallas y ficha del drop
    ├── 02. ShoeChapter (#shoe)      — Tipografía gigante reactiva al scroll + especificaciones
    ├── 03. ColorwayChapter (#color) — Barrido fondo hielo + 3 tarjetas 3D de colorways
    └── 04. DrawChapter (#draw)      — Barrido cobalto + contador gigante + reglas + formulario
└── <footer>
    └── 05. WordmarkFooter (#club)   — Wordmark COURTLINE interactivo + columnas informativas
```

### Estado Compartido (`components/CourtlineExperience.tsx`)
- **`selectedSize`**: Talla US seleccionada (`""` inicialmente; sincronizada bidireccionalmente entre `HeroSection`, el anillo 3D de `SneakerStage` y `DrawChapter`).
- **`selectedColorway`**: Colorway activo (`'midnight' | 'ember' | 'chalk'`, por defecto `'midnight'`; sincronizado entre `HeroSection`, `SneakerStage`, `ColorwayChapter` y `DrawChapter`).
- **`paused` y `reducedMotion`**: Controlan la pausa manual de animaciones y el respeto automático a `prefers-reduced-motion: reduce`.
- **`countdown`**: Tiempo restante hasta el próximo viernes a las `10:00 AM` hora central de Chicago (`America/Chicago`).
- **Coreografía de Scroll (`requestAnimationFrame`)**: Calcula en tiempo real la barra de progreso del ticker, escala/rotación de cámara del sneaker, expansión del anillo 3D, peso tipográfico (`200`–`900`) de `#shoe`, barrido de `#color`, inclinación de tarjetas y cortina de `#draw`.

---

## 3. Diseño y Contenido por Componente

### 3.1 `TickerHeader` (`components/TickerHeader.tsx`)
- **Diseño**: Píldora flotante fija (`top: 12px`, `max-w-[1180px]`, `rounded-full`) con efecto glassmorphism cobalto, borde inferior con barra de progreso lineal naranja (`--scroll-p`) y cambio de opacidad al entrar al capítulo claro (`solid`). En móvil (`<= 760px`) oculta la descripción del drop, los enlaces intermedios y la etiqueta de texto del botón de pausa.
- **Contenido**:
  - Marca (enlace a `#lace`): `COURTLINE`
  - Resumen del drop: `DROP 014` · `The West Loop Low` · badge `$185`
  - Navegación por capítulos: `Shoe` (`#shoe`), `Colors` (`#color`), `Draw` (`#draw`)
  - Contador regresivo: `Closes in` + `00d 00h 00m 00s` (segundos resaltados en `--ember` con animación `cd-flip`)
  - Botón de movimiento: Ícono `Pause` / `Play` (`lucide-react`) + texto `Pause` / `Play`
  - Botón CTA (enlace a `#draw`): `Enter the draw` (en móvil: `Enter`)

---

### 3.2 `SneakerStage` (`components/SneakerStage.tsx`)
- **Diseño**: Contenedor fijo (`inset-0`, `pointer-events-none`) oculto automáticamente (`visibility: hidden`) cuando el barrido hielo de `#color` cubre toda la pantalla.
- **Capas visuales (de atrás hacia adelante)**:
  1. **Campo radial cobalto (`cl-field`)**: Gradiente radial con foco de luz móvil (`--lx`) controlado por el scroll.
  2. **Anillo 3D posterior (`cl-ring-back`)**: Mitad trasera del cilindro tipográfico en perspectiva (`rotateX(-13deg)`).
  3. **Sombra y póster de respaldo (`cl-shoe`)**: Sombra elíptica escalable según el ángulo de giro + imagen `<SneakerImage>` con caída suave hasta que WebGL2 esté listo.
  4. **Canvas WebGL2 (`<canvas>`)**: Malla de `150 × 90` vértices desplazada por mapa de profundidad (`depth.png` o generado por canvas), iluminación direccional/rim light, barrido especular y transición suave (`uMix`) al cambiar de colorway.
  5. **Anillo 3D frontal (`cl-ring-front`)**: Mitad delantera del anillo tipográfico.
  6. **Textura de grano (`cl-grain`)**: Ruido SVG sutil animado en overlay (`opacity: 0.07`).
- **Contenido del anillo 3D**:
  - Texto frontal: `LACE. LINE. LEAVE.`
  - Tallas posteriores (rotadas 180°): `7`, `7.5`, `8`, `8.5`, `9`, `9.5`, `10`, `10.5`, `11`, `11.5`, `12`, `12.5`, `13` (la talla seleccionada crece a escala `1.35` en color `#FF5A1F`).

---

### 3.3 `HeroSection` — Capítulo 0 `#lace` (`components/HeroSection.tsx`)
- **Diseño**: Sección de altura completa (`100svh`, `min-height: 620px`) con controles flotantes en las cuatro esquinas sobre el escenario 3D. En móvil reordena el selector de tallas abajo y la ficha del drop justo encima en formato compacto horizontal.
- **Contenido**:
  - **Kicker superior izquierdo**:
    - Título monospace: `CHICAGO, IL / WEST LOOP`
    - Subtítulo (solo desktop): `One numbered sneaker drop at a time. Enter the draw, win a pair, pick it up at the counter.`
  - **Zona interactiva central**: Área de arrastre táctil/ratón (`role="slider"`, `0`–`359°`, navegable también con flechas izquierda/derecha del teclado).
  - **Insignia circular giratoria (derecha)**: Texto curvo `DRAG TO TURN · DRAG TO TURN ·` alrededor de un ícono `MoveHorizontal` en color naranja.
  - **Selector de tallas (`glass-panel`, abajo izquierda)**:
    - Leyenda: `Size` `US men's`
    - Grid de 13 píldoras (`7` a `13` con medias tallas). Las tallas con menos de 10 pares muestran un punto naranja indicador.
    - Stock exacto por talla (`STOCK_LEFT`): `[6, 9, 14, 18, 22, 23, 27, 25, 19, 15, 11, 7, 3]`
    - Nota inferior por defecto: `Pick a size and the ring brings it to the front`
    - Nota al elegir talla: `US [talla] [X] pairs left in this size` (o `only [X] pairs left in this size` si `< 10`).
  - **Tarjeta de detalles del drop (`glass-panel`, abajo derecha)**:
    - Número: `DROP 014`
    - Nombre: `The West Loop Low`
    - Tabla de especificaciones (oculta en móvil):
      - `Price`: `$185`
      - `Pairs`: `312, numbered`
      - `Colorway`: punto de color dinámico + `Midnight` / `Ember` / `Chalk`
  - **Indicador de scroll (centro inferior, solo desktop)**: `01 / 04 Scroll` con línea vertical animada.

---

### 3.4 `ShoeChapter` — Capítulo 1 `#shoe` (`components/ShoeChapter.tsx`)
- **Diseño**: 4 filas verticales espaciadas (`min-height: 62vh`) con alineación alternada (izquierda/derecha en desktop; apiladas en móvil). Cada palabra gigante varía dinámicamente su `fontWeight` (entre `200` y `900`) y `letterSpacing` según su distancia al centro del viewport, mientras la zapatilla del fondo hace zoom e inclinación.
- **Contenido de las 4 filas**:
  1. **Palabra**: `ONE`
     - **Caption**: `Pebbled navy leather on the upper, glove-soft leather on the lining. No logos, no tabs, nothing to peel.`
  2. **Palabra**: `SHOE.` (alineado a la derecha)
     - **Caption**: `A stitched cupsole with a 34 mm stack, cut in Chicago from our own last.`
  3. **Palabra**: `312` (color `--ember`)
     - **Caption**: `Each pair is numbered inside the tongue, 001 to 312. When they are gone, the last stays retired.`
  4. **Palabra**: `PAIRS.` (alineado a la derecha)
     - **Caption**: `US 7 to 13 with half sizes. Pick yours above and the ring turns to it.`

---

### 3.5 `ColorwayChapter` — Capítulo 2 `#color` (`components/ColorwayChapter.tsx` + `components/SneakerImage.tsx`)
- **Diseño**: Contenedor sticky (`c2-pin`) sobre el escenario con transición de barrido horizontal desde la izquierda (`clip-path`) en color `--ice` (`#F4F6FF`), grilla sutil azul de `64px` y borde guía naranja de `10px`. El titular entra escalonado desde la izquierda y se eleva al aparecer el grid de 3 tarjetas (`grid-cols-3` en desktop, `1` columna en móvil) con efecto de inclinación 3D al mover el ratón.
- **Contenido**:
  - **Titular gigante**: `PICK` / `YOUR` (indentado `9vw`) / `COLOR.` (en `--ember`)
  - **Subtítulo**: `Same last, same leather, three ways. 104 pairs of each.`
  - **Tarjetas de Colorway**:
    1. **`01` — Midnight** (`#14224A`)
       - Descripción: `Navy pebbled leather, cream cupsole, white laces`
       - Precio / Cupo: `$185` · `104 / 312`
       - Estado botón: `On the turntable` (activo por defecto) / `Put it on the turntable`
    2. **`02` — Ember** (`#FF5A1F`)
       - Descripción: `Court orange leather, cream cupsole, white laces`
       - Precio / Cupo: `$185` · `104 / 312`
       - Estado botón: `Put it on the turntable` / `On the turntable`
    3. **`03` — Chalk** (`#E8ECF5`)
       - Descripción: `Pale gray pebbled leather, cream cupsole, white laces`
       - Precio / Cupo: `$185` · `104 / 312`
       - Estado botón: `Put it on the turntable` / `On the turntable`
  - **Toast en vivo (`role="status"`, animado con `motion/react`)**:
    - Texto: `[Midnight | Ember | Chalk] is on the turntable now.` + enlace píldora `See it turn ↑` (vuelve a `#lace`).

---

### 3.6 `DrawChapter` — Capítulo 3 `#draw` (`components/DrawChapter.tsx`)
- **Diseño**: Fondo radial cobalto con cortina de barrido inversa desde `--ice` (`clip-path`), seguido de tipografía parallax horizontal, un contador monospace de tamaño monumental, layout de dos columnas (`1fr 1.25fr` en desktop) para reglas y formulario `glass-panel`.
- **Contenido**:
  - **Palabras deslizantes (parallax opuesto)**:
    - `FRIDAY.` (blanco)
    - `10 AM.` (alineado a la derecha, `--ember`)
    - `CHICAGO.` (contorno transparente con trazo blanco de `2px`)
  - **Contador gigante**:
    - Unidades: `00 days`, `00 hours`, `00 min`, `00 sec` (segundos en `--ember`)
    - Fecha dinámica: `The draw closes [Weekday, Month Day] at 10:00 AM Central. Winners hear back by 10:15.`
  - **Lista de reglas (`01` a `03`)**:
    1. `01` **One entry per person.** `Duplicates come out before the draw, and bots never make it in.`
    2. `02` **Win, then pay.** `Entering is free. Winners get a 24-hour checkout link by 10:15 AM.`
    3. `03` **Pick up or ship.** `Collect at the West Loop counter on the weekend, or ship in 2 days for $12.`
  - **Formulario (`Enter Drop 014`)**:
    - `Full name` (placeholder: `Alex Rivera`)
    - `Email` (placeholder: `alex@example.com`)
    - `Size (US men's)` (`Pick a size`, `US 7` a `US 13`)
    - `Colorway` (`Midnight`, `Ember`, `Chalk`)
    - Selector segmentado (`Pickup or ship`): `Pick up, West Loop` | `Ship, 2 days, $12`
    - Campo condicional al elegir envío: `Shipping ZIP` (5 dígitos, placeholder: `60607`)
    - Checkbox obligatorio: `I am 16 or older and agree to the draw rules. One entry per person.`
    - Botón de envío: `Enter the draw ↗`
    - Mensajes de validación accesibles (con animación `cl-shake`):
      - Nombre vacío: `Add your full name.`
      - Email inválido: `Add an email we can reach you at.`
      - Sin talla: `Pick a size first.`
      - ZIP inválido: `Add a 5 digit ZIP for shipping.`
      - Sin aceptar reglas: `Tick the box to accept the draw rules.`
  - **Tarjeta de confirmación (al enviar, animada con `motion/react`)**:
    - Etiqueta: `ENTRY RECEIVED`
    - Título: `You are in, [Primer nombre].`
    - Código determinista: `CL014-[4 dígitos]`
    - Resumen: `US [talla], [colorway], [pickup at the West Loop counter | ships to [ZIP] in 2 days for $12]. If your number comes up you get a 24-hour checkout link for $185. Nothing is charged to enter.`
    - Botón secundario: `Enter someone else`

---

### 3.7 `WordmarkFooter` — Capítulo 4 `#club` (`components/WordmarkFooter.tsx`)
- **Diseño**: Fondo claro `--ice` (`#F4F6FF`), encabezado gigante ocupando todo el ancho donde cada letra de `COURTLINE` entra desde abajo (`IntersectionObserver`) y oscila su peso tipográfico (`250`–`860`) siguiendo la posición horizontal del puntero (o mediante una onda sinusoidal automática en reposo), seguido de una grilla de 4 columnas (`2` en móvil) separada por borde superior azul cobalto de `2px`.
- **Contenido**:
  - **Wordmark**: `C O U R T L I N E`
  - **Columna 1 — `COUNTER`**: `Fulton Market, West Loop, Chicago, IL. Saturday and Sunday, 11 AM to 6 PM. Pickups only, no walk-in sales on drop weekends.`
  - **Columna 2 — `SHIPPING`**: `Two days anywhere in the lower 48 for $12, free on two pairs. Returns within 14 days, unworn.`
  - **Columna 3 — `DROPS`**: `One shoe at a time, about every six weeks. Drop 015 is already on the last.`
  - **Columna 4 — `JUMP`**: Enlaces rápidos `Sizes` (`#lace`), `Colorways` (`#color`), `Draw rules` (`#draw`), `Back to top` (`#lace`)
  - **Nota inferior**: `A demo store. Courtline, its drops and its people are invented, and forms here send nothing.`

---

## 4. Módulos Auxiliares (`lib/`)

- **`lib/courtline-data.ts`**: Define los tipos (`ColorwayId`, `ColorwayInfo`, `CountdownState`), listas de tallas y stock, descripciones de los 3 colorways, el cálculo exacto en zona horaria `America/Chicago` para el cierre de los viernes a las 10:00 AM y la función hash para generar el identificador `CL014-XXXX`.
- **`lib/sneaker-assets.ts`**: Contiene las URLs principales (`GENERATED_ASSETS`) y un sintetizador procedural en `<canvas>` (`renderSneakerDataURL` de `1200×713` y `renderDepthDataURL` de `600×356`) que dibuja el sneaker en cuero granulado, costuras, cordones, suela cupsole de 34 mm y el sello `CL·014/312` como respaldo automático si los recursos remotos fallan o son bloqueados por CORS.
