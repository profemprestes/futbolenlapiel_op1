---
name: Fútbol en la Piel
colors:
  background: '#0A1B33'
  on-background: '#F5EAD6'
  surface: '#0A1B33'
  surface-dim: '#070F1C'
  surface-bright: '#132C52'
  surface-container-lowest: '#070F1C'
  surface-container-low: '#0D203B'
  surface-container: '#102442'
  surface-container-high: '#132C52'
  surface-container-highest: '#1E5AA8'
  surface-variant: '#132C52'
  on-surface: '#F5EAD6'
  on-surface-variant: '#B8C7DC'
  inverse-surface: '#F5EAD6'
  inverse-on-surface: '#0A1B33'
  outline: '#8ECBF5'
  outline-variant: 'rgba(245, 234, 214, 0.18)'
  surface-tint: '#A8D6F0'
  primary: '#A8D6F0'
  on-primary: '#0A1B33'
  primary-container: '#132C52'
  on-primary-container: '#F5EAD6'
  inverse-primary: '#1E5AA8'
  secondary: '#132C52'
  on-secondary: '#F5EAD6'
  secondary-container: '#102442'
  on-secondary-container: '#B8C7DC'
  tertiary: '#1E5AA8'
  on-tertiary: '#F5EAD6'
  error: '#DC2626'
  on-error: '#F5EAD6'
typography:
  display-lg:
    fontFamily: Barlow Condensed
    fontSize: 78px
    fontWeight: '900'
    lineHeight: 70px
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Barlow Condensed
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.015em
  brand-mark:
    fontFamily: Archivo Black
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.02em
  body-base:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-bold:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: '0'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
  stat-lg:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: 0.04em
rounded:
  sm: 0.375rem
  DEFAULT: 0.625rem
  md: 0.875rem
  lg: 1.375rem
  xl: 1.625rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 36px
---

# Design System: Fútbol en la Piel (@futbolenlapieluy1)

## 1. Visual Theme & Atmosphere

Extracted from `/src`, **Fútbol en la Piel** blends an editorial matchday-night showcase with a structured Uruguayan jersey catalog and WhatsApp inquiry workflow. The root canvas is grounded in deep nocturnal navy (**Midnight Field**, `#0A1B33`) with radial floodlight gradients and translucent frosted-navy glass panels (`rgba(10, 27, 51, 0.72)` with `backdrop-filter: blur(20px) saturate(1.35)`), alternating into warm parchment (**Warm Parchment**, `#F5EAD6`) for high-contrast editorial sections and footers.

Across secondary catalog and guide routes (`/tienda`, `/retros`, `/como-pedir`, `/camiseta/[slug]`), the system shifts into a clean, balanced storefront density (`5 / 10`) constrained to `1180px` (`max-w-[1400px]` ceiling), while the `/` flagship route uses high-variance (`8 / 10`) asymmetric scroll choreography and spring-physics motion (`stiffness: 100, damping: 20`) for 3D kit and emblem exploration.

---

## 2. Color Palette & Roles

### Primary Foundation
- **Midnight Field** (`#0A1B33`) — Primary dark background (`--field`, `--background`) and ink on light parchment sections (`--ink`).
- **Deep Pitch Shadow** (`#070F1C`) — Deepest off-black vignette edge and elevated dark backdrop (replaces raw `#000000` per strict anti-pure-black calibration).
- **Elevated Pitch Navy** (`#102442`) — Primary card container fill (`--card`) across catalog and guide pages.
- **Floodlight Navy** (`#132C52`) — Radial spotlight center (`--field-hi`), secondary surface (`--secondary`), and muted pill backgrounds (`--muted`).
- **Deep Glass Overlay** (`rgba(10, 27, 51, 0.72)`) — Frosted glass panels (`.glass-panel`) with `1px` warm parchment hairlines and inset top highlights.
- **Warm Parchment** (`#F5EAD6`) — Primary light text (`--foreground`, `--ice`) on dark surfaces and alternating light section background.

### Accent & Interactive
- **Celeste Sky** (`#A8D6F0`) — Single primary accent (`--primary`, `--ember`; saturation ~70.6%, below the 80% threshold) for primary CTA fills, active size/model rings, focus outlines, and price highlights.
- **Horizon Celeste** (`#8ECBF5`) — Secondary interactive outline (`--peri`, `--ring`) and subtle border tint (`rgba(142, 203, 245, 0.45)`).
- **Club Cobalt** (`#1E5AA8`) — Accent surface (`--azul`, `--accent`) and secondary interactive links on Warm Parchment (`#F5EAD6`) light chapters.

### Typography & Text Hierarchy
- **Parchment Ink** (`#F5EAD6`) — Primary headings, body copy, and active labels on dark navy surfaces.
- **Muted Slate Blue** (`#B8C7DC`) — Secondary descriptions, sizing notes, and quiet metadata (`--muted-foreground`).
- **Ink Navy** (`#0A1B33`) — Primary headings and body text on Warm Parchment (`#F5EAD6`) sections.

### Functional States
- **Whisper Border** (`rgba(245, 234, 214, 0.18)`) — Default 1px structural borders (`--border`) and section separators.
- **Input Hairline** (`rgba(245, 234, 214, 0.22)`) — Form field borders (`--input`) and glass panel edges.
- **Alert Crimson** (`#DC2626`) — Destructive and validation error state (`--destructive`), paired with inline `role="alert"` messages.

---

## 3. Typography Rules

### Hierarchy & Weights
- **Display (`Barlow Condensed`):** Weights `600`–`900`, tight tracking (`-0.025em` to `-0.03em`), line-height `0.88`–`1.08`, scaled fluidly with `clamp(40px, 6vw, 78px)` on interior `PageShell` headings and `clamp(48px, 11.8vw, 220px)` on `/` editorial chapter titles.
- **Brand Wordmark (`Archivo Black`):** Weight `400`, uppercase, slight positive tracking (`0.02em`), used exclusively for `FUTBOL EN LA PIEL` navbar marks and compact headers.
- **Body (`Geist`):** Weight `400`–`600`, relaxed leading (`1.45`–`1.6`), minimum `16px` (`1rem`) for primary copy and `14px` for compact metadata, constrained to `65ch` (`max-w-2xl`) for readability. *(Note: `Inter` is present in legacy `layout.tsx` but is banned for all new and Stitch-generated screens in favor of `Geist`.)*
- **Monospace (`JetBrains Mono`):** Weights `400`, `500`, `700`, `letter-spacing: 0.04em` (`.font-mono-cl`), used for prices (`$ 1.690`, `$ 1.990`), size pills (`S`–`XL`), drop/step indices (`01`–`04`), inquiry codes, and uppercase kickers.

### Spacing Principles
- 4px base unit (`--spacing-*`), fluid horizontal page gutter `--pad: clamp(16px, 2.4vw, 36px)`.
- Headings tighten letter-spacing as weight increases; body copy maintains neutral tracking and generous line-height.

---

## 4. Component Stylings

### Buttons
- **Shape:** Full pill (`rounded-full`) for primary CTAs, filter chips, and navbar actions; `rounded-lg` (`0.5rem`) for compact UI controls (`src/components/ui/button.tsx`).
- **Variants:**
  - *Primary:* **Celeste Sky** (`#A8D6F0`) fill with **Midnight Field** (`#0A1B33`) bold text, hovering to `#8ECBF5` with subtle `-1px` / `-2px` lift (`transition-colors` / `transition-all`). Zero neon outer glows.
  - *Outline / Secondary:* Transparent or **Floodlight Navy** (`#132C52`) fill with `1px` **Whisper Line** (`rgba(245, 234, 214, 0.22)`) border, brightening to **Celeste Sky** on hover.
  - *Ghost:* Transparent surface with `hover:bg-foreground/10` for navbar triggers and back links.
- **Touch Targets:** Minimum `44px` (`h-11` / `h-12`) on mobile primary actions and form submit buttons.

### Cards & Jersey Showcases
- **Standard Catalog Cards (`src/components/ui/card.tsx`):** **Elevated Pitch Navy** (`#102442`) fill, `rounded-xl` (`12px`), `1px` ring (`ring-foreground/10`), `--card-spacing: 1rem` (`16px`) internal padding, and `4:3` jersey preview frames.
- **Editorial Showcase Cards (`ModelosChapter`):** Generously rounded (`20px`–`26px`), radial **Floodlight Navy** (`#132C52` → `#0A1B33`) gradient fill, deep pitch shadow (`0 30px 70px -35px rgba(7, 15, 28, 0.78)`), and **Celeste Sky** (`#A8D6F0`) `3px` active ring when selected.
- **High-Density Lists & Specs:** Sizing guides, shipping zones, and order rules use `border-b` **Horizon Celeste** hairlines (`rgba(142, 203, 245, 0.4)`) and negative space rather than card boxes.

### Navigation
- **Floating Pill Navbar (`SiteNavbar`):** Fixed centered pill (`top: 12px`, `max-w-[1220px]`, `h-13` desktop / `h-12` mobile, `rounded-full`) with frosted glass (`backdrop-blur-[18px]`) and a `2px` **Celeste Sky** scroll-progress underline on `/`.
- **Desktop:** Inline `NavigationMenu` with dropdown mega-panel for `Tienda / Stock` categories.
- **Mobile (`< 1024px`):** Collapses to a right-side `Sheet` drawer (`w-[min(340px,88vw)]`) with icon-led links, secondary pill links, and a full-width WhatsApp CTA.

### Inputs & Forms
- **Structure:** Label stacked above input (`12px` semibold), `h-12` (`48px`) height on primary inquiry forms (`PedidoChapter`), `rounded-[14px]` (`0.875rem`) corners, translucent dark fill (`rgba(7, 15, 28, 0.45)`), and `1px` **Input Hairline** border.
- **Focus & Validation:** Focus transitions to **Warm Parchment** (`#F5EAD6`) border with a `3px` **Celeste Sky** ring (`rgba(168, 214, 240, 0.3)`). Inline validation errors render below the form in **Celeste Sky** / **Alert Crimson** with `role="alert"`.
- **Segmented Controls:** `2-column` pill switcher (`bg-[#070F1C]/40`, `rounded-2xl`) with **Warm Parchment** (`#F5EAD6`) active pill and **Midnight Field** (`#0A1B33`) text.

### Loaders & Empty States
- **Loaders:** Skeletal shimmer blocks matching card (`4:3`) and text-row dimensions; avoid generic circular spinners.
- **Empty States:** Clear message explaining no matching jerseys were found, paired with a filter-reset button and a direct WhatsApp custom-inquiry CTA.

---

## 5. Layout Principles

### Grid & Structure
- **Containment:** `PageShell` constrains interior routes to `w-[min(1180px,calc(100%-32px))]` centered (`max-width: 1400px` ceiling).
- **Grid-First:** CSS Grid (`grid-cols-1`, `md:grid-cols-2`, `lg:grid-cols-3` for catalog items, `1fr 1.25fr` asymmetric split for order rules + WhatsApp form). Avoid Flexbox `calc()` percentage math.
- **Hero Framing:** `min-height: 100dvh` (never `h-screen` alone) with corner-anchored brand kicker, 3D emblem, and interactive turntable occupying distinct non-overlapping zones.

### Whitespace Strategy
- Base 4px unit (`gap-3` `12px` inside forms, `gap-5` `20px` between cards, `gap-10` `40px` between page sections).
- Vertical section padding scales proportionally (`clamp(3rem, 8vw, 6rem)` / `py-[14vh]` on desktop).

### Alignment & Visual Balance
- Left-aligned editorial headers and body copy (`max-w-2xl` / `65ch`), with alternating right-aligned display statements on `/` chapter rows.
- Monospace numeric badges (`01`, `02`, `03`) anchor left margins of numbered rule lists.

### Responsive Behavior & Touch
- **Single-Column Collapse (`< 768px`):** All multi-column grids (`1fr 1.25fr`, 3-column/4-column grids) collapse to `grid-cols-1` with `overflow-x: clip` preventing horizontal scroll.
- **Touch Targets:** All buttons, size chips, and mobile nav items maintain `>= 44px` tap height on mobile.

---

## 6. Design System Notes for Stitch Generation

### Language to Use
- *"Matchday-night editorial football jersey storefront in deep Midnight Field navy (`#0A1B33`) and Warm Parchment cream (`#F5EAD6`), illuminated by a single restrained Celeste Sky (`#A8D6F0`) accent."*
- *"Frosted glass pill navigation and elevated dark navy kit cards with crisp 1px parchment hairlines and tabular JetBrains Mono pricing."*
- *"High-contrast editorial typography pairing condensed heavy Barlow Condensed headlines with clean Geist body copy."*

### Color References
- Background: **Midnight Field** (`#0A1B33`) / **Deep Pitch Shadow** (`#070F1C`)
- Elevated Card Surface: **Elevated Pitch Navy** (`#102442`) / **Floodlight Navy** (`#132C52`)
- Light Contrast Section: **Warm Parchment** (`#F5EAD6`) with **Ink Navy** (`#0A1B33`) text
- Single Primary Accent: **Celeste Sky** (`#A8D6F0`)
- Secondary Text: **Muted Slate Blue** (`#B8C7DC`)

### Component Prompts
- **Floating Pill Header:** *"Generate a floating full-pill top navigation bar on Midnight Field (`#0A1B33`) with frosted glass blur, Archivo Black wordmark on the left, clean Geist nav links in the center, and a Celeste Sky (`#A8D6F0`) pill CTA button on the right."*
- **Jersey Catalog Grid & Filter Bar:** *"Create a jersey catalog explorer on Midnight Field (`#0A1B33`) with a compact search input, pill category/size filters (`S`, `M`, `L`, `XL`), and Elevated Pitch Navy (`#102442`) product cards featuring `4:3` jersey imagery, Barlow Condensed titles, JetBrains Mono prices, and a Celeste Sky WhatsApp inquiry button."*
- **WhatsApp Inquiry Split Section:** *"Design an asymmetric 2-column order section (`1fr` rules list on the left with numbered Celeste Sky indices, `1.25fr` frosted glass inquiry form on the right) with stacked labels, 48px dark inputs, a 2-option segmented delivery toggle, and a full-width Celeste Sky pill submit button."*

### Incremental Iteration
- Start from the **Midnight Field** (`#0A1B33`) + **Warm Parchment** (`#F5EAD6`) contrast pair; introduce **Celeste Sky** (`#A8D6F0`) strictly on primary CTAs, active selections, and numeric callouts.
- When adapting `/tienda` or `/como-pedir`, keep `PageShell` (`1180px` max width) and replace any raw card grids for dense specs with `border-b` hairline rows.

---

## 7. Anti-Patterns (Banned)

- **NEVER** use emojis in UI labels, badges, buttons, or headings.
- **NEVER** use `Inter`, `Times New Roman`, `Georgia`, `Garamond`, or `Palatino`.
- **NEVER** use pure black (`#000000`) — use **Deep Pitch Shadow** (`#070F1C`) or **Midnight Field** (`#0A1B33`).
- **NEVER** add purple/blue AI neon gradients, outer button glows, or oversaturated (`>= 80%`) accents.
- **NEVER** use custom mouse cursors or overlap text over jersey photography.
- **NEVER** use generic 3-column equal-height feature card rows or centered hero blocks on high-variance editorial pages.
- **NEVER** include filler UI copy (`"Scroll to explore"`, `"Swipe down"`, `"LABEL // YEAR"`, `"Elevate"`, `"Seamless"`, `"Unleash"`).
- **NEVER** fabricate stock counts, metrics, or placeholder names (`"John Doe"`, `"Acme"`).
