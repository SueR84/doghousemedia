/**
 * PIPELY FORK — motion engine.
 * Vanilla, no dependencies. Port of the Pipely Webflow IX2 set.
 * Loaded only by PipelyBase.astro, so the existing pages never see it.
 */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* 1. Scroll reveals.
   [data-reveal] on the element, [data-reveal-stagger] on a parent to
   cascade its direct children in 100ms steps. Fires once. */
function initReveals() {
  document.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
    const base = parseInt(group.dataset.revealStagger || '', 10) || 100;
    group.querySelectorAll<HTMLElement>(':scope > [data-reveal]').forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${i * base}ms`);
    });
  });

  const targets = document.querySelectorAll<HTMLElement>('[data-reveal], .pl-reveal-media');
  if (REDUCED) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
  );
  targets.forEach((el) => io.observe(el));
}

/* 2. Sticky horizontal scroll.
   Track X follows scroll progress through the tall section:
   2% -> 0, 25% -> -101.5%, 50% -> -203%, 75% -> -304.5%.
   Webflow smoothing was 91, ie heavy lag. SMOOTH is the per-frame
   catch-up factor that reproduces it. Without it the slide feels
   mechanical, so do not raise it much. */
function initHorizontalScroll() {
  const sections = document.querySelectorAll<HTMLElement>('[data-hscroll]');
  if (!sections.length) return;

  const SMOOTH = 0.09;
  const START = 0.02;
  const END = 0.75;
  const GAP = 1.5;
  const desktop = window.matchMedia('(min-width: 992px)');

  sections.forEach((section) => {
    const track = section.querySelector<HTMLElement>('.pl-hscroll__track');
    const panels = track ? track.children.length : 0;
    const tabs = section.querySelectorAll<HTMLElement>('[data-hscroll-tab]');
    if (!track || panels < 2) return;

    let target = 0;
    let current = 0;
    let raf: number | null = null;
    const distance = (panels - 1) * (100 + GAP);

    const measure = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const raw = total > 0 ? clamp01(-rect.top / total) : 0;
      const p = clamp01((raw - START) / (END - START));
      target = -p * distance;
      const idx = Math.min(panels - 1, Math.round(p * (panels - 1)));
      tabs.forEach((t, i) => t.setAttribute('aria-selected', String(i === idx)));
    };

    const tick = () => {
      current = lerp(current, target, SMOOTH);
      if (Math.abs(current - target) < 0.01) current = target;
      track.style.transform = `translate3d(${current}%,0,0)`;
      raf = requestAnimationFrame(tick);
    };

    const enable = () => {
      if (raf !== null) return;
      window.addEventListener('scroll', measure, { passive: true });
      window.addEventListener('resize', measure);
      measure();
      current = target;
      tick();
    };

    const disable = () => {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      track.style.transform = '';
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        if (!desktop.matches) return;
        const total = section.offsetHeight - window.innerHeight;
        const p = panels > 1 ? i / (panels - 1) : 0;
        const raw = START + p * (END - START);
        window.scrollTo({ top: section.offsetTop + raw * total, behavior: 'smooth' });
      });
    });

    // A hash naming one of the tabs jumps straight to that panel, so the
    // nav's Video / Web / Digital links land on the right one.
    const goToHash = () => {
      const slug = decodeURIComponent(location.hash.replace('#', ''));
      if (!slug) return;
      const idx = Array.from(tabs).findIndex((t) => t.dataset.slug === slug);
      if (idx < 0) return;
      if (!desktop.matches) {
        track.children[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      const total = section.offsetHeight - window.innerHeight;
      const p = panels > 1 ? idx / (panels - 1) : 0;
      window.scrollTo({ top: section.offsetTop + (START + p * (END - START)) * total, behavior: 'smooth' });
    };

    const sync = () => (desktop.matches && !REDUCED ? enable() : disable());
    desktop.addEventListener('change', sync);
    sync();
    window.addEventListener('hashchange', goToHash);
    if (location.hash) requestAnimationFrame(goToHash);
  });
}

/* 3. Marquee. Duplicates the track once so the -50% loop is seamless. */
function initMarquees() {
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((el) => {
    const track = el.querySelector<HTMLElement>('.pl-marquee__track');
    if (!track || track.dataset.cloned === 'true') return;
    const clones = Array.from(track.children).map((n) => {
      const c = n.cloneNode(true) as HTMLElement;
      c.setAttribute('aria-hidden', 'true');
      return c;
    });
    track.append(...clones);
    track.dataset.cloned = 'true';
    if (el.dataset.marqueeSpeed) track.style.animationDuration = `${el.dataset.marqueeSpeed}s`;
  });
}

/* 4. Drag rail. Pointer drag plus optional prev/next buttons. */
function initRails() {
  document.querySelectorAll<HTMLElement>('.pl-rail').forEach((rail) => {
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = 0;

    rail.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return;
      down = true;
      moved = 0;
      startX = e.clientX;
      startLeft = rail.scrollLeft;
      rail.classList.add('is-dragging');
      rail.setPointerCapture(e.pointerId);
    });

    rail.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.abs(dx);
      rail.scrollLeft = startLeft - dx;
    });

    const end = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      rail.classList.remove('is-dragging');
      try {
        rail.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
    };
    rail.addEventListener('pointerup', end);
    rail.addEventListener('pointercancel', end);

    // Swallow the click that ends a real drag, so cards do not navigate.
    rail.addEventListener(
      'click',
      (e) => {
        if (moved > 6) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true,
    );

    const scope = rail.closest<HTMLElement>('[data-rail-scope]') || rail.parentElement;
    const step = () => (rail.firstElementChild?.getBoundingClientRect().width || 320) + 24;
    scope?.querySelector('[data-rail-prev]')?.addEventListener('click', () =>
      rail.scrollBy({ left: -step(), behavior: 'smooth' }),
    );
    scope?.querySelector('[data-rail-next]')?.addEventListener('click', () =>
      rail.scrollBy({ left: step(), behavior: 'smooth' }),
    );
  });
}

/* 5. Accordion. 500ms outQuad height, icon rotates 45deg. */
function initAccordions() {
  document.querySelectorAll<HTMLElement>('.pl-accordion').forEach((acc) => {
    const multi = acc.hasAttribute('data-accordion-multi');
    const items = Array.from(acc.querySelectorAll<HTMLElement>('.pl-accordion__item'));

    const shut = (item: HTMLElement) => {
      const panel = item.querySelector<HTMLElement>('.pl-accordion__answer');
      if (!panel) return;
      panel.style.height = `${panel.scrollHeight}px`;
      requestAnimationFrame(() => {
        panel.style.height = '0px';
      });
      item.classList.remove('is-open');
      item.querySelector('.pl-accordion__question')?.setAttribute('aria-expanded', 'false');
    };

    items.forEach((item) => {
      const btn = item.querySelector<HTMLElement>('.pl-accordion__question');
      const panel = item.querySelector<HTMLElement>('.pl-accordion__answer');
      if (!btn || !panel) return;
      btn.setAttribute('aria-expanded', 'false');

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        if (!multi) items.forEach((o) => o !== item && o.classList.contains('is-open') && shut(o));
        if (isOpen) {
          shut(item);
          return;
        }
        panel.style.height = `${panel.scrollHeight}px`;
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        panel.addEventListener('transitionend', function done(e) {
          if ((e as TransitionEvent).propertyName !== 'height') return;
          panel.style.height = 'auto';
          panel.removeEventListener('transitionend', done);
        });
      });
    });
  });
}

/* 6. Nav. Stays with the reader the whole way down (changed 18 September
   2026 from Pipely's hide-on-scroll-down), and turns to frosted glass once
   the page has scrolled, so what passes behind it shows through blurred.
   The frosting is a state, not motion, so it runs under reduced motion too. */
function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-pl-nav]');
  if (!nav) return;
  const SCROLLED_AT = 12;

  const sync = () => nav.classList.toggle('is-scrolled', window.scrollY > SCROLLED_AT);
  sync();
  window.addEventListener('scroll', sync, { passive: true });
}

/* 7. Scroll-scrubbed progress rail. */
function initProgressRails() {
  const rails = document.querySelectorAll<HTMLElement>('[data-progress-rail]');
  if (!rails.length || REDUCED) return;

  const update = () => {
    rails.forEach((rail) => {
      const rect = rail.getBoundingClientRect();
      const span = rect.height + window.innerHeight * 0.4;
      const p = clamp01((window.innerHeight * 0.6 - rect.top) / span);
      rail.style.setProperty('--progress', p.toFixed(4));
      const steps = rail.querySelectorAll<HTMLElement>('.pl-progress-step');
      steps.forEach((s, i) => {
        const at = steps.length > 1 ? i / (steps.length - 1) : 0;
        s.classList.toggle('is-passed', p >= at * 0.95);
      });
    });
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* 8. Phone parallax.
   The two phones in PhoneVideo drift vertically at different rates as the
   block crosses the viewport, so the nearer one reads as nearer, and fan
   apart horizontally at the same time so the pair opens up rather than
   just sliding. Writes a pixel offset that each phone folds into the
   transform it already carries, the same way initProgressRails writes
   --progress. Never runs under reduced motion, so the variables stay unset
   and both transforms fall back to 0px. */
function initPhoneParallax() {
  const stages = document.querySelectorAll<HTMLElement>('[data-phone-parallax]');
  if (!stages.length || REDUCED) return;

  // Peak-to-peak travel in px. The front phone moves furthest because it is
  // the closest thing to the viewer.
  const FRONT = 90;
  const BACK = 34;
  // Peak-to-peak swing in how far apart the two phones sit, split evenly so
  // the front leans right while the back leans further left, and back again.
  const FAN = 100;

  const update = () => {
    stages.forEach((stage) => {
      const rect = stage.getBoundingClientRect();
      const span = rect.height + window.innerHeight;
      if (span <= 0) return;
      // 0 as the stage enters the bottom of the viewport, 1 as it leaves the
      // top. Centred so the drift is symmetric about the middle of the pass.
      const d = 0.5 - clamp01((window.innerHeight - rect.top) / span);
      stage.style.setProperty('--dhpv-shift-front', `${(d * FRONT).toFixed(2)}px`);
      stage.style.setProperty('--dhpv-shift-back', `${(d * BACK).toFixed(2)}px`);
      stage.style.setProperty('--dhpv-shift-front-x', `${((d * FAN) / 2).toFixed(2)}px`);
      stage.style.setProperty('--dhpv-shift-back-x', `${((-d * FAN) / 2).toFixed(2)}px`);
    });
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

export function initPipelyMotion() {
  initReveals();
  initHorizontalScroll();
  initMarquees();
  initRails();
  initAccordions();
  initNav();
  initProgressRails();
  initPhoneParallax();
}

if (document.readyState !== 'loading') initPipelyMotion();
else document.addEventListener('DOMContentLoaded', initPipelyMotion);
document.addEventListener('astro:page-load', initPipelyMotion);
