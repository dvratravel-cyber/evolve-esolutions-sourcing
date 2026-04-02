export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { target, body, apiKey } = req.body || {};
  if (!target || !apiKey) return res.status(400).json({ error: 'Missing target or apiKey' });

  // people/match uses POST with query params and no body
  // other endpoints use POST with JSON body
  const isPeopleMatch = target.includes('/people/match');
  
  try {
    const response = await fetch(`https://api.apollo.io${target}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
        'Cache-Control': 'no-cache',
      },
      body: (body && !isPeopleMatch) ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    let data = {};
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || data.error || data.error_message || `Apollo API error ${response.status}`,
        details: data,
        status: response.status,
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
