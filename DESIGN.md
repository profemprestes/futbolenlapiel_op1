# Design System: Fútbol en la Piel (@futbolenlapieluy1)

## 1. Visual Theme & Atmosphere

An editorial, tactile football-culture storefront crafted for Uruguayan jersey collectors and fans. The atmosphere is **matchday-night confident and gallery-calibrated** — deep nocturnal navy surfaces paired with warm parchment cream and a single restrained Celeste sky accent, evoking floodlit stadium concrete, stitched kit numbers, and vintage match programs.

- **Density:** Daily App Balanced (`5 / 10`) — generous breathing room around hero kit photography and 3D emblems, paired with crisp, structured rows for sizes (`S`–`XL`), versions (`Jugador` / `Fan` / `Retro`), and delivery zones.
- **Variance:** Offset Asymmetric (`8 / 10`) — editorial split-screen and staggered chapter compositions rather than symmetrical SaaS templates.
- **Motion:** Fluid Choreography (`7 / 10`) — weighty spring physics (`stiffness: 100, damping: 20`), subtle perpetual micro-motion on active showcase elements, and hardware-accelerated transforms (`transform` and `opacity` only), always respecting `prefers-reduced-motion: reduce`.

---

## 2. Color Palette & Roles

Stick to this single calibrated palette across all surfaces. Never introduce pure black (`#000000`), purple/blue neon glows, or competing accent hues.

- **Midnight Field** (`#0A1B33`) — Primary dark background canvas and foundational page surface.
- **Deep Pitch Shadow** (`#070F1C`) — Deepest off-black surface for elevated dark overlays, navigation backdrops, and vignette edges (replaces pure `#000000`).
- **Floodlight Navy** (`#132C52`) — Secondary elevated card fill, subtle surface stepping, and interactive hover containers.
- **Warm Parchment** (`#F5EAD6`) — Primary light ink on dark surfaces and alternating editorial light-chapter background.
- **Ink Navy** (`#0A1B33`) — Primary dark ink when rendered on Warm Parchment (`#F5EAD6`) light chapters.
- **Muted Slate Blue** (`#B8C7DC`) — Secondary body text, descriptions, sizing notes, and quiet metadata on dark surfaces.
- **Whisper Line** (`rgba(245, 234, 214, 0.18)`) — 1px structural borders, table row hairlines, and subtle container dividers.
- **Celeste Sky** (`#A8D6F0`) — Single primary accent (saturation ~70.6%, below the 80% ceiling) reserved exclusively for primary CTAs, active size/model selection states, focus rings, and key numeric highlights.

---

## 3. Typography Rules

- **Display:** `Barlow Condensed` (weights `600`–`900`) paired with `Archivo Black` for compact brand marks — Track-tight (`-0.025em` to `-0.03em`), controlled scale via `clamp(2.25rem, 6vw, 4.875rem)`, hierarchy driven by weight contrast and color rather than raw size alone.
- **Body:** `Geist` (`--font-sans`) — Relaxed leading (`1.5`–`1.6`), minimum `1rem` (`16px`) for primary copy (`14px` minimum for secondary metadata), constrained to `65ch` max-width for comfortable reading.
- **Mono:** `JetBrains Mono` — Tabular precision for jersey prices (`$ 1.690`, `$ 1.990`), size codes (`S`–`XL`), drop/catalog numbers (`01`–`04`), inquiry IDs, and department shipping metadata.
- **Banned:** `Inter`, generic system defaults as primary display/body, and generic serifs (`Times New Roman`, `Georgia`, `Garamond`, `Palatino`). Serifs are banned across all catalog, filter, and order-form UI.

---

## 4. Component Stylings

- **Buttons:** Tactile, flat surfaces with zero neon outer glows and `-1px` vertical press feedback on `:active`. Primary actions use **Celeste Sky** (`#A8D6F0`) fill with **Midnight Field** (`#0A1B33`) text; secondary actions use crisp `1px` **Whisper Line** (`rgba(245, 234, 214, 0.22)`) outlines with transparent fills. Minimum `44px` (`2.75rem`) touch target height on mobile.
- **Cards:** Use generously rounded corners (`1.5rem` / `24px`) and deep pitch-tinted shadows (`0 24px 60px -28px rgba(7, 15, 28, 0.75)`) only when elevation communicates hierarchy (featured kits, inquiry panel). For dense catalog listings, sizing tables, or FAQ/shipping specs, prefer `border-top` / `border-bottom` hairlines and negative space over card grids.
- **Inputs & Forms:** Always place the field label above the input (`12px` uppercase or semibold tracking), helper text optional, and inline error feedback directly below. Focus rings use `2px` **Celeste Sky** (`#A8D6F0`) with `3px` offset. No floating placeholder-only labels.
- **Loaders:** Skeletal shimmer blocks matching the exact aspect ratio (`4:3` for jersey cards, `1:1` for emblems) and layout dimensions — never generic circular spinners.
- **Empty States:** Composed, helpful fallback views (e.g., when a catalog filter returns zero kits) offering a clear reset action and direct WhatsApp custom-request link.
- **Error States:** High-contrast inline validation messages anchored to the offending field with `aria-invalid` and `role="alert"`.

---

## 5. Layout Principles

- **Grid-First Architecture:** Use CSS Grid for all multi-column structures and `max-width: 1400px` centered page containment (`clamp(16px, 2.4vw, 36px)` horizontal gutter). Never use Flexbox `calc()` percentage hacks.
- **Asymmetric Hero:** Centered generic hero blocks are banned. Use an asymmetric split or corner-anchored editorial frame (`min-height: 100dvh`, never `h-screen`) with clean spatial separation — text must never overlap jersey photography or 3D canvases.
- **No 3-Column Equal Feature Grids:** Replace generic 3-equal-card rows with asymmetric 2-column splits, staggered zig-zag chapters, or horizontal scroll tracks on showcase sections.
- **Responsive Collapse (`< 768px`):** Every multi-column grid collapses cleanly to a single column below `768px`, with zero horizontal overflow (`overflow-x: clip`), `clamp()`-scaled headings, and vertical section spacing scaling proportionally (`clamp(3rem, 8vw, 6rem)`).

---

## 6. Motion & Interaction

- **Spring Physics:** Default interactive spring `stiffness: 100, damping: 20` for weighty, physical kit transitions and drawer/panel reveals. No linear easing on UI motion.
- **Perpetual Micro-Interactions:** Subtle idle sway on the 3D kit turntable and gentle ambient shimmer on active status indicators, automatically paused when `prefers-reduced-motion: reduce` is active.
- **Staggered Orchestration:** Catalog items, category pills, and order steps enter with short staggered cascade delays (`40ms`–`60ms` per item) rather than mounting abruptly.
- **Performance:** Animate exclusively via `transform` and `opacity` (never `top`, `left`, `width`, or `height`). Isolate Three.js / WebGL2 stages in dedicated Client Components (`ssr: false` where appropriate) and keep grain/noise overlays on fixed pseudo-elements.

---

## 7. Anti-Patterns (Banned)

- **NEVER** use emojis anywhere in UI chrome, badges, buttons, or headings.
- **NEVER** use `Inter`, `Times New Roman`, `Georgia`, `Garamond`, or `Palatino`.
- **NEVER** use pure black (`#000000`) — always use **Deep Pitch Shadow** (`#070F1C`) or **Midnight Field** (`#0A1B33`).
- **NEVER** add purple/blue AI neon gradients, outer button glows, or oversaturated (`>= 80%`) accents.
- **NEVER** use custom mouse cursors.
- **NEVER** overlap text over images or stack unrelated absolute elements in the same visual zone.
- **NEVER** use a generic 3-column equal-height card row or a centered Hero layout.
- **NEVER** include filler UI copy like `"Scroll to explore"`, `"Swipe down"`, bouncing scroll chevrons, or `"LABEL // YEAR"` formatting.
- **NEVER** fabricate metrics, stock counts, uptime percentages, or placeholder names (`"John Doe"`, `"Acme"`, `"Nexus"`). Use real catalog data or explicit `[metric]` placeholders.
- **NEVER** use AI copywriting clichés (`"Elevate"`, `"Seamless"`, `"Unleash"`, `"Next-Gen"`).
