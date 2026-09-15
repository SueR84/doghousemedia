/**
 * M5 — nav colour inversion.
 *
 * The nav bar is transparent and fixed, so its link colour has to flip as
 * dark panels pass underneath it. We watch every `[data-panel="ink"]` element
 * against the nav band (the top --nav-h pixels of the viewport) and toggle a
 * class on the header.
 *
 * Using an observer with a rootMargin that collapses the viewport down to the
 * nav band means the browser does the intersection maths, not us.
 */

export function initNavInvert(): void {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;

  const panels = Array.from(document.querySelectorAll<HTMLElement>('[data-panel="ink"]'));
  if (panels.length === 0) return;

  const navHeight = nav.offsetHeight || 60;
  const overlapping = new Set<Element>();

  const apply = () => {
    nav.classList.toggle('nav--on-ink', overlapping.size > 0);
  };

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) overlapping.add(entry.target);
        else overlapping.delete(entry.target);
      }
      apply();
    },
    {
      // Collapse the observation area to the nav band. We measure against the
      // vertical middle of the bar rather than its bottom edge, so a panel
      // that merely starts flush under the nav (as the hero does at scroll 0)
      // doesn't count as being behind it.
      rootMargin: `0px 0px -${Math.max(window.innerHeight - navHeight / 2, 0)}px 0px`,
      threshold: 0,
    },
  );

  panels.forEach((panel) => observer.observe(panel));
}
