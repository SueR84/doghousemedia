// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://doghousemedia.ie',
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
