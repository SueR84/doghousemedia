/**
 * M2 — blur-in + fade-up on entry.
 *
 * One observer for the whole page. Elements marked `.reveal` get `.is-in`
 * when they cross the threshold, then `.is-done` after the transition so we
 * can drop will-change and stop paying for the compositor layer.
 *
 * Children inside a `[data-stagger]` container get an incrementing --i so
 * they cascade rather than all landing at once.
 */

const REVEALED = 'is-in';
const DONE = 'is-done';

export function initReveal(root: ParentNode = document): void {
  const items = Array.from(root.querySelectorAll<HTMLElement>('.reveal'));
  if (items.length === 0) return;

  // Assign stagger indices before anything can fire.
  root.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    const step = Number(group.dataset.stagger) || 1;
    group.querySelectorAll<HTMLElement>(':scope > .reveal').forEach((child, i) => {
      child.style.setProperty('--i', String(i * step));
    });
  });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add(REVEALED, DONE));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.classList.add(REVEALED);
        observer.unobserve(el);
        el.addEventListener('transitionend', () => el.classList.add(DONE), {
          once: true,
        });
      }
    },
    {
      // Fire a little before the element is fully on screen so the motion
      // reads as part of the scroll rather than a delayed reaction.
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.05,
    },
  );

  items.forEach((el) => observer.observe(el));
}
