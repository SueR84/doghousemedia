/**
 * Bandit chat window. Loaded on demand by components/pipely/Bandit.astro.
 *
 * Handles the window (open, close, minimise, expand, drag), sending messages
 * to /api/chat, streaming the reply in, and keeping the conversation for
 * this tab in sessionStorage so it survives moving between pages.
 *
 * Model text is never inserted as HTML. Replies are turned into paragraphs,
 * simple lists and links by building DOM nodes, and only links to pages on
 * this site or to hello@ are kept.
 */

type Role = 'user' | 'assistant';
type Cta = 'start' | 'audit';
interface Turn { role: Role; content: string; cta?: Cta }
interface Saved { state: 'open' | 'min' | 'closed'; max?: boolean; x?: number; y?: number; turns: Turn[] }

const SESSION = 'dhm-bandit';
const QUIET = 'dhm-bandit-quiet';
const MAX_SAVED = 30;
const EMAIL = 'hello@doghousemedia.ie';

let started = false;
let api: { open: (focus: boolean) => void } | null = null;

export function start(root: HTMLElement, opts: { restore: boolean }) {
  if (started) {
    api?.open(true);
    return;
  }
  started = true;

  const $ = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const win = $('[data-bd-window]');
  const bar = $('[data-bd-bar]');
  const log = $('[data-bd-log]');
  const status = $('[data-bd-status]');
  const form = $<HTMLFormElement>('[data-bd-form]');
  const input = $<HTMLTextAreaElement>('[data-bd-input]');
  const send = $<HTMLButtonElement>('[data-bd-send]');
  const launcher = $('[data-bd-launcher]');
  const btnMin = $('[data-bd-min]');
  const btnMax = $('[data-bd-max]');
  const chips = root.querySelector<HTMLElement>('[data-bd-chips]');
  const page = root.dataset.page || '/';
  const pageCta = root.dataset.cta;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wide = matchMedia('(min-width: 768px)');

  let saved: Saved = { state: 'closed', turns: [] };
  try {
    const s = JSON.parse(sessionStorage.getItem(SESSION) || 'null');
    if (s && Array.isArray(s.turns)) saved = s;
  } catch {}
  const turns: Turn[] = saved.turns.slice(-MAX_SAVED);
  let busy = false;

  const persist = () => {
    try {
      sessionStorage.setItem(SESSION, JSON.stringify({ ...saved, turns: turns.slice(-MAX_SAVED) }));
    } catch {}
  };

  /* ---------- Rendering ---------- */

  const safeHref = (href: string) =>
    /^\/(?!\/)[\w\-/#?=&.]*$/.test(href) || href === `mailto:${EMAIL}` ? href : null;

  // **bold** and [text](href) inside one line of text.
  function inline(el: HTMLElement, text: string) {
    const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      if (m.index > last) el.append(text.slice(last, m.index));
      if (m[1]) {
        const href = safeHref(m[2]);
        if (href) {
          const a = document.createElement('a');
          a.href = href;
          a.textContent = m[1];
          el.append(a);
        } else el.append(m[1]);
      } else {
        const b = document.createElement('strong');
        b.textContent = m[3];
        el.append(b);
      }
      last = re.lastIndex;
    }
    if (last < text.length) el.append(text.slice(last));
  }

  function renderText(box: HTMLElement, text: string) {
    box.replaceChildren();
    let list: HTMLUListElement | null = null;
    let para: HTMLParagraphElement | null = null;
    for (const raw of text.split('\n')) {
      const line = raw.trim();
      if (!line) { list = null; para = null; continue; }
      const item = /^[-*•]\s+(.*)$/.exec(line);
      if (item) {
        para = null;
        if (!list) { list = document.createElement('ul'); box.append(list); }
        const li = document.createElement('li');
        inline(li, item[1]);
        list.append(li);
      } else {
        list = null;
        if (para) para.append(document.createElement('br'));
        else { para = document.createElement('p'); box.append(para); }
        inline(para, line);
      }
    }
  }

  // Pull the [[start]] / [[audit]] marker out of a reply. Also hides a
  // half-written marker while it is still streaming in.
  function split(text: string): { body: string; cta?: Cta } {
    let cta: Cta | undefined;
    const body = text
      .replace(/\[\[(start|audit)\]\]/g, (_, k) => { cta = k; return ''; })
      .replace(/\[\[[a-z]*\]?$/, '')
      .replace(/\s*[\u2014\u2013]\s*/g, ', ')
      .trim();
    if (pageCta === 'none') cta = undefined;
    return { body, cta };
  }

  function ctaButton(kind: Cta) {
    const a = document.createElement('a');
    a.href = '/contact/';
    a.className = 'pl-btn is-sm bd-cta';
    a.dataset.bdCta = kind;
    a.textContent = kind === 'audit' ? 'Request an audit' : 'Tell us about your project';
    return a;
  }

  function bubble(role: Role) {
    const wrap = document.createElement('div');
    wrap.className = `bd-msg ${role === 'user' ? 'is-user' : 'is-bot'}`;
    const text = document.createElement('div');
    text.className = 'bd-msg__text';
    wrap.append(text);
    if (role === 'user') {
      const label = document.createElement('span');
      label.className = 'sr-only';
      label.textContent = 'You said: ';
      wrap.prepend(label);
    }
    log.append(wrap);
    return { wrap, text };
  }

  function addTurn(t: Turn) {
    const { wrap, text } = bubble(t.role);
    if (t.role === 'user') text.textContent = t.content;
    else renderText(text, t.content);
    if (t.cta) wrap.append(ctaButton(t.cta));
  }

  // What the status region reads out: the reply as one line of plain text.
  const plain = (t: string) =>
    t.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*\*/g, '').replace(/^\s*[-*•]\s+/gm, '').replace(/\s*\n+\s*/g, ' ').trim();

  const scrollDown = () => log.scrollTo({ top: log.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });

  // Restore the conversation from earlier pages, under this page's greeting.
  if (turns.length) {
    chips?.remove();
    turns.forEach(addTurn);
  }

  /* ---------- Sending ---------- */

  async function ask(question: string) {
    const q = question.trim().slice(0, 1500);
    if (!q || busy) return;
    busy = true;
    send.disabled = true;
    chips?.remove();

    const user: Turn = { role: 'user', content: q };
    turns.push(user);
    addTurn(user);
    persist();

    const { wrap, text } = bubble('assistant');
    wrap.classList.add('is-typing');
    const dots = document.createElement('span');
    dots.className = 'bd-typing';
    dots.setAttribute('aria-hidden', 'true');
    dots.innerHTML = '<i></i><i></i><i></i>';
    text.append(dots);
    status.textContent = 'Bandit is writing a reply.';
    scrollDown();

    let reply = '';
    let failed: string | null = null;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page,
          messages: turns.slice(-16).map(({ role, content }) => ({ role, content })),
        }),
      });
      if (!res.ok || !res.body) {
        failed =
          res.status === 429
            ? `You have asked me a lot in a short time. Give me a few minutes, or email [${EMAIL}](mailto:${EMAIL}) and Susan or Emma will reply within a working day.`
            : `I'm off duty at the moment. Email [${EMAIL}](mailto:${EMAIL}) and Susan or Emma will reply within a working day.`;
      } else {
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let first = true;
        let frame = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          reply += dec.decode(value, { stream: true });
          if (first && split(reply).body) { wrap.classList.remove('is-typing'); first = false; }
          if (!first && !frame) {
            frame = requestAnimationFrame(() => {
              frame = 0;
              renderText(text, split(reply).body);
              log.scrollTop = log.scrollHeight;
            });
          }
        }
        if (frame) cancelAnimationFrame(frame);
        if (!split(reply).body) failed = `Sorry, I lost my thread there. Try asking again, or email [${EMAIL}](mailto:${EMAIL}).`;
      }
    } catch {
      failed = `I can't reach the studio right now. Check your connection, or email [${EMAIL}](mailto:${EMAIL}).`;
    }

    wrap.classList.remove('is-typing');
    if (failed) {
      // Not saved: an error is not part of the conversation.
      renderText(text, failed);
      turns.pop();
      persist();
      status.textContent = `Bandit: ${plain(failed)}`;
    } else {
      const { body, cta } = split(reply);
      renderText(text, body);
      if (cta) wrap.append(ctaButton(cta));
      turns.push({ role: 'assistant', content: body, cta });
      persist();
      status.textContent = `Bandit: ${plain(body)}${cta ? ' A button to the enquiry form follows.' : ''}`;
    }

    scrollDown();
    busy = false;
    send.disabled = false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value;
    if (!q.trim() || busy) return;
    input.value = '';
    grow();
    ask(q);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      form.requestSubmit();
    }
  });
  const grow = () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 128)}px`;
  };
  input.addEventListener('input', grow);

  chips?.addEventListener('click', (e) => {
    const chip = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-bd-chip]');
    if (chip) {
      ask(chip.textContent || '');
      input.focus();
    }
  });

  // The enquiry buttons open the page's own Start a project or audit modal
  // when it is there, and otherwise follow the link to /contact/.
  log.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('[data-bd-cta]');
    if (!a) return;
    const audit = a.dataset.bdCta === 'audit';
    const modal = document.querySelector(audit ? '[data-ar]' : '[data-sp]');
    const me = e as MouseEvent;
    if (!modal || me.metaKey || me.ctrlKey || me.shiftKey || me.altKey) return;
    e.preventDefault();
    document.dispatchEvent(new CustomEvent(audit ? 'dhm:audit-request' : 'dhm:start-project', { detail: { trigger: a } }));
  });

  /* ---------- Window ---------- */

  const setState = (state: Saved['state']) => {
    saved.state = state;
    win.hidden = state === 'closed';
    win.dataset.state = state;
    launcher.setAttribute('aria-expanded', String(state !== 'closed'));
    launcher.hidden = state !== 'closed';
    btnMin.setAttribute('aria-label', state === 'min' ? 'Restore chat' : 'Minimise chat');
    persist();
  };

  const setMax = (on: boolean) => {
    saved.max = on;
    win.classList.toggle('is-max', on);
    btnMax.setAttribute('aria-label', on ? 'Shrink chat' : 'Expand chat');
    if (on) place(null);
    persist();
  };

  function open(focus: boolean) {
    setState('open');
    scrollDown();
    if (focus) input.focus();
  }
  api = { open };

  function close() {
    setState('closed');
    try { localStorage.setItem(QUIET, '1'); } catch {}
    launcher.focus();
  }

  $('[data-bd-close]').addEventListener('click', close);
  btnMin.addEventListener('click', () => {
    if (saved.state === 'min') {
      setState('open');
      log.scrollTop = log.scrollHeight;
    } else setState('min');
  });
  btnMax.addEventListener('click', () => setMax(!saved.max));
  win.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  });

  /* ---------- Dragging (wide screens only, optional) ---------- */

  function place(pos: { x: number; y: number } | null) {
    if (!pos || !wide.matches || saved.max) {
      win.style.left = win.style.top = '';
      win.classList.remove('is-placed');
      if (!pos) { delete saved.x; delete saved.y; }
      return;
    }
    const r = win.getBoundingClientRect();
    const x = Math.max(8, Math.min(pos.x, innerWidth - r.width - 8));
    const y = Math.max(8, Math.min(pos.y, innerHeight - 56));
    win.style.left = `${x}px`;
    win.style.top = `${y}px`;
    win.classList.add('is-placed');
    saved.x = x;
    saved.y = y;
  }

  bar.addEventListener('pointerdown', (e) => {
    if (!wide.matches || saved.max || e.button !== 0 || (e.target as HTMLElement).closest('button')) return;
    const r = win.getBoundingClientRect();
    const dx = e.clientX - r.left;
    const dy = e.clientY - r.top;
    bar.setPointerCapture(e.pointerId);
    win.classList.add('is-dragging');
    const move = (ev: PointerEvent) => place({ x: ev.clientX - dx, y: ev.clientY - dy });
    const up = () => {
      win.classList.remove('is-dragging');
      bar.removeEventListener('pointermove', move);
      bar.removeEventListener('pointerup', up);
      bar.removeEventListener('pointercancel', up);
      persist();
    };
    bar.addEventListener('pointermove', move);
    bar.addEventListener('pointerup', up);
    bar.addEventListener('pointercancel', up);
  });

  // Double-clicking the title bar puts the window back in its corner.
  bar.addEventListener('dblclick', (e) => {
    if ((e.target as HTMLElement).closest('button')) return;
    place(null);
    persist();
  });

  addEventListener('resize', () => {
    if (saved.x != null && saved.y != null) place({ x: saved.x, y: saved.y });
  });

  /* ---------- Go ---------- */

  if (saved.max) setMax(true);
  if (opts.restore) {
    setState(saved.state === 'min' ? 'min' : 'open');
    if (saved.x != null && saved.y != null) place({ x: saved.x, y: saved.y });
    log.scrollTop = log.scrollHeight;
  } else {
    open(true);
  }
}
