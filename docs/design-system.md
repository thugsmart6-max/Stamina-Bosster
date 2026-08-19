# Design system — VitalityPath

**The Start structure, wellness palette.** Architectural grid, hairline rules, stacked wordmark, and a night footer. Colors stay oatmeal / berry / teal / gold from the product photos. Type: **[Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)** (display + English UI) — closest open stand-in for Neue Haas Grotesk. Hindi/Tamil use Noto Sans.

## Three styles

| Class | Use | Surface | Type |
|---|---|---|---|
| `.style-night` | Hero, award banner, footer | `#050505` | Paper-on-black, medium Grotesk |
| `.style-paper` | Works, pillars, how, forms | `#F7F4EE` | Night-on-oatmeal |
| `.style-field` | FAQ, testimonials | `#E8E2D6` | Slightly deeper paper |

Pillar columns also differ: **01 Move** berry + tight tracking, **02 Fuel** teal + light weight, **03 Recover** gold + semibold.

## Color tokens

| Token | Hex | Use |
|-------|-----|-----|
| night | `#050505` | Hero / footer |
| paper | `#F7F4EE` | Page base |
| field | `#E8E2D6` | FAQ / quotes |
| foreground | `#11100E` | Primary text |
| primary | `#C43C2C` | Berry — brand |
| accent | `#1A6B73` | Teal — CTAs |
| yellow | `#E8B84A` | Gold highlight |

## Typography

- **Space Grotesk** (400–600) — `.display-heading` at weight 500, large size, tight tracking
- Hindi: Noto Sans Devanagari · Tamil: Noto Sans Tamil
- Uppercase + wide tracking for small labels and footer links only

## Components

- `.start-pill` — outlined capsule (Ask / Menu / Submit invert on night)
- `.start-grid` / `.start-cell` — 1px architectural grid
- `.footer-link` — uppercase night-footer rows
- `BrandWordmark` — stacked VITALITY / PATH

## PDF report

The generated PDF (`src/lib/pdf/`) uses the same language as the site: night cover (`#050505`) with stacked VITALITY / PATH, paper interiors (`#F7F4EE`), 0.75pt hairline grids, numbered sections (Move berry / Fuel teal / Recover gold), and a hairline footer with page `01 / 09`. English PDFs use Space Grotesk; Hindi/Tamil keep Noto. Preview PDFs add a PREVIEW watermark. Recover is one page: sample day, timeline, and a compact four-week log — no leftover tracker page.
