# Doghouse Media — Astro Build Spec

**Reference:** https://fabrica.framer.media/ (Fabrica® Studio, a paid Framer template)
**Target:** doghousemedia.ie — Astro static site
**Captured:** 14 Aug 2026, Chrome @ 1619px viewport
**Status:** Structure + motion spec. Branding tokens land later.

---

## 0. How to read this

This is a **structural and motion spec**, not a copy-paste clone. What's documented is the layout system, the component anatomy, the motion vocabulary and the measurements behind them. All copy, imagery, iconography and the wordmark come from Doghouse.

One thing to flag before we build: Fabrica is a commercial Framer template ($129). Its layout ideas and interaction patterns are fair game to learn from, the way any studio site is. Its actual assets, copy, photography and the specific wordmark treatment are not. Everything below is written so the build is a Doghouse site that *works the way that one works*, not a re-skin of their file.

---

## 1. Page map

| Route | Purpose | Notes |
|---|---|---|
| `/` | Home — the long-scroll marketing page | 13 sections, ~17,400px tall at desktop |
| `/studio` | About / team / process | |
| `/projects` | Work index | Collection listing |
| `/projects/[slug]` | Case study | Reference has 6 |
| `/blog` | Journal index | |
| `/blog/[slug]` | Article | |
| `/contact` | Contact + form | |
| `/legal/privacy-policy` | | |
| `/legal/terms-of-service` | | |

Nav is 5 items: brand mark (left), then Studio / Projects / Blog / Contact spread across the bar, plus a hamburger at the far right that opens a fuller menu. The "Projects" item carries a small superscript count (e.g. `27`) — a nice detail, easy to generate from the content collection length.

---

## 2. Layout system

The whole site sits on one grid. Get this right first and the sections fall out of it.

```
Page horizontal padding : 36px  (desktop)
Container max-width     : 1520px, centred
Grid                    : 4 columns, 4px gutter
Column width            : fluid — (container - 12px) / 4
Half-width variant      : 2 columns, 4px gutter (758px each at max width)
Section vertical rhythm : 200px top/bottom on panelled sections
```

The **4px gutter** is the signature. Cards sit almost flush against each other — it reads as a single sheet cut into pieces rather than a set of floating cards. Don't be tempted to open it up to 24px; the tightness is the look.

### Breakpoints

Three, straight from the reference's media queries:

```
Desktop : ≥ 1200px
Tablet  : 810px – 1199.98px
Mobile  : ≤ 809.98px
```

Suggested Astro-side custom properties:

```css
:root {
  --page-pad: 36px;
  --container: 1520px;
  --gutter: 4px;
  --section-pad: 200px;
}
@media (max-width: 1199.98px) { :root { --page-pad: 24px; --section-pad: 140px; } }
@media (max-width: 809.98px)  { :root { --page-pad: 16px; --section-pad: 96px; } }
```

---

## 3. Design tokens

### Colour

The reference runs a three-value palette. That's it — no accent colour anywhere.

| Token | Value | Used for |
|---|---|---|
| `--paper` | `#f5f5f5` | Page background |
| `--ink` | `#0a0a0a` | Dark panels, dark buttons, body text on paper |
| `--white` | `#ffffff` | Cards on paper, text on ink, primary buttons |
| (root) | `#121212` | `body` background behind everything — only visible in overscroll |

Doghouse tokens will slot straight into these three roles. **Question for you: does the Doghouse palette have an accent, and do you want it introduced here?** The reference's restraint is doing a lot of the heavy lifting — if we add a brand colour it should be surgical (one button state, one underline) rather than sprayed around.

### Typography

Two families loaded: **Geist** and **Inter**. Everything visible on the page renders in **Inter** — Geist appears to be loaded but barely used, so treat Inter as the working typeface and drop Geist unless Doghouse's guidelines say otherwise.

Only two weights: **500 (medium)** and **600 (semibold)**. No light, no bold, no italics.

Negative letter-spacing scales with size and is applied *everywhere* — roughly **-0.04em** flat across body sizes, tightening to **-0.06em / -0.07em** at display sizes. This is the single biggest reason the type feels designed rather than default.

| Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Display XL (hero wordmark) | 144px | 600 | 0.92 | -0.06em |
| Display L (stat numerals) | 85px | 600 | 1.0 | -0.07em |
| Section heading | 60px | 600 | 1.1 | -0.06em |
| Sub-heading | 38px | 600 | 1.1 | -0.04em |
| Large body / pull quote | 30px | 500 | 1.2 | -0.04em |
| Body L | 22px | 500 | 1.2 | -0.04em |
| Body | 18px | 500/600 | 1.3 | -0.04em |
| Body S | 16px | 500 | 1.4 | -0.04em |
| Meta / labels | 12–14px | 500/600 | 1.1–1.3 | -0.04em |
| Micro (section index e.g. `(001)`) | 10–12px | 600 | 1.1 | -0.05em |

Scale suggestion for the build: use `clamp()` on the three display sizes so they collapse cleanly on mobile rather than needing separate breakpoint rules.

```css
--fs-display-xl: clamp(56px, 9vw, 144px);
--fs-display-l:  clamp(44px, 5.5vw, 85px);
--fs-heading:    clamp(34px, 4vw, 60px);
```

### Radii

| Value | Where |
|---|---|
| `50px` | Pills — every button, tag and chip (80 instances) |
| `18px` | Large panels and section cards (48) |
| `14px` | Media inside cards |
| `12px` / `11px` | Small cards, nested blocks |
| `7px` | Micro elements, badges |
| `100%` | Avatars, icon circles |

Two-tier rule: **containers get 18px, things you click get 50px.** Nested media steps down to 14px so the inner corner reads concentric with the outer one.

### Texture

Every dark panel carries a **noise/grain overlay at 5% opacity**, tiled PNG, normal blend mode. It stops the large black areas going flat and dead. Cheap to replicate — a small tiling noise PNG (or an inline SVG `feTurbulence`) as a `::after` on the panel:

```css
.panel-dark::after {
  content: "";
  position: absolute; inset: 0;
  background-image: url("/noise.png");
  background-repeat: repeat;
  opacity: 0.05;
  pointer-events: none;
}
```

We'll need to generate our own noise tile. Trivial — 200×200px, monochrome, seamless.

---

## 4. Global chrome

### 4.1 Preloader

On first load the page holds on a full-viewport `#0a0a0a` cover with the wordmark centred, then lifts. Fixed, `z-index: 9999`.

- Duration: roughly 1.2–1.8s before reveal
- The wordmark fades/scales in, then the whole cover clears
- **Must** be skippable and must respect `prefers-reduced-motion`
- **Must not** block LCP for real users — gate it to first visit only (`sessionStorage`), and make sure the hero is painted underneath so a bailout is instant

Honest note: this is the one pattern I'd push back on. It's a 1.5s tax on every visitor for a studio site that's meant to sell speed. Worth a conversation — my instinct is a 600ms wordmark wipe rather than a full hold.

### 4.2 Navigation

```
position   : fixed
height     : 60px
z-index    : 9
background : transparent (no blur, no fill)
link colour: transitions over 0.2s cubic-bezier(0.44, 0, 0.56, 1)
```

Because the bar is transparent, the nav link colour has to **invert as dark panels scroll under it** — light text over the dark sections, dark text over paper. In Astro this is an IntersectionObserver watching each dark panel against the 60px nav band and toggling a class on the header. Roughly 15 lines of vanilla JS, no framework needed.

Hamburger at the far right opens a full menu overlay (the reference has a 4-column "Desktop open / Desktop closed" grid variant for it).

### 4.3 Footer

Full-bleed paper panel, 200px vertical padding. Three-part structure:

1. **Contact block** — heading, short pitch, three "what happens next" columns, a form or a booking card with a named person + photo + CTA pill
2. **Link columns** — nav links / social links, with a small `↗` glyph on external links
3. **Giant wordmark** — the brand mark set enormous, near-full-width, as the visual sign-off
4. **Legal bar** — dark strip, copyright left, policy links centre, credit right

The giant wordmark at the bottom is the strongest single idea in the footer and translates perfectly to the Doghouse hound mark.

---

## 5. Section anatomy

Heights below are as measured at 1619px wide. They're a guide to proportion, not targets to hit.

### 5.1 Hero — `~1130px`

Split into a **First screen** block (745px, paper background, 61px top offset for the nav) and a **Clients** strip (263px).

Layout:
- Full-bleed dark media panel, 18px radius, inset 4px from the container edges
- Giant wordmark overlaid at 144px, sitting left and bleeding wide
- A secondary word ("Studio" in the reference — for us, likely the discipline line) sits right-aligned, one line down
- **Service list** top-right, 4 items stacked, 18px, no bullets — reads as a menu not a list
- **Positioning statement** bottom-left, ~30px, using a two-tone treatment: first sentence in full-strength ink, the remainder dropped to ~50% opacity. Very effective, very cheap.
- **Copyright line** bottom-centre, 12px
- **Person card** bottom-right — floating white card, 18px radius, containing a headshot (14px radius), role + company, name at 18–22px, and a dark pill CTA. This is a lovely trust device: a real human, named, ready to talk.
- Small `+` crosshair marks at grid intersections across the panel — pure decoration, sells the "designed on a grid" idea

Clients strip below: a 6-column logo grid (250px columns, 4px gap), logos at low opacity.

**Doghouse mapping:** wordmark → Doghouse logotype / hound. Service list → Web Development, Digital Solutions, AI Automation, Video Production. Person card → you or Emma with a "Let's talk" pill.

### 5.2 Projects — `~2140px`

- **Header row**: eyebrow left (`Our clients (2016-25©)`-style meta), big heading (`Projects.` at 60px, note the full stop — it's used on every section heading), count badge, year stamp, and an intro paragraph
- **Project cards**: full-width `<a>` blocks, 617px tall, 18px radius, stacked vertically with 4px gaps
- Each card = a title bar strip (project name + `/ year` + a three-dot glyph on the right, mimicking a browser chrome bar) sitting above a large image panel with the client logo centred over it
- Cards are entirely clickable, hover lifts/scales the image inside its mask

The browser-chrome title bar on each card is a smart touch — it frames the work as "a website" without needing a device mockup.

### 5.3 Advantages — `~940px`

Two-tone scroll-linked paragraph. Text starts at ~40% opacity and resolves to full ink **word by word as it scrolls through the viewport**. Set right of centre, ~30px, 3–4 lines.

Alongside: an image panel and stat cards with **count-up numerals** (the DOM shows `0` placeholders that animate to their final value on entry). Stats are laid out as: giant numeral (85px), a `(01)` index label, then a label + one-line explainer.

**Implementation:** scroll-linked word reveal is the trickiest thing on the page. Two options — CSS `animation-timeline: view()` (clean, no JS, Chrome/Edge only right now), or a small IntersectionObserver + `scroll` handler splitting the text into `<span>`s. Recommend building the JS version with the CSS version as progressive enhancement.

### 5.4 Services — `~1245px` (paper bg, 200px padding)

A dark 18px-radius panel sitting on paper, full container width.

- Eyebrow `What we do`, heading `Services.`, count `(4)`
- **Accordion list**: 4 rows, each with a `(00n)` index in a left rail, service title at ~38px, and a `+` button in a circle on the right
- Expanded state reveals: description paragraph, a `Categories` label, then category chips, plus a `6+` counter and a repeated service title
- Hairline divider between rows, very low opacity white
- White pill CTA below the list

Accordion should be `<details>`/`<summary>` under the hood for accessibility, styled to hide the native marker, with the `+` rotating 45° to become `×` on open. Height transition via grid-template-rows `0fr → 1fr` (the modern trick that avoids measuring).

### 5.5 Showreel — `~1470px`

- Heading block: `About us` eyebrow, brand mark, a question-style heading, supporting paragraph
- **Numbered process list**: 4 items, `01`–`04`, each a short single-line promise
- **Video panel**: full-width, 18px radius, black-and-white grainy still with a `Watch showreel` control. Modal or inline play.

Given Emma's side of the business, this section is arguably the most valuable one on the page for us — it's where the video work gets to be the hero.

### 5.6 Testimonials — `~910px`

- Header with rating (`4.9 /5`), project count, `Trusted by clients worldwide`, and a `Leave a review` pill
- Three testimonial cards: quote, name, company/role
- Below: a 4-across stat row with count-up numerals (impressions, projects, satisfaction, traffic)

### 5.7 Text — `~560px`

Pure typographic interlude. Brand mark, one strong statement at ~38px, two supporting paragraphs at ~18–22px. No imagery. Gives the eye a rest between the two heaviest sections.

### 5.8 Bento — `~600px`

Case-study highlight in a mixed-size grid: labels (`Case study`, discipline tags), a `Live website` link, a headline split across lines with one line emphasised, hard metrics as before/after pairs (`4.2% → 5.9%`), a pull quote with attribution, a `100` PageSpeed score tile, and a small **bar chart** of monthly visits (6 bars, month labels, `+30%` delta).

The bar chart is static data rendered as divs — no charting library needed.

### 5.9 Pricing — `~1450px` (paper bg, 200px padding)

Dark panel again.

- `Simple pricing` eyebrow, `Pricing.` heading
- **Toggle**: `Per project` / `Monthly` — a pill switch that swaps the price and the feature list
- Price card: an add-on price (`+$1,490`) with its own toggle switch, the main price at display size, `/project` suffix, then a feature list, a `Delivery time` row with a rule under it, and a full-width white pill CTA
- Below: `Looking for more?` with a two-tone scroll-reveal paragraph (same treatment as 5.3), and a second person card

**Question for you: are we publishing prices?** The reference is very committed to it. It's a strong differentiator if we're comfortable, and a weak generic section if we're not. If not, this slot is better used as a "how we work / engagement models" block.

### 5.10 Team — `~740px`

- Heading + `Be part of our mission` recruitment block with an `Apply now` pill
- Intro paragraph
- Person cards: photo, role, `at [brand]`, name, one-line bio

With two of us, this becomes a two-card block rather than four — which is fine, and arguably more honest for an independent studio.

### 5.11 FAQ — `~540px`

`FAQ.` heading, intro line, then 6 accordion rows. Same accordion mechanics as Services (5.4). Mark these up with FAQPage schema — free rich-result eligibility.

### 5.12 Blog — `~770px`

- Heading, intro, `See all` pill
- Two post cards: date, title at ~22px, excerpt, image
- A large brand-mark statement block alongside (`What's new in digital?` in the reference)

Driven by an Astro content collection.

### 5.13 Contact / Footer — `~1145px` (paper bg, 200px padding)

Covered in 4.3.

---

## 6. Motion catalogue

Every animation on the page, and how to build it without Framer.

| # | Effect | Where | Implementation |
|---|---|---|---|
| M1 | Preload cover + wordmark reveal | Page load | CSS keyframes on a fixed overlay, removed on `animationend`. Gate to first visit. |
| M2 | Blur-in + fade-up on entry | Every section | IntersectionObserver adds `.in-view`; CSS transitions `opacity 0→1`, `filter: blur(12px)→none`, `translateY(24px)→0`. Stagger children with `--i` and `transition-delay: calc(var(--i) * 60ms)`. **This is the dominant effect on the whole site.** |
| M3 | Scroll-linked word-by-word text resolve | Advantages, Pricing outro | Split text to spans; drive opacity from scroll progress. `animation-timeline: view()` where supported, IntersectionObserver + rAF fallback. |
| M4 | Count-up numerals | Stats, testimonials | `requestAnimationFrame` easing from 0 to target on first entry. Respect reduced motion by jumping straight to the value. |
| M5 | Nav link colour inversion | Global nav | IntersectionObserver on dark panels vs the 60px nav band, toggles a class. Transition `color 0.2s cubic-bezier(0.44, 0, 0.56, 1)`. |
| M6 | Button label swap on hover | All pills | Each button contains the label **twice**; on hover the stack translates `-100%` so the second copy slides up into place. Overflow hidden on the pill. Duplicate text must be `aria-hidden`. |
| M7 | Accordion expand | Services, FAQ | `<details>` + `grid-template-rows: 0fr → 1fr`, `+` icon rotates 45°. |
| M8 | Image scale on card hover | Project cards | `transform: scale(1.03)` on the img inside an `overflow: hidden` 14px-radius mask, ~0.5s ease-out. |
| M9 | Pricing toggle | Pricing | Class swap + crossfade on the price node; the knob translates across the track. |
| M10 | Logo strip | Clients | Static 6-col grid in the reference. If we want it moving, a CSS-only marquee (duplicated track, `translateX(-50%)` linear infinite) is a 10-line addition. |

### Motion tokens

```css
--ease-standard: cubic-bezier(0.44, 0, 0.56, 1);  /* lifted from the reference */
--ease-out:      cubic-bezier(0.16, 1, 0.3, 1);
--dur-fast:   0.2s;
--dur-base:   0.4s;
--dur-slow:   0.8s;
--stagger:    60ms;
```

### Reduced motion

Non-negotiable, and quick:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Plus: skip the preloader, jump counters to final values, render all reveal content in its final state.

---

## 7. Astro architecture

Nothing here needs a UI framework. Every effect above is vanilla JS or pure CSS, so the site can ship with **zero client-side framework JS**.

```
new-doghousemedia/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── noise.png
│   ├── fonts/
│   └── favicon/
└── src/
    ├── content/
    │   ├── config.ts
    │   ├── projects/          # md/mdx per case study
    │   ├── posts/             # md/mdx per article
    │   ├── services/
    │   ├── team/
    │   ├── testimonials/
    │   └── faqs/
    ├── layouts/
    │   ├── Base.astro          # head, fonts, seo, preloader, nav, footer
    │   └── Article.astro
    ├── components/
    │   ├── ui/
    │   │   ├── Pill.astro          # M6 double-label button
    │   │   ├── Panel.astro         # 18px radius + noise overlay
    │   │   ├── Accordion.astro     # M7
    │   │   ├── CountUp.astro       # M4
    │   │   ├── RevealText.astro    # M3
    │   │   ├── Reveal.astro        # M2 wrapper
    │   │   ├── PersonCard.astro
    │   │   └── SectionHeader.astro # eyebrow + heading + index + meta
    │   ├── sections/
    │   │   ├── Hero.astro
    │   │   ├── ClientLogos.astro
    │   │   ├── Projects.astro
    │   │   ├── Advantages.astro
    │   │   ├── Services.astro
    │   │   ├── Showreel.astro
    │   │   ├── Testimonials.astro
    │   │   ├── TextBreak.astro
    │   │   ├── Bento.astro
    │   │   ├── Pricing.astro
    │   │   ├── Team.astro
    │   │   ├── Faq.astro
    │   │   └── BlogTeaser.astro
    │   ├── Nav.astro
    │   ├── Footer.astro
    │   └── Preloader.astro
    ├── scripts/
    │   ├── reveal.ts       # M2 observer
    │   ├── nav-invert.ts   # M5
    │   ├── countup.ts      # M4
    │   └── text-resolve.ts # M3
    ├── styles/
    │   ├── tokens.css      # section 3
    │   ├── base.css        # reset, type, grid
    │   └── motion.css      # section 6
    └── pages/
        ├── index.astro
        ├── studio.astro
        ├── projects/index.astro
        ├── projects/[slug].astro
        ├── blog/index.astro
        ├── blog/[slug].astro
        ├── contact.astro
        └── legal/[slug].astro
```

### Dependencies

Deliberately thin:

- `astro`
- `@astrojs/sitemap`
- `@astrojs/mdx`
- `sharp` (image optimisation — comes with Astro's `<Image />`)
- Optionally `astro-seo` for meta, though hand-rolling is fine

No Tailwind unless you want it — the token set is small enough that plain CSS with custom properties is cleaner here and keeps the CSS bundle tiny. Say the word if you'd rather have Tailwind and I'll rewrite section 3 as a config.

### Content collection shapes

```ts
projects:  { title, client, year, slug, summary, cover, logo,
             services[], liveUrl?, metrics[], quote?, gallery[], order }
posts:     { title, date, excerpt, cover, tags[], author, draft }
services:  { index, title, description, categories[], order }
team:      { name, role, company, bio, photo, order }
testimonials: { name, company, role, quote, rating }
faqs:      { question, answer, order }
```

---

## 8. Assets we need

| Asset | Notes |
|---|---|
| Doghouse logotype / hound mark | SVG, needs to work at 144px+ and as the giant footer mark |
| Noise tile | I'll generate — 200×200 seamless mono PNG |
| Hero media | Full-bleed, works in black & white, grainy. The reference's crowd/texture shot sets a mood — we need our own equivalent |
| Project covers | 6+ case studies, consistent crop |
| Client logos | Monochrome SVGs for the strip |
| Headshots | You and Emma, consistent lighting/crop |
| Showreel | Video file or Vimeo/YouTube ID + a poster still |
| Inter | Self-host via `@fontsource-variable/inter` — weights 500 and 600 only |

---

## 9. Performance & accessibility budget

The site sells web development. It has to score well.

- Target Lighthouse 95+ across the board; the reference literally advertises "100 PageSpeed score" so this is table stakes
- Self-host fonts, `font-display: swap`, subset to Latin
- All images through Astro `<Image />`, AVIF/WebP, explicit dimensions to kill CLS
- Hero image `fetchpriority="high"`, everything below the fold lazy
- Preloader must not delay LCP — see 4.1
- Total JS budget: **under 15KB** uncompressed. Everything in section 6 fits comfortably.
- Semantic landmarks, real `<details>` for accordions, visible focus rings on the pills, `aria-hidden` on the duplicated button labels, alt text on every image
- Colour contrast: `#0a0a0a` on `#f5f5f5` is fine; watch the low-opacity secondary text in the two-tone paragraphs — the "unresolved" state must still clear 4.5:1 or be marked decorative

---

## 10. Build order

1. Scaffold Astro, tokens, base CSS, grid primitives
2. `Base.astro` + Nav + Footer + Preloader
3. `Panel`, `Pill`, `SectionHeader`, `Reveal` — the four primitives everything else uses
4. Hero
5. Projects + content collection
6. Services accordion
7. Remaining home sections in order
8. Inner pages
9. Motion pass — M3, M4, M5 wired up
10. Performance + a11y pass, Lighthouse, reduced-motion check

---

## 11. Things I need from you

1. **Branding guidelines** — colours, type, the hound mark in SVG, any motion rules already defined
2. **Accent colour?** Does the Doghouse palette introduce one, and do we use it (see §3)
3. **Pricing** — publish real numbers, or replace §5.9 with an engagement-models block
4. **Tailwind or plain CSS** — my lean is plain CSS with custom properties, but happy either way
5. **Preloader** — full 1.5s hold, shortened wipe, or skip it (see §4.1)
6. **Section list** — the reference runs 13. Which do we actually want? My cut would be: Hero, Clients, Projects, Services, Showreel, Advantages/Stats, Testimonials, Bento case study, Team, FAQ, Blog, Contact. That drops the Text interlude and Pricing.
7. **Content inventory** — how many case studies are ready to publish, and do we have the imagery
8. **Video** — is there a current showreel, or does Emma need to cut one for this
9. **Forms** — where should the contact form post? Netlify/Cloudflare forms, or something into your existing stack
10. **Hosting** — Cloudways as usual, or is a static host (Netlify/Cloudflare Pages) on the table for this one given it's Astro
