# Design System: Fútbol en la Piel (@futbolenlapieluy1)
**Project ID:** Local (`D:\repositorios\futbolenlapiel_op1`) — listo para vincular con Stitch (`3095706769284660357` / `9323229532177060184`)

## 1. Visual Theme & Atmosphere
Editorial athletic showcase with a nocturnal, high-contrast Uruguayan football identity. The interface pairs a deep midnight-navy stadium canvas with warm vintage-cream typography and crisp celeste accents, balancing modern 3D product staging with nostalgic retro-jersey storytelling. Surface density is intentional and spacious: hero and chapter views give jerseys room to breathe, while translucent frosted-glass panels keep size selectors, version badges (Jugador / Fan), and WhatsApp CTAs anchored without visual clutter.

## 2. Color Palette & Roles
- **Midnight Stadium Navy (`#0A1B33`)**: Primary background canvas (`--field`, `--background`) and dark ink (`--ink`) on light cream sections.
- **Twilight Navy (`#132C52`)**: Elevated radial stage highlight (`--field-hi`) and secondary/muted surfaces (`--secondary`, `--muted`).
- **Card Slate Navy (`#102442`)**: Card and container surface (`--card`) for jersey showcases and catalog items.
- **Popover Deep Navy (`#0D203B`)**: Floating menus, drawers, and overlays (`--popover`).
- **Warm Vintage Cream (`#F5EAD6`)**: Primary foreground text (`--ice`, `--foreground`) over dark navy, and light editorial band background.
- **Uruguayan Sky Celeste (`#A8D6F0`)**: Primary brand accent (`--ember`, `--primary`), primary CTA fills, selected size indicators, and keyboard focus outlines (`2px` solid).
- **Ice Celeste Highlight (`#8ECBF5`)**: Secondary highlight (`--peri`, `--ring`), progress bar gradients, and subtle interactive borders.
- **Pitch Cobalt Blue (`#1E5AA8`)**: Secondary interactive accent (`--azul`, `--accent`) for hover states and badges.
- **Muted Steel Blue (`#B8C7DC`)**: Secondary body copy, captions, and metadata labels (`--muted-foreground`).
- **Frosted Midnight Glass (`rgba(10, 27, 51, 0.72)`)**: Translucent floating HUD panels (`.glass-panel`) with `20px` backdrop blur and a `1px` warm cream hairline border (`rgba(245, 234, 214, 0.22)`).

## 3. Typography Rules
- **Display & Athletic Headlines (`Barlow Condensed` 200–900 & `Archivo Black` 400)**: Used for hero titles, chapter statements, and the `FÚTBOL EN LA PIEL` wordmark. Tall, condensed proportions evoke matchday typography and classic kit numbering.
- **Body & UI Copy (`Inter` 400–800 & `Geist`)**: Clean geometric sans-serif for product descriptions, WhatsApp ordering instructions, and navigation links.
- **Technical Specs & Badges (`JetBrains Mono` 400, 500, 700)**: Applied with `0.04em` letter-spacing (`--mono`) for size pills (`M`, `L`, `XL`, `XXL`), stock/availability labels (`Entrega inmediata`), and `Versión Jugador` / `Versión Fan` tags.

## 4. Component Stylings
- **Buttons:** High-contrast pill-shaped (`rounded-full`) or subtly rounded (`10px`, `--radius: 0.625rem`) controls. Primary CTAs use Sky Celeste (`#A8D6F0`) fill with Midnight Navy (`#0A1B33`) text; secondary actions use translucent navy with a `1px` cream hairline border (`rgba(245, 234, 214, 0.18)`).
- **Cards / Containers:**
  - Standard product cards use Card Slate Navy (`#102442`) with subtly rounded corners (`10px`) and crisp hairline borders (`rgba(245, 234, 214, 0.18)`).
  - Floating stage panels (`.glass-panel`) use generously rounded corners (`22px`), `20px` backdrop blur, inner top specular highlight (`rgba(245, 234, 214, 0.16)`), and deep diffused shadow (`0 24px 60px -28px rgba(0, 0, 0, 0.72)`).
- **Inputs / Forms:** Translucent dark fields with `1px` cream-tinted borders (`rgba(245, 234, 214, 0.22)`) and Ice Celeste (`#8ECBF5`) focus rings.
- **Navigation / Ticker Bar:** Floating pill-shaped header (`rounded-full`) anchored at the top with a `2px` bottom scroll-progress bar transitioning from `#A8D6F0` to `#8ECBF5`.

## 5. Layout Principles
- **Fluid Lateral Padding:** Consistent horizontal breathing room using `clamp(16px, 2.4vw, 36px)` (`--pad`) across mobile and desktop viewports.
- **Scroll Choreography & Layering:** Fixed 3D/WebGL jersey stage behind the opening hero and narrative chapters, transitioning cleanly into structured catalog grids and ordering sections.
- **Grid & Alignment:** Responsive multi-column grids for catalog cards (`M`, `L`, `XL` quick-filters) with strict vertical rhythm and `2px` `#A8D6F0` `:focus-visible` accessibility outlines on all interactive elements.
