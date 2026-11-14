// Oncoscan local server: serves the static prototype and, when GEMINI_API_KEY is set,
// analyses a case photo with Google's Gemini API (only the photo, area and body site are sent). No dependencies. Node 18+.
//
//   node server.mjs            → http://localhost:4173
//   key and model: put GEMINI_API_KEY=... (and optionally GEMINI_MODEL=...) in a .env file next to this one.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
try { // minimal .env reader
  for (const line of fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch {}
const PORT = +process.env.PORT || 4173;
const KEY = process.env.GEMINI_API_KEY || '';
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.md': 'text/markdown; charset=utf-8', '.csv': 'text/csv' };

const PROMPT = `You support a licensed specialist who triages photos of skin or mouth lesions for possible cancer. You do not diagnose. The specialist makes the decision.

Look only at the photo and report:
- signals: visible features that may indicate cancer. Use plain clinical observations such as asymmetry, irregular or notched border, several colours, blue-grey or white areas, ulceration, crusting, bleeding, raised rolled edge, visible blood vessels. One short phrase each, at most 5. Empty list if there are none.
- calm: visible features that speak against cancer, such as symmetry, one even colour, a smooth regular border. At most 4. Empty list if there are none.
- score: 0 to 100, how strongly this photo needs an in-person specialist look. Under 30 means nothing suspicious, 30 to 64 some concern, 65 or more strong concern.
- unclear: if the photo is out of focus, dark, too distant or obstructed so that border and colour cannot be judged, one sentence saying why. Otherwise an empty string. Be strict: a soft, blurred photo must be reported here.

Describe only what is visible. Do not guess sizes in millimetres. Do not name a diagnosis. Do not mention the patient's history.`;

const SCHEMA = { type: 'OBJECT', required: ['score', 'signals', 'calm', 'unclear'], properties: {
  score: { type: 'INTEGER' }, signals: { type: 'ARRAY', items: { type: 'STRING' } }, calm: { type: 'ARRAY', items: { type: 'STRING' } }, unclear: { type: 'STRING' } } };

const cache = new Map();
async function analyse({ image, area, site }) {
  let mime, data;
  const m = /^data:(image\/[a-z+]+);base64,(.+)$/s.exec(image || '');
  if (m) { mime = m[1]; data = m[2]; }
  else { // a demo image inside review/cases
    const file = path.resolve(ROOT, 'review', 'cases', String(image));
    if (!file.startsWith(path.join(ROOT, 'review', 'cases') + path.sep)) throw Object.assign(new Error('Image path not allowed'), { status: 400 });
    mime = MIME[path.extname(file).toLowerCase()]; if (!mime || !mime.startsWith('image/')) throw Object.assign(new Error('Not an image'), { status: 400 });
    data = fs.readFileSync(file).toString('base64');
  }
  const about = `Area: ${area || 'unknown'}. Body site: ${site || 'unknown'}.`;
  const id = crypto.createHash('sha1').update(MODEL + data + about).digest('hex');
  if (cache.has(id)) return cache.get(id);
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`, {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': KEY }, signal: AbortSignal.timeout(30000),
    body: JSON.stringify({ contents: [{ role: 'user', parts: [{ inline_data: { mime_type: mime, data } }, { text: PROMPT + '\n\n' + about }] }],
      generationConfig: { temperature: 0, responseMimeType: 'application/json', responseSchema: SCHEMA } }) });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(body?.error?.message || `Gemini returned ${r.status}`), { status: 502 });
  const textOut = body?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
  if (!textOut) throw Object.assign(new Error(body?.promptFeedback?.blockReason ? `Gemini declined: ${body.promptFeedback.blockReason}` : 'Gemini returned no analysis'), { status: 502 });
  const j = JSON.parse(textOut), clean = a => (Array.isArray(a) ? a : []).map(s => String(s).trim()).filter(Boolean);
  const out = { score: Math.max(0, Math.min(100, Math.round(+j.score || 0))), signals: clean(j.signals).slice(0, 6), calm: clean(j.calm).slice(0, 5), unclear: String(j.unclear || '').trim(), model: MODEL,
    tokens: { in: body?.usageMetadata?.promptTokenCount ?? null, out: (body?.usageMetadata?.candidatesTokenCount ?? 0) + (body?.usageMetadata?.thoughtsTokenCount ?? 0) || null } };
  cache.set(id, out); return out;
}

const send = (res, status, obj) => { res.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(obj)); };
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/status') return send(res, 200, { ai: !!KEY, model: KEY ? MODEL : null });
  if (url.pathname === '/api/analyse' && req.method === 'POST') {
    if (!KEY) return send(res, 503, { error: 'No GEMINI_API_KEY set' });
    let raw = ''; let size = 0;
    for await (const chunk of req) { size += chunk.length; if (size > 8e6) return send(res, 413, { error: 'Image too large' }); raw += chunk; }
    try { return send(res, 200, await analyse(JSON.parse(raw))); }
    catch (e) { console.error('[analyse]', e.message); return send(res, e.status || 500, { error: e.message }); }
  }
  // static files
  let file = path.join(ROOT, decodeURIComponent(url.pathname));
  if (!file.startsWith(ROOT) || path.basename(file).startsWith('.env')) { res.writeHead(403); return res.end('Forbidden'); }
  try {
    if (fs.statSync(file).isDirectory()) { if (!url.pathname.endsWith('/')) { res.writeHead(301, { location: url.pathname + '/' }); return res.end(); } file = path.join(file, 'index.html'); }
    const buf = fs.readFileSync(file);
    res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' }); res.end(buf);
  } catch { res.writeHead(404, { 'content-type': 'text/plain' }); res.end('Not found'); }
}).listen(PORT, () => console.log(`Oncoscan on http://localhost:${PORT}  ·  AI analysis: ${KEY ? 'on (' + MODEL + ')' : 'off (no GEMINI_API_KEY)'}`));
