/**
 * Single entry point for all page behaviour.
 *
 * Total budget for everything imported here is ~15KB uncompressed
 * (BUILD-SPEC §9). If that starts creeping, split by route rather than
 * reaching for a framework.
 */

import { initReveal } from './reveal';
import { initNavInvert } from './nav-invert';
import { initCountUp } from './countup';
import { initTextResolve } from './text-resolve';

function boot(): void {
  initReveal();
  initNavInvert();
  initCountUp();
  initTextResolve();
}

document.documentElement.classList.remove('no-js');

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}

// Astro view transitions, if they get enabled later, swap the DOM without a
// full reload — re-run the observers against the new document.
document.addEventListener('astro:page-load', boot);
