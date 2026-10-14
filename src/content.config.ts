import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    year: z.number(),
    summary: z.string(),
    // Partner credit, shown wherever the project appears. Real Nation
    // designed and ran Someone Like Me and Our World Awards; we built them.
    partner: z.string().optional(),
    // Which side of the studio made it. Drives the red/teal accent.
    craft: z.enum(['web', 'video', 'both']).default('web'),
    cover: z.string().optional(),
    // Optional Work grid image. Falls back to cover. Lets a project keep a
    // portrait phone capture for the device mockups and a composed
    // landscape image for the grid.
    thumb: z.string().optional(),
    // Shows the cover screenshot opening inside a folding-device graphic
    // instead of a flat image. Opt-in per project; see PhoneFold.astro.
    coverDevice: z.enum(['fold']).optional(),
    logo: z.string().optional(),
    // Vimeo id for video-craft projects.
    video: z.string().optional(),
    // Unlisted videos need their hash passed as ?h= to embed.
    videoHash: z.string().optional(),
    services: z.array(z.string()).default([]),
    liveUrl: z.string().url().optional(),
    metrics: z
      .array(z.object({ label: z.string(), before: z.string().optional(), after: z.string() }))
      .default([]),
    quote: z.object({ text: z.string(), name: z.string(), role: z.string().optional() }).optional(),
    gallery: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    // MESSAGING-PLAN section 8 and 12. Only a project with a real testimonial
    // or a real result earns a page of its own. Everything else is a thumbnail
    // on the Work page and links out to the film or the live site instead.
    // The old site's mistake was twenty-one thin pages; do not rebuild it.
    caseStudy: z.boolean().default(false),
    // A feature-length case study whose body lays out its own sections,
    // added 25 September 2026 for the Boston Scientific docuseries. The
    // page then skips its narrow prose column and lets the body's own
    // components run the full width.
    feature: z.boolean().default(false),
    // Cross-cutting capabilities shown as tags, deliberately NOT a third
    // craft value. AI is a block inside Web Development, not a pillar, so it
    // must not grow its own section on the Work page. Same for accessibility,
    // bilingual, e-commerce and LMS.
    capabilities: z.array(z.enum(['ai', 'accessibility', 'bilingual', 'ecommerce', 'lms'])).default([]),
    // Short muted loop for the Work grid, three to six seconds, a few hundred
    // KB, self-hosted in /public. Not a Vimeo embed: six iframes would eat the
    // 15KB JS budget in BUILD-SPEC section 9 and set cookies. The full film
    // stays on the case study page. `cover` doubles as the poster frame.
    preview: z.string().optional(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Doghouse Media'),
    draft: z.boolean().default(false),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    index: z.string(),
    title: z.string(),
    description: z.string(),
    // Optional second paragraph, sits under the description on the panel.
    lead: z.string().optional(),
    // Explicit panel image. Without it the panel borrows a project cover,
    // which for video kept landing on a screenshot of a website.
    image: z.string().optional(),
    imageAlt: z.string().default(''),
    // Three short "what that means in practice" lines filling the middle
    // of the sticky service panel.
    points: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    categories: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    company: z.string().default('Doghouse Media'),
    bio: z.string(),
    photo: z.string().optional(),
    contact: z.string().optional(),
    linkedin: z.string().url().optional(),
    order: z.number().default(0),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string(),
    company: z.string(),
    role: z.string().optional(),
    quote: z.string(),
    rating: z.number().min(1).max(5).default(5),
    order: z.number().default(0),
    // Nothing unverified reaches a page. Placeholder entries are filtered
    // out at render time, so a stand-in quote cannot ship by accident.
    // CLAUDE.md: testimonials in hand are Susan Foley (Cappagh),
    // Edel (basis.point) and Boston Scientific. Everything else is true here.
    placeholder: z.boolean().default(false),
  }),
});

const faqs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/faqs' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number().default(0),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    updated: z.coerce.date(),
  }),
});

export const collections = { projects, posts, services, team, testimonials, faqs, legal };

