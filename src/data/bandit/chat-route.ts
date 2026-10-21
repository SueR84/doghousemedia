/**
 * POST /api/chat. Bandit, the site's chat assistant.
 *
 * The browser sends the conversation so far and the page it is on. This
 * route adds Bandit's instructions and knowledge (src/data/bandit/), sends
 * it to the Anthropic API and streams the reply back as plain text, so the
 * answer appears as it is written.
 *
 * Nothing is stored. Messages pass through this function to Anthropic and
 * back; the content is never logged here.
 *
 * Settings, in Vercel > Project > Settings > Environment Variables:
 *   ANTHROPIC_API_KEY   required. Without it the route returns 503 and the
 *                       chat window tells visitors to email instead.
 *   CHAT_MODEL          optional. Defaults to claude-haiku-5-5.
 *
 * Guard rails: same-origin posts only, capped message length and history,
 * a short reply limit, and a per-visitor rate limit. The rate limit lives in
 * the function's memory, so it resets when Vercel starts a fresh instance.
 * It stops a stuck loop or a casual abuser, not a determined one. Set a
 * monthly spend limit on the Anthropic key as the real backstop.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import knowledge from './knowledge';
import { buildSystem, pageNote } from './prompt';

export const prerender = false;

const MAX_BODY = 40_000;
const MAX_TURNS = 16;          // messages kept from the conversation
const MAX_CHARS = 1_500;       // per visitor message
const MAX_TOKENS = 600;        // per reply
const RATE_WINDOW = 10 * 60_000;
const RATE_MAX = 30;           // replies per visitor per window

const json = (status: number, data: Record<string, unknown>) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

// Built once per function instance. The knowledge only changes on deploy.
let systemPromise: Promise<string> | null = null;
const getSystem = () =>
  (systemPromise ??= getCollection('projects').then((p) => buildSystem(knowledge, p)));

const hits = new Map<string, number[]>();
function limited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < RATE_WINDOW);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5_000) hits.clear();
  return recent.length > RATE_MAX;
}

type Msg = { role: 'user' | 'assistant'; content: string };

function cleanMessages(input: unknown): Msg[] | null {
  if (!Array.isArray(input)) return null;
  const out: Msg[] = [];
  for (const m of input.slice(-MAX_TURNS)) {
    if (!m || typeof m !== 'object') return null;
    const role = (m as Msg).role;
    const raw = (m as Msg).content;
    if ((role !== 'user' && role !== 'assistant') || typeof raw !== 'string') return null;
    const content = raw.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '').trim().slice(0, role === 'user' ? MAX_CHARS : 4_000);
    if (!content) continue;
    // The API wants strict user/assistant turns. Merge any repeats.
    const last = out[out.length - 1];
    if (last && last.role === role) last.content += `\n\n${content}`;
    else out.push({ role, content });
  }
  while (out.length && out[0].role !== 'user') out.shift();
  if (!out.length || out[out.length - 1].role !== 'user') return null;
  return out;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (!origin || !host) return json(403, { ok: false, error: 'origin' });
  try {
    if (new URL(origin).host !== host) return json(403, { ok: false, error: 'origin' });
  } catch {
    return json(403, { ok: false, error: 'origin' });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json(413, { ok: false, error: 'too_large' });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: 'bad_json' });
  }

  const messages = cleanMessages(body?.messages);
  if (!messages) return json(400, { ok: false, error: 'invalid' });
  const path = typeof body.page === 'string' && /^\/[\w\-/]*$/.test(body.page) ? body.page.slice(0, 120) : '/';

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || clientAddress || 'unknown';
  if (limited(ip)) return json(429, { ok: false, error: 'rate_limited' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[chat] ANTHROPIC_API_KEY is not set');
    return json(503, { ok: false, error: 'not_configured' });
  }

  let upstream: Response;
  try {
    upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.CHAT_MODEL || 'claude-haiku-5-5',
        max_tokens: MAX_TOKENS,
        stream: true,
        system: [
          // Cached: identical on every request until the next deploy.
          { type: 'text', text: await getSystem(), cache_control: { type: 'ephemeral' } },
          { type: 'text', text: pageNote(path) },
        ],
        messages,
      }),
      signal: AbortSignal.timeout(45_000),
    });
  } catch (err) {
    console.error('[chat] Could not reach Anthropic', err);
    return json(502, { ok: false, error: 'upstream' });
  }

  if (!upstream.ok || !upstream.body) {
    console.error('[chat] Anthropic refused the request', upstream.status, (await upstream.text()).slice(0, 500));
    return json(502, { ok: false, error: 'upstream' });
  }

  // Server-sent events in, plain text out. The browser only needs the words.
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }
          buffer += decoder.decode(value, { stream: true });
          let sent = false;
          let cut: number;
          while ((cut = buffer.indexOf('\n\n')) >= 0) {
            const event = buffer.slice(0, cut);
            buffer = buffer.slice(cut + 2);
            for (const line of event.split('\n')) {
              if (!line.startsWith('data:')) continue;
              let data: any;
              try {
                data = JSON.parse(line.slice(5));
              } catch {
                continue;
              }
              if (data.type === 'content_block_delta' && data.delta?.type === 'text_delta') {
                controller.enqueue(encoder.encode(data.delta.text));
                sent = true;
              } else if (data.type === 'error') {
                console.error('[chat] Stream error', data.error?.type);
              }
            }
          }
          if (sent) return;
        }
      } catch (err) {
        console.error('[chat] Stream broke', err);
        controller.close();
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
