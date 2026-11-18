# Diseño de la Página Principal y Componentes — Fútbol en la Piel (adaptado de Courtline Drop 014)

Documentación de la arquitectura visual, estructura de componentes y contenido completo de la aplicación **Fútbol en la Piel — @futbolenlapieluy1** implementada en **Next.js App Router** con **Tailwind CSS v4**, **`motion/react`**, **`lucide-react`** y **WebGL2**.

> **Criterio de esta adaptación:** se mantiene la arquitectura, la jerarquía y los componentes del documento original de Courtline. Solo se ajustan los textos para la marca Fútbol en la Piel. No se inventan precios, stock, plazos ni testimonios. Lo que no está verificado en la cuenta queda marcado como **A CONFIRMAR**.

**Datos verificados de la cuenta (18/11/2026):**
- Nombre: futbolenlapiel — **@futbolenlapieluy1**
- Seguidores: 720 | Publicaciones: 50 | País de la cuenta: Uruguay
- Bio textual: “camisetas actuales y retros / envios a todo el pais / consultas al privado”
- Web en bio: `wa.me/+598092864559` → WhatsApp **+598 092 864 559**
- En posteos recientes se ven: Noruega 2026 Haaland 9, Como 1907 2026, Manchester United 1996 Cantona 7 (retro), Uruguay 2026 Mundial, España 1996 Luis Enrique 21 (retro), talles sueltos por publicación y versiones Jugador / Fan según publicación.

---

## 1. Sistema de Diseño Global (`app/globals.css` y `app/layout.tsx`)

### Paleta de Colores — Paleta oficial Fútbol en la Piel, no la de Courtline
| Token CSS | Valor Hex / RGBA | Uso principal |
| :--- | :--- | :--- |
| `--field` | `#0A1B33` | Fondo marino principal de la página y el escenario 3D |
| `--field-hi` | `#132C52` | Luz radial central en el escenario y tarjetas de modelos |
| `--field-lo` | `#000000` | Borde oscuro radial y fondo de la barra superior (`TickerHeader`) |
| `--ice` | `#F5EAD6` | Texto crema principal sobre marino y fondo claro en secciones `#modelos` y `#contacto` |
| `--ink` | `#0A1B33` | Texto oscuro sobre fondo `--ice` y sombras profundas |
| `--ember` | `#A8D6F0` | Acento principal (CTAs, talle seleccionado, segundos, reglas y bordes de barrido) — reemplaza el naranja `#FF5A1F` de Courtline |
| `--peri` | `#8ECBF5` | Acentos secundarios, divisores y talles en el anillo 3D |
| `--azul` | `#1E5AA8` | Acento azul medio para botones y enlaces secundarios |
| `--glass` | `rgba(10, 27, 51, 0.72)` | Superficies translúcidas con `backdrop-filter: blur(20px) saturate(1.35)` |

### Tipografía (`next/font/google`)
- **Display (`--disp`)**: `Archivo Black` + `Barlow Condensed` (pesos `600` a `900`) — Títulos gigantes, anillo 3D, palabras con peso variable en scroll y wordmark `FUTBOL EN LA PIEL`.
- **Texto (`--text`)**: `Inter` (pesos `400` a `800`) — Descripciones, etiquetas, formularios y bloques informativos.
- **Monospace (`--mono`)**: `JetBrains Mono` (pesos `400`, `500`, `700`) — Contadores, numeración de la tanda, stock por talle y códigos de confirmación.

### Espaciado Base
- Variable fluida `--pad: clamp(16px, 2.4vw, 36px)` para márgenes laterales consistentes entre desktop y móvil.

---

## 2. Arquitectura de la Página Principal (`app/page.tsx` → `FutbolEnLaPielExperience`)

La página principal se compone de un **escenario fijo detrás de los dos primeros capítulos**, una **barra superior fija** y un flujo vertical de **5 capítulos (`#inicio`, `#camiseta`, `#modelos`, `#pedido`, `#contacto`)**:

```text
[ TickerHeader ]                     (position: fixed, z-30)
[ CamisetaStage ]                    (position: fixed, z-0 — activo en #inicio y #camiseta)
└── <main>                           (z-2)
    ├── 01. HeroSection (#inicio)   — 100svh: Turntable interactivo, talles y ficha de la camiseta
    ├── 02. CamisetaChapter (#camiseta) — Tipografía gigante reactiva al scroll + especificaciones
    ├── 03. ModelosChapter (#modelos) — Barrido fondo crema + 3 tarjetas 3D de modelos
    └── 04. PedidoChapter (#pedido) — Barrido marino + contador + reglas + formulario
└── <footer>
    └── 05. WordmarkFooter (#contacto) — Wordmark FUTBOL EN LA PIEL interactivo + columnas informativas
```

### Estado Compartido (`components/FutbolEnLaPielExperience.tsx`)
- **`selectedSize`**: Talle seleccionado (`""` inicialmente; sincronizada bidireccionalmente entre `HeroSection`, el anillo 3D de `CamisetaStage` y `PedidoChapter`). Talles reales según publicación: `S`, `M`, `L`, `XL` — no todos los modelos tienen todos los talles.
- **`selectedModelo`**: Modelo activo (`'uruguay' | 'retro' | 'club'`, por defecto `'uruguay'`; sincronizado entre `HeroSection`, `CamisetaStage`, `ModelosChapter` y `PedidoChapter`).
- **`paused` y `reducedMotion`**: Controlan la pausa manual de animaciones y el respeto automático a `prefers-reduced-motion: reduce`.
- **`countdown`**: **A CONFIRMAR.** En el original de Courtline era “próximo viernes 10:00 AM Chicago”. En Fútbol en la Piel no hay un cierre de despachos verificado en bio ni en posteos, así que el contador debe mostrarse como “Cierre a confirmar” o no mostrarse hasta que el cliente confirme día/hora.
- **Coreografía de Scroll (`requestAnimationFrame`)**: Calcula en tiempo real la barra de progreso del ticker, escala/rotación de cámara de la camiseta, expansión del anillo 3D, peso tipográfico (`600`–`900`) de `#camiseta`, barrido de `#modelos`, inclinación de tarjetas y cortina de `#pedido`.

---

## 3. Diseño y Contenido por Componente

### 3.1 `TickerHeader` (`components/TickerHeader.tsx`)
- **Diseño**: Píldora flotante fija (`top: 12px`, `max-w-[1180px]`, `rounded-full`) con efecto glassmorphism marino, borde inferior con barra de progreso lineal celeste (`--scroll-p`) y cambio de opacidad al entrar al capítulo claro (`solid`). En móvil (`<= 760px`) oculta la descripción, los enlaces intermedios y la etiqueta de texto del botón de pausa.
- **Contenido**:
  - Marca (enlace a `#inicio`): `FUTBOL EN LA PIEL`
  - Resumen: `@futbolenlapieluy1` · `Uruguay` · badge `Actuales & Retros`
  - Navegación por capítulos: `Camiseta` (`#camiseta`), `Modelos` (`#modelos`), `Pedir` (`#pedido`)
  - Contador regresivo: `Cierre a confirmar` + `00d 00h 00m 00s` (segundos resaltados en `--ember` con animación `cd-flip`) — **no afirmar un día/hora hasta confirmar**
  - Botón de movimiento: Ícono `Pause` / `Play` (`lucide-react`) + texto `Pausar` / `Reanudar`
  - Botón CTA (enlace a `#pedido`): `Pedir por WhatsApp` (en móvil: `Pedir`)

---

### 3.2 `CamisetaStage` (`components/CamisetaStage.tsx`)
- **Diseño**: Contenedor fijo (`inset-0`, `pointer-events-none`) oculto automáticamente (`visibility: hidden`) cuando el barrido crema de `#modelos` cubre toda la pantalla.
- **Capas visuales (de atrás hacia adelante)**:
  1. **Campo radial marino (`cl-field`)**: Gradiente radial con foco de luz móvil (`--lx`) controlado por el scroll.
  2. **Anillo 3D posterior (`cl-ring-back`)**: Mitad trasera del cilindro tipográfico en perspectiva (`rotateX(-13deg)`).
  3. **Sombra y póster de respaldo (`cl-camiseta`)**: Sombra elíptica escalable según el ángulo de giro + imagen `<CamisetaImage>` con caída suave hasta que WebGL2 esté listo.
  4. **Canvas WebGL2 (`<canvas>`)**: Malla de `150 × 90` vértices desplazada por mapa de profundidad, iluminación direccional/rim light, barrido especular y transición suave (`uMix`) al cambiar de modelo.
  5. **Anillo 3D frontal (`cl-ring-front`)**: Mitad delantera del anillo tipográfico.
  6. **Textura de grano (`cl-grain`)**: Ruido SVG sutil animado en overlay (`opacity: 0.07`).
- **Contenido del anillo 3D**:
  - Texto frontal: `LA PASIÓN SE LLEVA PUESTA.`
  - Talles posteriores (rotados 180°): `S`, `M`, `L`, `XL` (el talle seleccionado crece a escala `1.35` en color `#A8D6F0`).

---

### 3.3 `HeroSection` — Capítulo 0 `#inicio` (`components/HeroSection.tsx`)
- **Diseño**: Sección de altura completa (`100svh`, `min-height: 620px`) con controles flotantes en las cuatro esquinas sobre el escenario 3D. En móvil reordena el selector de talles abajo y la ficha justo encima en formato compacto horizontal.
- **Contenido**:
  - **Kicker superior izquierdo**:
    - Título monospace: `URUGUAY / ENVÍOS A TODO EL PAÍS`
    - Subtítulo (solo desktop): `Camisetas actuales y retros. Consultá stock por privado y pedí por WhatsApp.`
  - **Titular gigante**: `FUTBOL EN LA PIEL`
  - **Subtítulo**: `La pasión se lleva puesta.`
  - **Ficha de la camiseta**:
    - Modelo destacado: `Uruguay 2026 Mundial` — ejemplo real de posteos recientes, no promesa de stock permanente
    - Versiones: `Versión Jugador / Versión Fan — según publicación`
    - Talles: `S · M · L · XL — según modelo, a confirmar por publicación`
    - Precio: **A CONFIRMAR por WhatsApp** — no hay precios en bio ni en posteos revisados
    - Estado: `Disponible / Vendida — según publicación`
  - **Selector de talles**: `S`, `M`, `L`, `XL`
  - **CTA**: `Pedir por WhatsApp ↗` / `Ver modelos`

---

### 3.4 `CamisetaChapter` — Capítulo 1 `#camiseta` (`components/CamisetaChapter.tsx`)
- **Diseño**: Tipografía gigante reactiva al scroll + especificaciones. Palabras con peso variable según proximidad al centro de la pantalla.
- **Contenido de las 4 filas**:
  1. **Palabra**: `UNA`
     - **Caption**: `Camisetas actuales y retros, de selecciones y clubes. Sin inventar historia: cada modelo se confirma por su publicación.`
  2. **Palabra**: `CAMISETA.` (alineado a la derecha)
     - **Caption**: `Versión Jugador o Versión Fan según publicación. Talle a confirmar por modelo.`
  3. **Palabra**: `50` (color `--ember`)
     - **Caption**: `50 publicaciones en la cuenta @futbolenlapieluy1. No es cantidad de modelos distintos verificados: el catálogo real se confirma modelo por modelo.`
  4. **Palabra**: `PUBLICACIONES.` (alineado a la derecha)
     - **Caption**: `Elegí un talle arriba y el anillo lo trae al frente. La disponibilidad real se confirma por WhatsApp.`

---

### 3.5 `ModelosChapter` — Capítulo 2 `#modelos` (`components/ModelosChapter.tsx` + `components/CamisetaImage.tsx`)
- **Diseño**: Contenedor sticky (`c2-pin`) sobre el escenario con transición de barrido horizontal desde la izquierda (`clip-path`) en color `--ice` (`#F5EAD6`), grilla sutil azul de `64px` y borde guía celeste de `10px`. El titular entra escalonado desde la izquierda y se eleva al aparecer el grid de 3 tarjetas (`grid-cols-3` en desktop, `1` columna en móvil) con efecto de inclinación 3D al mover el ratón.
- **Contenido**:
  - **Titular gigante**: `ELEGÍ` / `TU` (indentado `9vw`) / `CAMISETA.` (en `--ember`)
  - **Subtítulo**: `Mismo escudo, misma pasión, tres formas de llevarla. Disponibilidad según publicación.`
  - **Tarjetas de Modelos** — ejemplos reales de posteos, no catálogo cerrado:
    1. **`01` — Uruguay 2026 Mundial** (`#0A1B33`)
       - Descripción: `Celeste tradicional, selección Uruguay, versión 2026 Mundial`
       - Precio / Cupo: `A CONFIRMAR por WhatsApp` · `Disponibilidad según publicación`
       - Estado botón: `En el escenario` (activo por defecto) / `Ver en el escenario`
    2. **`02` — Retro — Manchester United 1996 Cantona 7** (`#A8D6F0`)
       - Descripción: `Retro 1996, dorsal Cantona 7 — ejemplo real de posteos`
       - Precio / Cupo: `A CONFIRMAR por WhatsApp` · `Disponibilidad según publicación`
       - Estado botón: `Ver en el escenario` / `En el escenario`
    3. **`03` — Retro — España 1996 Luis Enrique 21** (`#F5EAD6`)
       - Descripción: `Retro 1996, dorsal Luis Enrique 21 — ejemplo real de posteos`
       - Precio / Cupo: `A CONFIRMAR por WhatsApp` · `Disponibilidad según publicación`
       - Estado botón: `Ver en el escenario` / `En el escenario`
  - **Toast en vivo (`role="status"`, animado con `motion/react`)**:
    - Texto: `[Uruguay 2026 | Retro Man. United 1996 | Retro España 1996] está en el escenario ahora.` + enlace píldora `Verla girar ↑` (vuelve a `#inicio`).

---

### 3.6 `PedidoChapter` — Capítulo 3 `#pedido` (`components/PedidoChapter.tsx`)
- **Diseño**: Fondo radial marino con cortina de barrido inversa desde `--ice` (`clip-path`), seguido de tipografía parallax horizontal, un contador monospace de tamaño monumental, layout de dos columnas (`1fr 1.25fr` en desktop) para reglas y formulario `glass-panel`.
- **Contenido**:
  - **Palabras deslizantes (parallax opuesto)**:
    - `PEDÍ.` (blanco)
    - `POR WHATSAPP.` (alineado a la derecha, `--ember`)
    - `URUGUAY.` (contorno transparente con trazo blanco de `2px`)
  - **Contador gigante**:
    - Unidades: `00 días`, `00 horas`, `00 min`, `00 seg` (segundos en `--ember`)
    - Fecha dinámica: `Cierre de despachos: A CONFIRMAR. Consultá stock y plazo por WhatsApp antes de pedir.`
  - **Lista de reglas (`01` a `03`)**:
    1. `01` **Elegí modelo, versión y talle.** `Indicá el modelo que viste, Versión Jugador o Fan según publicación, y tu talle (S a XL según modelo).`
    2. `02` **Confirmamos stock por WhatsApp.** `Te respondemos con disponibilidad real, precio actualizado y medios de pago disponibles. Sin precios inventados en la página.`
    3. `03` **Envío a todo Uruguay.** `Despachamos a Montevideo y los 18 departamentos del interior o coordinamos entrega directa al privado. Costo y plazo a confirmar al consultar.`
  - **Formulario (`Pedir por WhatsApp`)**:
    - `Tu nombre` (placeholder: `Ej: Mati`)
    - `Camiseta elegida` (placeholder: `Ej: Uruguay 2026 Mundial`)
    - `Versión` (`Versión Jugador`, `Versión Fan`, `A confirmar según stock`)
    - `Talle` (`S`, `M`, `L`, `XL`)
    - Selector segmentado (`Envío`): `Envío a todo Uruguay` | `Coordinar entrega`
    - Campo condicional: `Departamento de destino` (los 19 departamentos: Montevideo, Canelones, Maldonado, Salto, Paysandú, Rivera, Colonia, Rocha, San José, Tacuarembó, Cerro Largo, Soriano, Artigas, Durazno, Florida, Lavalleja, Río Negro, Treinta y Tres, Flores)
    - Checkbox obligatorio: `Confirmo que la disponibilidad, el precio y el envío se confirman por WhatsApp.`
    - Botón de envío: `Preparar consulta para WhatsApp ↗`
    - Mensajes de validación accesibles (con animación `cl-shake`):
      - Nombre vacío: `Agregá tu nombre.`
      - Sin camiseta: `Elegí una camiseta.`
      - Sin talle: `Elegí un talle.`
      - Sin departamento: `Elegí tu departamento.`
      - Sin aceptar: `Aceptá que la confirmación es por WhatsApp.`
  - **Tarjeta de confirmación (al enviar, animada con `motion/react`)**:
    - Etiqueta: `CONSULTA LISTA`
    - Título: `Todo pronto, [Nombre].`
    - Código: `FEP-[4 dígitos]` — solo identificador de la consulta, no es número de pedido ni de stock
    - Resumen: `[Camiseta], [Versión], talle [S/M/L/XL], envío a [Departamento]. Abrí WhatsApp (+598 092 864 559) para confirmar stock, precio y envío. Nada se cobra desde esta página.`
    - Botón secundario: `Consultar otro modelo`

---

### 3.7 `WordmarkFooter` — Capítulo 4 `#contacto` (`components/WordmarkFooter.tsx`)
- **Diseño**: Fondo claro `--ice` (`#F5EAD6`), encabezado gigante ocupando todo el ancho donde cada letra de `FUTBOL EN LA PIEL` entra desde abajo (`IntersectionObserver`) y oscila su peso tipográfico (`250`–`860`) siguiendo la posición horizontal del puntero (o mediante una onda sinusoidal automática en reposo), seguido de una grilla de 4 columnas (`2` en móvil) separada por borde superior marino de `2px`.
- **Contenido**:
  - **Wordmark**: `F U T B O L   E N   L A   P I E L`
  - **Columna 1 — `INSTAGRAM`**: `@futbolenlapieluy1 — Publicaciones de camisetas actuales, retros y ediciones especiales. Consultas al privado.`
  - **Columna 2 — `WHATSAPP`**: `WhatsApp directo: +598 092 864 559. Consultá stock, talles y precios.`
  - **Columna 3 — `ENVÍOS`**: `Envíos a todo Uruguay. Versiones Jugador y Fan según publicación, talles S a XL según modelo. Costo y plazo a confirmar.`
  - **Columna 4 — `IR A`**: Enlaces rápidos `Talles` (`#inicio`), `Modelos` (`#modelos`), `Pedir` (`#pedido`), `Volver arriba` (`#inicio`)
  - **Nota inferior**: `Fútbol en la Piel (@futbolenlapieluy1) · Uruguay. Catálogo basado en las publicaciones de la cuenta oficial. Precios y disponibilidad sujetos a confirmación por WhatsApp. Nada en esta página cobra ni reserva stock.`

---

## 4. Módulos Auxiliares (`lib/`)

- **`lib/futbolenlapiel-data.ts`**: Define los tipos (`ModeloId`, `ModeloInfo`, `CountdownState`), listas de talles (`S`, `M`, `L`, `XL` según modelo) y stock **siempre como “a confirmar por publicación”**, descripciones de los 3 modelos de ejemplo, el cálculo del contador **solo si el cliente confirma día/hora de cierre** en zona horaria `America/Montevideo` y la función hash para generar el identificador de consulta `FEP-XXXX`.
- **`lib/camiseta-assets.ts`**: Contiene las URLs principales y un sintetizador procedural en `<canvas>` que dibuja la camiseta como respaldo automático si los recursos remotos fallan o son bloqueados por CORS. No reemplaza fotos reales de stock: cuando haya fotos reales, esas son las que mandan.
