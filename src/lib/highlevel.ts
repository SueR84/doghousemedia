/**
 * HighLevel (LeadConnector) push for website enquiries.
 *
 * Called from /api/enquiry alongside the Mailgun email. Creates or updates the
 * contact, adds tags, attaches the enquiry as a note and, if a pipeline is set,
 * opens an opportunity. Uses a Private Integration token (API v2).
 *
 * Settings, in Vercel > Project > Settings > Environment Variables:
 *   HIGHLEVEL_TOKEN        required. Sub-account > Settings > Private Integrations.
 *                          Scopes: contacts.write, plus opportunities.write and
 *                          opportunities.readonly if using a pipeline.
 *   HIGHLEVEL_LOCATION_ID  required. The sub-account (location) ID: qxnJWKH4LpmD7Py6DngO
 *   HIGHLEVEL_PIPELINE_ID  optional. Opens an opportunity in this pipeline.
 *                          "Website enquiries" is 2XEyIFI5eHS9uddGkuHj (created 2 November 2026).
 *   HIGHLEVEL_STAGE_ID     optional. Defaults to the pipeline's first stage ("New enquiry").
 *
 * Tags added: "website-enquiry" or "audit-request", plus "interest: <service>".
 * Use them as the trigger for a HighLevel workflow (Contact Tag added).
 */

const BASE = 'https://services.leadconnectorhq.com';
const VERSION = '2021-07-28';

export type HighLevelLead = {
  name: string;
  email: string;
  organisation: string;
  interest: string;
  isAudit: boolean;
  subject: string;
  note: string;
  website?: string;
};

export type PushResult = 'sent' | 'failed' | 'off';

export function highLevelConfigured(): boolean {
  return Boolean(process.env.HIGHLEVEL_TOKEN && process.env.HIGHLEVEL_LOCATION_ID);
}

async function call(path: string, body?: unknown): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HIGHLEVEL_TOKEN}`,
      Version: VERSION,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) {
    throw new Error(`${path} ${res.status} ${(await res.text()).slice(0, 300)}`);
  }
  return res.json().catch(() => ({}));
}

/** HIGHLEVEL_STAGE_ID if set, otherwise the first stage of the pipeline. */
async function firstStage(locationId: string, pipelineId: string): Promise<string> {
  if (process.env.HIGHLEVEL_STAGE_ID) return process.env.HIGHLEVEL_STAGE_ID;
  const data = await call(`/opportunities/pipelines?locationId=${encodeURIComponent(locationId)}`);
  const pipeline = (data?.pipelines ?? []).find((p: any) => p.id === pipelineId);
  const id = pipeline?.stages?.[0]?.id;
  if (!id) throw new Error(`pipeline ${pipelineId} or its first stage not found`);
  return id;
}

export async function pushToHighLevel(lead: HighLevelLead): Promise<PushResult> {
  if (!highLevelConfigured()) return 'off';
  const locationId = process.env.HIGHLEVEL_LOCATION_ID!;

  const [firstName, ...rest] = lead.name.split(/\s+/);
  const tags = [lead.isAudit ? 'audit-request' : 'website-enquiry', `interest: ${lead.interest.toLowerCase()}`];

  try {
    // Upsert matches an existing contact by email. No tags here: upsert
    // replaces a returning contact's tags, so they are added separately below.
    const up = await call('/contacts/upsert', {
      locationId,
      firstName,
      lastName: rest.join(' ') || undefined,
      name: lead.name,
      email: lead.email,
      companyName: lead.organisation || undefined,
      website: lead.website || undefined,
      source: 'doghousemedia.ie',
    });
    const contactId: string | undefined = up?.contact?.id;
    if (!contactId) throw new Error('upsert returned no contact id');

    // The contact exists now, so the lead is in HighLevel. The rest is
    // enrichment: log failures but do not report the push as failed.
    const extras = [
      call(`/contacts/${contactId}/tags`, { tags }),
      call(`/contacts/${contactId}/notes`, { body: `${lead.subject}\n\n${lead.note}` }),
    ];
    const pipelineId = process.env.HIGHLEVEL_PIPELINE_ID;
    if (pipelineId) {
      extras.push(
        firstStage(locationId, pipelineId).then((stageId) => call('/opportunities/', {
          locationId,
          pipelineId,
          pipelineStageId: stageId,
          contactId,
          name: lead.subject.slice(0, 200),
          status: 'open',
          source: 'doghousemedia.ie',
        }))
      );
    }
    for (const r of await Promise.allSettled(extras)) {
      if (r.status === 'rejected') console.error('[highlevel] follow-up call failed', r.reason);
    }
    return 'sent';
  } catch (err) {
    console.error('[highlevel] could not create contact', err);
    return 'failed';
  }
}
