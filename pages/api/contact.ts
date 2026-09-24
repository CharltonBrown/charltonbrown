import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { issueSignedToken, presignUrl } from '@vercel/blob';

import { contactFormSchema, ContactFormData } from '@/lib/contact-schema';

const resend = new Resend(process.env.RESEND_API_KEY);

type ApiResponse = { success: true } | { error: string };

function formatProjectEmail(
  data: Extract<ContactFormData, { formType: 'client-project' }>,
  signedAttachmentUrl?: string,
): string {
  const attachmentValue = signedAttachmentUrl
    ? `<a href="${signedAttachmentUrl}" style="color:#1b1919">View attachment (link expires in 7 days)</a>`
    : undefined;

  const rows: [string, string | undefined][] = [
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
): string {
  const rows: [string, string | undefined][] = [
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

  const parsed = contactFormSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid form data.' });
  }

  const { data } = parsed;
  const { CONTACT_FORM_RECIPIENT, CONTACT_FORM_FROM } = process.env;
  const recipient = CONTACT_FORM_RECIPIENT ?? 'office@charltonbrown.com';
  const from =
    CONTACT_FORM_FROM ?? 'Charlton Brown Website <noreply@charltonbrown.com>';

  const isProject = data.formType === 'client-project';
  const subject = isProject
    ? `New Project Enquiry — ${data.firstName} ${data.lastName}`
    : `New Press Enquiry — ${data.firstName} ${data.lastName}`;

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
        signedAttachmentUrl,
      )
    : formatPressEmail(
        data as Extract<ContactFormData, { formType: 'press-enquiry' }>,
      );

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

  // Phase 2: sendToHubSpot(data) would slot in here once the HubSpot
  // integration is built. Field names already match the CRM property keys
  // described in the brief (projectType, isListedProperty, budget, timing,
  // additionalDetail, attachmentUrl, heardAbout).

  return res.status(200).json({ success: true });
}
