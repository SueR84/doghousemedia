import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    year: z.number(),
    summary: z.string(),
    // Which side of the studio made it. Drives the red/teal accent.
    craft: z.enum(['web', 'video', 'both']).default('web'),
    cover: z.string().optional(),
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
