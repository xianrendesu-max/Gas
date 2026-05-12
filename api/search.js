const INSTANCES = [
  'https://invidious.nikkosphere.com',
  'https://iv.ggtyler.dev',
  'https://invidious.privacyredirect.com',
  'https://invidious.io.lol',
  'https://yt.cdaut.de',
];

async function tryFetch(path) {
  for (const instance of INSTANCES) {
    try {
      const res = await fetch(`${instance}/api/v1/${path}`, {
        headers: { 'User-Agent': 'RikuTube/1.0' },
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const data = await res.json();
        return { data, instance };
      }
    } catch (_) {
      continue;
    }
  }
  throw new Error('All Invidious instances failed');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { q = '', page = '1', sort_by = 'relevance', type = 'video' } = req.query;
  if (!q) return res.status(400).json({ success: false, error: 'q is required' });

  try {
    const { data, instance } = await tryFetch(
      `search?q=${encodeURIComponent(q)}&page=${page}&sort_by=${sort_by}&type=${type}`
    );
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
    res.setHeader('X-Invidious-Instance', instance);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(502).json({ success: false, error: err.message });
  }
}
