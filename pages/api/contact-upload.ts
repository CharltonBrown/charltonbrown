import type { NextApiRequest, NextApiResponse } from 'next';
import { handleUpload, HandleUploadBody } from '@vercel/blob/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const body = req.body as HandleUploadBody;

  try {
    const response = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          'image/jpeg',
          'image/png',
          'image/gif',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        maximumSizeInBytes: 20 * 1024 * 1024, // 20 MB
      }),
      onUploadCompleted: async () => {
        // Phase 2: persist blob.url to a deal record in HubSpot here.
      },
    });

    res.json(response);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}
