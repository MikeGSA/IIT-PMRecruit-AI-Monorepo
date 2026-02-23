import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrl = process.env.NEXT_PUBLIC_N8N_PIPELINE_WEBHOOK;
  if (!webhookUrl) {
    return res.status(500).json({ error: 'N8N pipeline webhook URL not configured' });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({ error: text || `Pipeline failed (${response.status})` });
    }

    if (!text.trim()) {
      return res.status(502).json({
        error: 'n8n returned an empty response. Check: (1) workflow is active, (2) credentials are connected in n8n.',
      });
    }

    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch {
      return res.status(502).json({ error: `n8n response is not valid JSON: ${text.substring(0, 300)}` });
    }
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to reach n8n pipeline',
    });
  }
}
