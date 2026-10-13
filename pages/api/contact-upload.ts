import type { NextApiRequest, NextApiResponse } from 'next';
import { handleUpload, HandleUploadBody } from '@vercel/blob/client';

import { verifyTurnstileToken, getRemoteIp } from '@/lib/turnstile';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const body = req.body as HandleUploadBody;

  try {
    const response = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        // Without this, anyone could request an upload token directly and
        // store files up to the size limit, bypassing the check in /api/contact.
        let turnstileToken: unknown;
        try {
          ({ turnstileToken } = JSON.parse(clientPayload ?? '{}'));
        } catch {
          // fall through with an undefined token
        }
        const ok = await verifyTurnstileToken(turnstileToken, getRemoteIp(req));
        if (!ok) throw new Error('Verification failed. Please try again.');

        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ],
          maximumSizeInBytes: 20 * 1024 * 1024, // 20 MB
        };
      },
      onUploadCompleted: async () => {
        // Phase 2: persist blob.url to a deal record in HubSpot here.
      },
    });

    res.json(response);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}
