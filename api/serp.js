export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { query, apiKey, num = 5 } = req.body || {};
  if (!query || !apiKey) return res.status(400).json({ error: 'Missing query or apiKey' });

  try {
    const params = new URLSearchParams({
      q: query,
      api_key: apiKey,
      engine: 'google',
      num: String(num),
      gl: 'us',
      hl: 'en',
    });
    const r = await fetch(`https://serpapi.com/search?${params}`);
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.error || `SerpAPI error ${r.status}` });
    // Return organic results + knowledge graph
    return res.status(200).json({
      organic: (data.organic_results || []).map(o => ({
        title: o.title,
        link: o.link,
        snippet: o.snippet,
        domain: o.displayed_link,
      })),
      related: data.related_searches?.map(s => s.query) || [],
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
