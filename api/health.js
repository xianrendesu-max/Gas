export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ok',
    service: 'RikuTube for Gas API',
    version: '1.0.0',
    endpoints: ['/api/trending', '/api/search', '/api/video'],
    timestamp: new Date().toISOString(),
  });
}
