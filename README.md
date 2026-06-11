# Doghouse Media

Marketing site for **Doghouse Media** — an independent, female-owned web & video
studio in Dublin. *Two crafts, one roof.* Built with [Astro](https://astro.build).

The homepage is a faithful recreation of the **Doghouse Media Design System**
handoff bundle (`ui_kits/homepage/index.html`), using its canonical design tokens.

## Design system

Tokens are ported verbatim from the design bundle into
[`src/styles/tokens/`](src/styles/tokens) and wired up in
[`src/styles/global.css`](src/styles/global.css).

**Colour** — warm, grounded, with two accents that signpost the two crafts:

| Token            | Hex       | Role                                   |
| ---------------- | --------- | -------------------------------------- |
| `--color-ink`    | `#0F1417` | Text, primary button, mark body        |
| `--color-cream`  | `#FAF7F0` | Page background (warm paper, not white) |
| `--color-red`    | `#BD1C30` | Film/video accent, hover, CTAs         |
| `--color-teal`   | `#2C6E7F` | Web accent, links                      |
| `--color-deep-teal` | `#15282E` | Film band background                |
| `--color-steel`  | `#7395A1` | Focus borders / rings                  |
| `--color-line`   | `#E5E1D8` | Borders, dividers                      |
| `--color-gray`   | `#9B9890` | Meta text, kickers                     |

**Type** — three families, distinct roles (Google Fonts):
`Inter Tight` (display) · `Inter` (body) · `JetBrains Mono` (kickers, tags, meta).

**Motion** — `rise` (scroll reveals), `drift` (marquee), `pulse` (play icon),
`punch` (hero word bounce), `headturn` + `earwag` (the hound mark). All respect
`prefers-reduced-motion`.

## Project structure

```text
public/assets/doghouse-mark.svg   The Doghouse hound mark (also the favicon)
src/
  styles/
    tokens/                        Canonical design tokens (colors, type, spacing, motion, fonts)
    global.css                     Imports tokens + recreates the homepage component styles
  layouts/Layout.astro             Base HTML shell + fonts/meta
  components/
    Mark.astro                     Hound mark (static for nav/footer, animated in hero)
    Nav.astro                      Sticky nav + logo lockup
    Footer.astro                   Footer with mark + contact meta
  pages/index.astro                Homepage: hero, trust marquee, service rooms,
                                   work grid, CTA band, contact form + reveal script
```

## Commands

| Command           | Action                               |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start dev server at `localhost:4321` |
| `npm run build`   | Build production site to `./dist/`   |
| `npm run preview` | Preview the production build locally |

## Notes

- **Fonts** are Google-hosted (the bundle shipped a Google Fonts `@import`, no local
  `.woff2` files). Drop in the real font files and swap to `@font-face` if desired.
- **Work imagery** uses the design's gradient placeholders — slot in real project
  photography when available.
- The full design-system bundle (component specs, guideline cards, brand readme) was
  read from the supplied handoff link and lives at
  `/tmp/dhm-design/doghouse-media-design-system/` if you need to reference more of it.
