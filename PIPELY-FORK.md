# Pipely design fork

A parallel design system for evaluating the Pipely Webflow layout and motion
against the current Fabrica-derived build. Nothing here touches the existing
pages.

**View it:** `npm run dev`, then `/pipely` and `/pipely/projects`.

## What is isolated, and how

- CSS lives in `src/styles/pipely/` and every rule is scoped under `.pipely`,
  which only `PipelyBase.astro` puts on `<body>`.
- Classes are prefixed `pl-`, tokens `--pl-`.
- `PipelyBase.astro` deliberately does **not** import `styles/tokens.css`,
  `base.css` or `motion.css`. Astro bundles CSS per page, so the built
  `/index.html` links none of the Pipely stylesheets and `/pipely/index.html`
  links none of the existing ones. Verified in the build output.
- The only shared file is `components/Logo.astro`, reused as-is.
- Both routes are `noindex`, and `/pipely` is filtered out of the sitemap.

## Files added

```
src/styles/pipely/{tokens,base,layout,components,motion,index}.css
src/scripts/pipely/motion.ts
src/layouts/PipelyBase.astro
src/components/pipely/{Nav,Footer,Hero,Button,Reveal,Marquee,Rail,StickyHorizontal,Accordion,WorkCard}.astro
src/pages/pipely/index.astro
src/pages/pipely/projects/index.astro
```

One shared file changed: `astro.config.mjs` gained a sitemap filter.

## Typography

Display is **Host Grotesk** (the template's own face), body is **Inter**.
Host Grotesk is loaded in `PipelyBase.astro` only, so the existing pages carry
no extra font request. To try a different display face, change
`--font-display` in `styles/pipely/tokens.css` and swap the link.

Headings are weight 400, not bold. Size and tight tracking carry them. That is
a large part of why the template reads calm rather than loud.

## Colour

Pipely leans on an acid yellow CTA and a rotation of saturated pastel card
fills. Doghouse is warm, grounded and restrained, and its tint palette is only
three colours: Steel tint `#EAF1F4`, Red tint `#FDEAED`, Teal light `#8FC4D2`.
So the template's colour behaviour is remapped rather than translated
literally.

**Buttons** follow the brand pack exactly. The primary is Ink with Cream text
and it **hovers to Red**: red is the hover accent, not the resting colour. On
dark panels the pair inverts to Cream on Ink, still hovering to Red.

| Variant | Use |
|---|---|
| `primary` | Ink bg, Cream text, hovers Red. Default. |
| `on-dark` | Cream bg, Ink text, hovers Red. Same button on a dark panel. |
| `ghost` | Ink border and text, fills Ink on hover. |
| `ghost-cream` | The dark-panel counterpart. |
| `red` / `teal` | Craft CTAs: red for film, teal for web. |

**Surfaces stay neutral.** Cards rotate Cream and White, sections use Steel
tint, and that is the whole rotation. The craft signal moves to where the
brand actually puts it:

- Pill tags: Red tint with red text for film, Steel tint with teal text for
  web, Line for both.
- The video service panel uses the brand's **film band**: deep teal `#15282E`
  with cream text and teal-light accents.

That way one section carries real colour, everything else is warm and quiet,
and no two things fight.

## The structural idea

Pipely is not a page with sections on it. It is a warm grey ground with
rounded panels floating on top, 1.25rem apart, inset from the page edges.
Every section is a panel, the nav is a panel, the footer is a panel. No
shadows anywhere: depth comes from the three-step surface stack.

```
--pl-ground     #E5E1D8  the page itself      (Doghouse Line)
--pl-primary    #FFFFFF  section panels
--pl-secondary  #FAF7F0  cards inside panels  (Doghouse Cream)
```

Accent card fills rotate through `--pl-a1` to `--pl-a6` so no two neighbours
match. Steel tints carry web work, red tints carry film. The colour rotation
does double duty as a craft signal.

## Motion

Ported from the template's actual Webflow IX2 data, not eyeballed.

| Pattern | Spec |
|---|---|
| Scroll reveal | opacity 0 + Y 15px, 700ms outQuart, 100ms stagger per sibling |
| Sticky horizontal | 300vw section, sticky wrap, track 0 to -304.5% across scroll progress 0.02-0.75, lerped at 0.09 per frame |
| Marquee | duplicated track, -50%, linear, 34s, pauses on hover |
| Drag rail | native scroll, 28vw cards, pointer drag |
| Button hover | scale 0.95, 200ms outQuart |
| Card hover | scale 1.05, 500ms outQuart |
| Nav | hides on scroll down, returns on scroll up, 1000ms outQuart |
| Hero chips | slide in from 300% under a 20px blur, staggered 100ms |

## Navigation

Video / Web / Digital / Work. The three craft links are hashes matching a
service slug (`/pipely/#video-production`), and the sticky services section
reads the hash on load and scrolls itself to that panel. Add a service to the
collection and its tab and deep link appear automatically.

The mobile nav is unfinished: below 767px the links collapse and only the
hound mark and the CTA remain. A proper menu is the next thing to build.

## Hero

Follows `home/home-v1`: a full-bleed media panel one viewport tall minus the
nav strip, copy pushed into the lower half by a 20% spacer, white type over a
scrim. The template uses a still; this uses the studio showreel (Vimeo
`1218412491`) as an ambient background loop.

The player mounts on `window.load`, never under reduced motion, so the poster
carries LCP and nothing third-party blocks first paint. Vimeo's background
embed fits 16:9 rather than covering, so the iframe is sized to the larger of
the panel's two cover dimensions and centred, with a 1.02 scale to hide
Vimeo's hairline letterbox.

**The poster needs replacing.** `/showreel-poster.jpg` is a title card with a
large green wordmark on it, which is what shows for the first moment before
the video takes over. Grab a frame from the middle of the reel instead.

### A specificity gotcha, fixed

The element resets in `pipely/base.css` are wrapped in `:where()`. Without
that, `.pipely a { color: inherit }` (0,1,1) beat `.pl-btn { color: ... }`
(0,1,0), so buttons inside a dark panel silently inherited cream text, and
`.pipely img { height: auto }` stopped the hero poster from covering. If you
add resets to that file, keep them inside `:where()`.

The lerp on the sticky horizontal scroll is the important number. Webflow had
smoothing at 91, meaning the track visibly trails the scroll and settles.
Raise `SMOOTH` in `scripts/pipely/motion.ts` and it starts to feel mechanical.

## Where this differs from the brand doc

The Doghouse brand pack specifies card hover as lift plus shadow, and radii of
8-16px. Pipely is flat, uses 12/20/24px radii, and scales on hover. This fork
keeps Pipely's, since that is the look being evaluated. Two token changes and
a swap of `.pl-hover-scale` reverses it.

Headings are weight 400, not bold. Size and tight tracking carry them. That is
a large part of why the template reads calm rather than loud.

## To remove the fork

Delete `src/styles/pipely/`, `src/scripts/pipely/`, `src/components/pipely/`,
`src/pages/pipely/`, `src/layouts/PipelyBase.astro`, and revert the one line
in `astro.config.mjs`.
