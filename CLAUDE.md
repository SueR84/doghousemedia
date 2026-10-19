# Doghouse Media website (Astro)

Rebuild of doghousemedia.ie. Independent two-person video and web studio in Dublin, founded 2013.

## The two governing documents

| File | Governs |
|---|---|
| `MESSAGING-PLAN.md` | Positioning, audience, page map, nav, copy, register, case studies, blog, what each page says |
| `PIPELY-FORK.md` | Layout system, design tokens, section anatomy, motion, component architecture |

**Where they disagree, `MESSAGING-PLAN.md` wins on what the site says and which pages exist. `PIPELY-FORK.md` wins on how it looks and moves.**

`BUILD-SPEC.md` is **reference only**. It was written first from a Framer reference (Fabrica) before the content decisions were made and before the Pipely direction was chosen. Do not build from it. Read it only for background on measurements and motion vocabulary that Pipely does not cover.

## The build direction

Pipely is the build. That means:

- Panel-on-ground structure. A warm grey ground (`--pl-ground` `#E5E1D8`, the brand Line colour) with rounded panels floating on top, 1.25rem apart, inset from the page edges. Nav is a panel, footer is a panel, every section is a panel. No shadows. Depth comes from the three-step surface stack: ground, white panels, cream cards.
- `pl-` class prefix, `--pl-` token prefix, CSS in `src/styles/pipely/`.
- Motion ported from the template's IX2 data, not eyeballed. The numbers in PIPELY-FORK are the spec, including the 0.09 lerp on the sticky horizontal scroll.
- Buttons follow the brand pack: Ink background, Cream text, hovers to **Red**. Red is the hover accent, not the resting colour.

## Current state, 11 September 2026

The fork has been promoted. `/pipely` no longer exists as a route.

- `src/layouts/Site.astro` is the site layout. It loads `styles/pipely/index.css`, the six-item nav, the footer and the motion engine. The old Fabrica layout, components, scripts and styles are archived under `_to_delete/`.
- Live routes: `/`, `/work/`, `/work/[slug]`, `/video-production/`, `/web-development/`, `/accessibility-audits/`, `/care-and-hosting/`, `/about/`, `/blog/`, `/blog/[slug]`, `/contact/`, `/accessibility/`, `/privacy/`.
- The sitemap filter is gone from `astro.config.mjs` and no page carries `noindex`.
- `src/components/sections/PillarBlock.astro` is the only non-Pipely component. Everything else lives under `components/pipely/`.
- `HOMEPAGE-COPY.md` holds the approved homepage copy and the list of gaps behind it.

### Before this can launch

Grep for `data-placeholder` and `TODO`. Nothing with either may go live. Currently outstanding:

1. Susan Foley's quote, verbatim. The three files in `src/content/testimonials/` are marked `placeholder: true` and are filtered out at render, so the testimonial sections render empty until a real one lands.
2. ~~Guinness Storehouse: what the film was for, then a case study at `/work/guinness-storehouse/`.~~ Live 19 October 2026 (summer 2026 films, Thursday Night Social). Still owed: a result or a quote, and captions on the five films.
3. Boston Scientific case study. Client name only, no supplier designation.
4. ~~Photos of Sue and Emma at `/team/sue-ryan.jpg` and `/team/emma-walkin.jpg`.~~ In place 13 October 2026, shown as small round portraits on `/about/`; placeholder note removed.
5. `/showreel-poster.jpg` is a title card with a green wordmark and it is the LCP image. Replace with a mid-reel frame.
6. Captions on the showreel embed, written not auto-generated.
7. The contact form posts nowhere. Point `action` at a real endpoint and link the LeadConnector booking widget.
8. `/work/` renders all twenty-one legacy projects. Curate to twelve to fifteen.
9. Run the accessibility audit on this site and fill in the real known-issues and testing sections of `/accessibility/`.
10. ~~Blog nav label still open.~~ Resolved 11 September 2026: nav now reads Video, Web, Articles.

Legal scope on `/accessibility-audits/` was verified against the National Disability Authority on 11 September 2026 and re-checked against the Irish Statute Book on 10 October 2026 (EN 301 549 v4.1.1 with WCAG 2.2 is published but not yet cited in the Official Journal, so recheck that) and the sources are cited in that file's header comment. Re-check if launch slips by more than a few months.

## Conflicts already resolved, do not re-litigate

1. **Page map.** Use the sitemap in MESSAGING-PLAN §4:

   `/`, `/work/`, `/work/[slug]`, `/video-production/`, `/web-development/`, `/accessibility-audits/`, `/care-and-hosting/`, `/about/`, `/blog/`, `/blog/[slug]`, `/contact/`, `/accessibility/`, `/privacy/`

   Nav: Work, Video, Web, Articles, About, Contact (labels shortened 11 September 2026 from Video Production / Web Development / Blog; underlying routes and page copy are unchanged). Care and Hosting is footer-only.

2. **Pipely's nav is wrong.** The fork ships Video / Web / Digital / Work with hash links into a sticky services section. Digital is **not** a nav item and **not** a third pillar. AI lives as a detachable block inside Web Development, per MESSAGING-PLAN §7.6. Use the six-item nav above. Keep the sticky horizontal services mechanic if it earns its place, but drive it from two pillars, not three.

3. **Pipely's routes are temporary.** `/pipely` and `/pipely/projects` are a parallel evaluation build. When the fork becomes the site, the components move to the real routes, the `noindex` comes off both pages, and the sitemap filter in `astro.config.mjs` is reverted.

4. **Display typeface.** **Plus Jakarta Sans at weight 400** (changed 24 September 2026; Plus Jakarta Display was asked for but has no verifiable licensed source, so this is its maintained successor from the same foundry. Tried after Overused Grotesk, self-hosted and still in `/public/fonts`, Geist, Sansation, Contrail One, Shrikhand, Source Sans 3, Righteous, Radio Canada Big and Parkinsans, all replacing Pipely's Host Grotesk, which had itself replaced the Inter Tight 800 in earlier branding notes). Size and tight tracking carry the headings, and that restraint is a large part of why the template reads calm rather than loud. Body stays Inter. Labels stay JetBrains Mono.

5. **Colour.** Ink `#0F1417`, cream `#FAF7F0`, bandana red `#BD1C30`. Red is the accent. Pipely's accent card fill rotation (`--pl-a1` to `--pl-a6`) is for **surfaces and non-text accents**, and every fill that carries text must be contrast-checked before it ships. Steel tint carries web work, red tint carries film.

6. **Pricing.** We are not publishing prices anywhere, including Care and Hosting and accessibility audits. The old site's SEO price tiers are being killed deliberately. Where a pricing section exists in either reference doc, replace it with an engagement-models or how-we-work block, or drop it.

7. **Homepage section list.** Eight sections, order per MESSAGING-PLAN §5 with one deviation made 11 September 2026: the logo strip was moved up to sit directly under the hero video, ahead of the first service block, reversing the original "logos read as decoration under a hero" rationale. `src/pages/index.astro` is the source of truth for the current order.

8. **Work page count.** Twelve to fifteen curated thumbnails plus four case studies. If a count appears anywhere in the nav or on the page, generate it honestly from the collection or drop it.

## Non-negotiables

- **WCAG 2.2 AA.** The site sells accessibility auditing, so it has to pass.
- **Brand red is a cream-background colour only.** `#BD1C30` on `#0F1417` measures about 3:1 and fails for normal text. On `#FAF7F0` it is about 5.8:1 and passes. On the dark panels, red is large text and non-text accents only.
- **Reduced motion.** Everything in PIPELY-FORK's motion table is covered by it: scroll reveals, sticky horizontal, marquee, drag rail, hover scales, nav hide-on-scroll, hero chips. The hound mark animation and the preloader too.
- **Hero video**: muted, no essential audio, **visible pause control**, solid or heavily dimmed backing behind any text over moving footage. The Vimeo background loop must not mount under reduced motion.
- **Hero poster.** `/showreel-poster.jpg` is a title card with a large green wordmark on it and must be replaced with a frame from the middle of the reel. It carries LCP.
- **Captions on every embedded film.** Not auto-generated.
- Publish an accessibility statement at `/accessibility/`.

## Writing rules

- No em dashes. Commas and full stops.
- No exclamation marks anywhere on the site.
- Irish/UK English. No Americanisms. The old site mixes "optimization" and "realise".
- Plain and declarative. Say what was made and who for.
- Never name a tool where a benefit will do. Only exceptions: WordPress, WooCommerce and Astro, once each, inside a benefit sentence.
- Banned, carried from the old site: "Let's do this", "Like what you see?", "stop the scroll", "get your digital game on".

## Facts that must be right

- Founded **2013** (changed from 2011 by Sue, 14 October 2026). Thirteen years.
- The NDA Someone Like Me site was tested to **WCAG 2.1 AA**. Real Nation's own site was tested to 2.2. Do not conflate them.
- **Someone Like Me Art Awards** and **Our World Awards** were built in partnership with **Real Nation, who designed and ran the projects**. Every mention on the site must say so, captions and alt text included. Never present either as solely ours.
- Do **not** publish any Boston Scientific "EMEA preferred supplier" claim. Naming them as a client is fine.
- Do not write "every website must now be accessible by law". See MESSAGING-PLAN §7a for the correct scope of the European Accessibility Act and the Web Accessibility Directive.
- Testimonials in hand: Susan Foley (National Orthopaedic Hospital Cappagh), Edel (basis.point), Boston Scientific. Any others in the build are placeholders and must be marked as such.

## Technical gotchas carried from the fork

- Element resets in `src/styles/pipely/base.css` are wrapped in `:where()`. Without it, `.pipely a { color: inherit }` beats `.pl-btn`, and `.pipely img { height: auto }` stops the hero poster covering. Keep any new resets inside `:where()`.
- The mobile nav is unfinished. Below 767px the links collapse and only the hound mark and the CTA remain. A proper menu is required before launch.
