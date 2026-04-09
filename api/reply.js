// Reply.io API proxy — supports v1, v2, v3
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { target, body, apiKey, method = 'POST', version = 'v1' } = req.body || {};
  if (!target || !apiKey) return res.status(400).json({ error: 'Missing target or apiKey' });

  // Support v1, v2, v3 base URLs
  const base = version === 'v3' ? 'https://api.reply.io/v3' : 'https://api.reply.io/v1';

  try {
    const response = await fetch(`${base}${target}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: body !== null && body !== undefined && method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    let data = {};
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || data.error || `Reply.io API error ${response.status}`,
        details: data,
        status: response.status,
        target,
        version,
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
