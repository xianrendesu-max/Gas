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
        signal: AbortSignal.timeout(10000),
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

  const { id } = req.query;
  if (!id) return res.status(400).json({ success: false, error: 'id is required' });

  try {
    const { data, instance } = await tryFetch(`videos/${id}`);
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    res.setHeader('X-Invidious-Instance', instance);
    return res.status(200).json({ success: true, data, instance });
  } catch (err) {
    return res.status(502).json({ success: false, error: err.message });
  }
}
