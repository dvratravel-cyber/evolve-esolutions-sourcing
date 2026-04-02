export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { target, body, apiKey, method = 'POST' } = req.body || {};
  if (!target || !apiKey) return res.status(400).json({ error: 'Missing target or apiKey' });

  try {
    const response = await fetch(`https://api.instantly.ai${target}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    let data = {};
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!response.ok) {
      // Return the full error for debugging
      return res.status(response.status).json({
        error: data.message || data.error || `Instantly API error ${response.status}`,
        details: data,
        status: response.status,
        target,
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
