export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, apiKey } = req.body || {};
  if (!email || !apiKey) return res.status(400).json({ error: 'Missing email or apiKey' });

  try {
    const r = await fetch(`https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${apiKey}`);
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.errors?.[0]?.details || `Hunter error ${r.status}` });
    const result = data.data || {};
    return res.status(200).json({
      email: result.email,
      status: result.status,           // valid | invalid | accept_all | unknown
      score: result.score,             // 0-100 deliverability score
      disposable: result.disposable,
      webmail: result.webmail,
      mx_records: result.mx_records,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
