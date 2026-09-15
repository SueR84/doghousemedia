/**
 * M3 — scroll-linked word-by-word text resolve.
 *
 * The trickiest effect on the page. Text starts at low opacity and resolves
 * to full strength word by word as the block travels through the viewport.
 *
 * Words are split at runtime so the source markup stays clean and copyable.
 * We only listen to scroll while the block is actually on screen, and all
 * reads/writes happen inside a rAF so we're not thrashing layout.
 *
 * `animation-timeline: view()` would do this in pure CSS, but support is
 * still Chromium-only — this is the version that works everywhere.
 */

function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === 'true') {
    return Array.from(el.querySelectorAll<HTMLElement>('.word'));
  }

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) textNodes.push(node as Text);

  const words: HTMLElement[] = [];

  for (const textNode of textNodes) {
    const parts = textNode.textContent?.split(/(\s+)/) ?? [];
    const fragment = document.createDocumentFragment();

    for (const part of parts) {
      if (part.trim() === '') {
        fragment.appendChild(document.createTextNode(part));
        continue;
      }
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = part;
      fragment.appendChild(span);
      words.push(span);
    }

    textNode.replaceWith(fragment);
  }

  el.dataset.split = 'true';
  return words;
}

export function initTextResolve(root: ParentNode = document): void {
  const blocks = Array.from(root.querySelectorAll<HTMLElement>('.text-resolve'));
  if (blocks.length === 0) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    blocks.forEach((block) => {
      splitWords(block).forEach((word) => word.classList.add('is-lit'));
    });
    return;
  }

  const active = new Set<HTMLElement>();
  const wordMap = new WeakMap<HTMLElement, HTMLElement[]>();
  let frame = 0;

  const update = () => {
    frame = 0;
    const viewportHeight = window.innerHeight;

    for (const block of active) {
      const words = wordMap.get(block);
      if (!words || words.length === 0) continue;

      const rect = block.getBoundingClientRect();

      // Progress runs 0 → 1 as the block travels from the lower third of the
      // viewport up to the upper third. Tune the 0.75 / 0.3 anchors to taste.
      const startAt = viewportHeight * 0.75;
      const endAt = viewportHeight * 0.3;
      const raw = (startAt - rect.top) / Math.max(startAt - endAt + rect.height * 0.5, 1);
      const progress = Math.min(Math.max(raw, 0), 1);

      const lit = Math.round(progress * words.length);
      words.forEach((word, i) => word.classList.toggle('is-lit', i < lit));
    }
  };

  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(update);
  };

  if (!('IntersectionObserver' in window)) {
    blocks.forEach((block) => {
      splitWords(block).forEach((word) => word.classList.add('is-lit'));
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const block = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          if (!wordMap.has(block)) wordMap.set(block, splitWords(block));
          active.add(block);
        } else {
          active.delete(block);
        }
      }

      if (active.size > 0) {
        window.addEventListener('scroll', schedule, { passive: true });
        schedule();
      } else {
        window.removeEventListener('scroll', schedule);
      }
    },
    { threshold: 0 },
  );

  blocks.forEach((block) => observer.observe(block));
  window.addEventListener('resize', schedule, { passive: true });
}
