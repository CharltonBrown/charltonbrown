/* eslint-disable no-console -- deliberate server-side logging for the
   Turnstile skip/failure paths, matching lib/datocms.js */
import type { NextApiRequest } from 'next';

// Shared by /api/contact and /api/contact-upload. Tokens are single-use, so
// each route needs its own (the form fetches a fresh one after an upload).
// Without TURNSTILE_SECRET_KEY set, verification is skipped so local dev works
// unconfigured; once the secret is set, this enforces automatically. In
// production (VERCEL_ENV === 'production'), a missing secret instead
// REJECTS submissions rather than silently skipping — so a deleted/forgotten
// key degrades loudly there, not silently. Locally and in previews,
// VERCEL_ENV isn't 'production', so this has no effect on your workflow.
export async function verifyTurnstileToken(
  token: unknown,
  remoteIp: string | undefined,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.VERCEL_ENV === 'production') {
      console.error(
        'Turnstile verification failed: running in production but TURNSTILE_SECRET_KEY is not set',
      );
      return false;
    }
    console.error(
      'Turnstile verification skipped: TURNSTILE_SECRET_KEY not set',
    );
    return true;
  }

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

export function getRemoteIp(req: NextApiRequest): string | undefined {
  const forwardedFor = req.headers['x-forwarded-for'];
  return (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)
    ?.split(',')[0]
    ?.trim();
}
