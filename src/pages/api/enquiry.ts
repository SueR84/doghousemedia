/**
 * POST /api/enquiry. The one server route on the site.
 *
 * All three enquiry forms post JSON here: the contact page, the Start a
 * project modal (StartProject) and the accessibility audit modal
 * (AuditRequest). This route checks the fields and sends the lead to
 * ENQUIRY_TO through the Mailgun HTTP API. The visitor's address is set as
 * Reply-To, so replying in Gmail goes straight to them.
 *
 * Every page stays static. Only this file runs on demand, as a Vercel
 * function (prerender = false, @astrojs/vercel in astro.config.mjs).
 *
 * Settings, in Vercel > Project > Settings > Environment Variables:
 *   MAILGUN_API_KEY   required. A sending key for the domain below.
 *   MAILGUN_DOMAIN    required. The verified sending domain, e.g. mg.doghousemedia.ie
 *   MAILGUN_REGION    "eu" if the domain lives in Mailgun's EU region. Anything else = US.
 *   ENQUIRY_TO        optional. Defaults to hello@doghousemedia.ie. Comma-separate for more than one.
 *   ENQUIRY_FROM      optional. Defaults to "Doghouse Media website <website@MAILGUN_DOMAIN>".
 *
 * Failure is deliberate and loud. If the settings are missing or Mailgun
 * refuses the message, this returns an error status and the form falls back
 * to opening a pre-filled email, so a lead is never silently lost.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

const MAX_BODY = 20_000;
const EMAIL_RE = /^[^\s@<>(),;:"]+@[^\s@<>(),;:"]+\.[^\s@<>(),;:"]{2,}$/;

const json = (status: number, data: Record<string, unknown>) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/** Trimmed string, capped, with control characters removed. Single-line by default. */
function clean(value: unknown, max: number, multiline = false): string {
  if (typeof value !== 'string') return '';
  let s = value.replace(/\r\n?/g, '\n');
  s = multiline
    ? s.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '')
    : s.replace(/[\u0000-\u001F\u007F]/g, ' ');
  return s.trim().slice(0, max);
}

export const POST: APIRoute = async ({ request }) => {
  // Only accept posts from the site itself. Browsers always send Origin on
  // a cross-origin fetch, so a form on another site is turned away here.
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return json(403, { ok: false, error: 'origin' });
    } catch {
      return json(403, { ok: false, error: 'origin' });
    }
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json(413, { ok: false, error: 'too_large' });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error();
  } catch {
    return json(400, { ok: false, error: 'bad_json' });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  if (!name || !EMAIL_RE.test(email)) return json(400, { ok: false, error: 'invalid' });

  const interest = clean(body.interest, 60) || 'General';
  const organisation = clean(body.organisation, 160);
  const timeline = clean(body.timeline, 80);
  const isAudit = interest === 'Accessibility audit';

  let subject: string;
  let lines: string[];

  if (isAudit) {
    const site = clean(body.site, 300);
    const size = clean(body.size, 60);
    const reasons = Array.isArray(body.reasons)
      ? body.reasons.slice(0, 10).map((r) => clean(r, 80)).filter(Boolean)
      : [];
    const notes = clean(body.notes, 5000, true);
    subject = `Accessibility audit request: ${site || name}`;
    lines = [
      `Website: ${site || 'Not given'}`,
      `Size: ${size || 'Not given'}`,
      `Prompted by: ${reasons.length ? reasons.join(', ') : 'Not given'}`,
      `Timeline: ${timeline || 'Not given'}`,
      '',
      notes || '(No other details)',
    ];
  } else {
    const about = clean(body.about, 5000, true);
    subject = `New ${interest} enquiry from ${name}${organisation ? `, ${organisation}` : ''}`;
    lines = [
      `Interested in: ${interest}`,
      `Timeline: ${timeline || 'Not given'}`,
      '',
      about || '(No details given)',
    ];
  }

  lines.push(
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Organisation: ${organisation || 'Not given'}`,
    '',
    '--',
    `Sent from the enquiry form on ${host || 'doghousemedia.ie'}. Reply to this email to answer ${name} directly.`
  );

  const env = process.env;
  const apiKey = env.MAILGUN_API_KEY;
  const domain = env.MAILGUN_DOMAIN;
  if (!apiKey || !domain) {
    console.error('[enquiry] MAILGUN_API_KEY or MAILGUN_DOMAIN is not set');
    return json(503, { ok: false, error: 'not_configured' });
  }

  const base = (env.MAILGUN_REGION || '').toLowerCase() === 'eu'
    ? 'https://api.eu.mailgun.net'
    : 'https://api.mailgun.net';
  const to = env.ENQUIRY_TO || 'hello@doghousemedia.ie';
  const from = env.ENQUIRY_FROM || `Doghouse Media website <website@${domain}>`;

  const form = new URLSearchParams();
  form.set('from', from);
  form.set('to', to);
  form.set('subject', subject.slice(0, 200));
  form.set('text', lines.join('\n'));
  form.set('h:Reply-To', `${name.replace(/["<>]/g, '')} <${email}>`);
  form.set('o:tag', isAudit ? 'audit-request' : 'website-enquiry');

  try {
    const res = await fetch(`${base}/v3/${encodeURIComponent(domain)}/messages`, {
      method: 'POST',
      headers: { Authorization: `Basic ${btoa(`api:${apiKey}`)}` },
      body: form,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error('[enquiry] Mailgun refused the message', res.status, (await res.text()).slice(0, 500));
      return json(502, { ok: false, error: 'send_failed' });
    }
  } catch (err) {
    console.error('[enquiry] Could not reach Mailgun', err);
    return json(502, { ok: false, error: 'send_failed' });
  }

  return json(200, { ok: true });
};
