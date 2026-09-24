import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
import { Resend } from 'resend';
import { issueSignedToken, presignUrl } from '@vercel/blob';

import {
  contactFormSchema,
  ContactFormData,
  FORM_VERSION,
} from '@/lib/contact-schema';

const resend = new Resend(process.env.RESEND_API_KEY);

type ApiResponse = { success: true } | { error: string };

/* eslint-disable no-console -- deliberate server-side error logging for the
   Turnstile and CB intake failure paths below, matching lib/datocms.js */

const CB_INTAKE_TIMEOUT_MS = 5000;

// Cloudflare Turnstile isn't provisioned for this site yet (see
// components/contact/TurnstileWidget.tsx). Without TURNSTILE_SECRET_KEY set,
// verification is skipped entirely so submissions keep working as before;
// once the secret is set, this starts enforcing automatically.
async function verifyTurnstileToken(
  token: unknown,
  remoteIp: string | undefined,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== 'string' || !token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.append('remoteip', remoteIp);

    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body },
    );
    const result = (await res.json()) as { success?: boolean };
    return result.success === true;
  } catch (err) {
    console.error('Turnstile verification request failed:', err);
    return false;
  }
}

// Best-effort forward to CB's intake endpoint. Never throws and never
// delays the response beyond CB_INTAKE_TIMEOUT_MS — the Resend email below
// is the source of truth and must always send regardless of what happens here.
async function postToCBIntake(payload: Record<string, unknown>) {
  if (process.env.CB_INTAKE_ENABLED !== 'true') return;

  const url = process.env.CB_INTAKE_URL;
  if (!url) {
    console.error(
      `CB_INTAKE_ENABLED is 'true' but CB_INTAKE_URL is not set — skipping intake POST for submission ${payload.submissionId}`,
    );
    return;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CB_INTAKE_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CB-Secret': process.env.CB_INTAKE_SECRET ?? '',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error(
        `CB intake POST returned ${res.status} for submission ${payload.submissionId}`,
      );
    }
  } catch (err) {
    console.error(
      `CB intake POST failed for submission ${payload.submissionId}:`,
      err,
    );
  } finally {
    clearTimeout(timer);
  }
}

function formatProjectEmail(
  data: Extract<ContactFormData, { formType: 'client-project' }>,
  submissionId: string,
  signedAttachmentUrl?: string,
): string {
  const attachmentValue = signedAttachmentUrl
    ? `<a href="${signedAttachmentUrl}" style="color:#1b1919">View attachment (link expires in 7 days)</a>`
    : undefined;

  const rows: [string, string | undefined][] = [
    ['Submission ID', submissionId],
    ['First name', data.firstName],
    ['Last name', data.lastName],
    ['Email', data.email],
    ['Contact number', data.contactNumber],
    ['Project type', data.projectType.join(', ')],
    ['Listed status', data.isListedProperty],
    ['Property description', data.propertyDescription],
    ['Owns property', data.ownsProperty],
    ['Country / region', data.region],
    ['Postcode', data.postcode],
    ['Address line 1', data.addressLine1],
    ['Budget', data.budget],
    ['Timings', data.timing],
    ['Additional detail', data.additionalDetail],
    ['How did you hear about us', data.heardAbout],
    ['Referred by', data.referralSource],
    ['Attachment', attachmentValue],
    ['Marketing consent', data.marketingConsent ? 'Yes' : 'No'],
  ];

  const html = rows
    .filter(([, v]) => v !== undefined && v !== '')
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#8f8f8f;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;font-size:13px">${value}</td></tr>`,
    )
    .join('');

  return `<table style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif">${html}</table>`;
}

function formatPressEmail(
  data: Extract<ContactFormData, { formType: 'press-enquiry' }>,
  submissionId: string,
): string {
  const rows: [string, string | undefined][] = [
    ['Submission ID', submissionId],
    ['First name', data.firstName],
    ['Last name', data.lastName],
    ['Email', data.email],
    ['Contact number', data.contactNumber],
    ['Company name', data.companyName],
    ['How did you hear about us', data.heardAbout],
    ['Message', data.message],
  ];

  const html = rows
    .filter(([, v]) => v !== undefined && v !== '')
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#8f8f8f;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;font-size:13px">${value}</td></tr>`,
    )
    .join('');

  return `<table style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif">${html}</table>`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const { turnstileToken, hubspotutk } = body;

  // a. Verify Turnstile
  const forwardedFor = req.headers['x-forwarded-for'];
  const remoteIp = (
    Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor
  )
    ?.split(',')[0]
    ?.trim();

  const turnstileOk = await verifyTurnstileToken(turnstileToken, remoteIp);
  if (!turnstileOk) {
    return res
      .status(400)
      .json({ error: 'Verification failed. Please try again.' });
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid form data.' });
  }

  const { data } = parsed;
  const submissionId = randomUUID();
  const submittedAt = new Date().toISOString();
  const pageUri = req.headers.referer ?? 'unknown';

  const { CONTACT_FORM_RECIPIENT, CONTACT_FORM_FROM } = process.env;
  const recipient = CONTACT_FORM_RECIPIENT ?? 'office@charltonbrown.com';
  const from =
    CONTACT_FORM_FROM ?? 'Charlton Brown Website <noreply@charltonbrown.com>';

  const isProject = data.formType === 'client-project';
  const subject = isProject
    ? `New Project Enquiry — ${data.firstName} ${data.lastName}`
    : `New Press Enquiry — ${data.firstName} ${data.lastName}`;

  // b. Forward to CB intake (best-effort, only when explicitly enabled).
  // Every existing field is sent under its current name, unchanged.
  await postToCBIntake({
    ...data,
    submissionId,
    formVersion: FORM_VERSION,
    ...(typeof hubspotutk === 'string' && hubspotutk ? { hubspotutk } : {}),
    submittedAt,
    pageUri,
  });

  // Generate a signed URL for the private blob attachment so it is clickable
  // in the email. Vercel Blob private URLs require authentication; a signed URL
  // scoped to this file with a 7-day expiry (Vercel's maximum) is used instead.
  // If signing fails for any reason the email still sends, just without the link.
  let signedAttachmentUrl: string | undefined;
  if (isProject) {
    const projectData = data as Extract<
      ContactFormData,
      { formType: 'client-project' }
    >;
    if (projectData.attachmentUrl) {
      try {
        const pathname = decodeURIComponent(
          new URL(projectData.attachmentUrl).pathname.slice(1),
        );
        const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
        const signedToken = await issueSignedToken({
          pathname,
          validUntil: Date.now() + SEVEN_DAYS_MS,
        });
        const { presignedUrl } = await presignUrl(signedToken, {
          operation: 'get',
          pathname,
          access: 'private',
        });
        signedAttachmentUrl = presignedUrl;
      } catch {
        // Signing failed — email will send without an attachment link.
        // Check BLOB_READ_WRITE_TOKEN is set and the attachment URL is from the correct store.
      }
    }
  }

  const html = isProject
    ? formatProjectEmail(
        data as Extract<ContactFormData, { formType: 'client-project' }>,
        submissionId,
        signedAttachmentUrl,
      )
    : formatPressEmail(
        data as Extract<ContactFormData, { formType: 'press-enquiry' }>,
        submissionId,
      );

  // c. Always send the email — the intake POST above can never block or
  // prevent this, regardless of whether it succeeded, failed, or was skipped.
  const { error } = await resend.emails.send({
    from,
    to: recipient,
    replyTo: data.email,
    subject,
    html,
  });

  if (error) {
    return res.status(500).json({ error: 'Failed to send email.' });
  }

  return res.status(200).json({ success: true });
}
