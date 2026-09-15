/**
 * M4 — count-up numerals.
 *
 * Markup: <span data-countup="56" data-suffix="+">0</span>
 * Optional: data-decimals, data-duration (ms), data-prefix.
 *
 * Runs once on first entry. Under reduced motion the final value is written
 * immediately rather than animated.
 */

const easeOutExpo = (t: number): number => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function format(value: number, decimals: number): string {
  return value.toLocaleString('en-IE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function run(el: HTMLElement): void {
  const target = Number(el.dataset.countup ?? '0');
  const decimals = Number(el.dataset.decimals ?? '0');
  const duration = Number(el.dataset.duration ?? '1600');
  const prefix = el.dataset.prefix ?? '';
  const suffix = el.dataset.suffix ?? '';

  const write = (n: number) => {
    el.textContent = `${prefix}${format(n, decimals)}${suffix}`;
  };

  const start = performance.now();
  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    write(target * easeOutExpo(progress));
    if (progress < 1) requestAnimationFrame(tick);
    else write(target);
  };

  requestAnimationFrame(tick);
}

export function initCountUp(root: ParentNode = document): void {
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-countup]'));
  if (items.length === 0) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const settle = (el: HTMLElement) => {
    const target = Number(el.dataset.countup ?? '0');
    const decimals = Number(el.dataset.decimals ?? '0');
    el.textContent = `${el.dataset.prefix ?? ''}${format(target, decimals)}${el.dataset.suffix ?? ''}`;
  };

  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(settle);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        run(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.4 },
  );

  items.forEach((el) => observer.observe(el));
}
