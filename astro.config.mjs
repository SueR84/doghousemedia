// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://doghousemedia.ie',
  // Pages stay static. The adapter is only here so src/pages/api/enquiry.ts
  // (prerender = false) runs as a Vercel function for the enquiry forms.
  adapter: vercel(),
  integrations: [mdx(), sitemap()],
  image: {
    // Astro's built-in sharp service. Formats are chosen per <Image /> call.
    responsiveStyles: true,
  },
  build: {
    // One CSS file rather than per-page chunks; the token set is small enough
    // that a single cached stylesheet beats repeated inlining.
    inlineStylesheets: 'never',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
