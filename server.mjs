// Oncoscan server: serves the prototype, stores submitted cases and their photos under data/cases, and, when GEMINI_API_KEY is set,
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

// ---- case store: one folder per case under data/cases, holding case.json and the photos ----
const DATA = path.join(ROOT, 'data', 'cases');
fs.mkdirSync(DATA, { recursive: true });
const caseDir = id => /^FI-\d{4}$/.test(id) ? path.join(DATA, id) : null;
const loadCase = id => { const d = caseDir(id); try { return d ? JSON.parse(fs.readFileSync(path.join(d, 'case.json'), 'utf8')) : null; } catch { return null; } };
const saveCase = c => fs.writeFileSync(path.join(caseDir(c.id), 'case.json'), JSON.stringify(c, null, 1));
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const looksLike = (buf, mime) => mime === 'image/jpeg' ? buf[0] === 0xFF && buf[1] === 0xD8 : mime === 'image/png' ? buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) : buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP';
const str = (v, max) => String(v ?? '').slice(0, max);
const bad = msg => Object.assign(new Error(msg), { status: 400 });

function createCase(b) {
  const imgs = Array.isArray(b.images) ? b.images : [];
  if (imgs.length < 1 || imgs.length > 2) throw bad('Send 1 or 2 photos.');
  const files = imgs.map((u, i) => {
    const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(u)); if (!m) throw bad('Photos must be JPG, PNG or WebP.');
    const buf = Buffer.from(m[2], 'base64'); if (buf.length > 3e6) throw bad('Each photo must be under 3 MB.');
    if (!looksLike(buf, m[1])) throw bad('A photo could not be read.');
    return { name: `${i + 1}.${EXT[m[1]]}`, mime: m[1], buf };
  });
  if (!['Skin', 'Mouth'].includes(b.area)) throw bad('Choose skin or mouth.');
  let id; do { id = 'FI-' + String(crypto.randomInt(1000, 10000)); } while (fs.existsSync(path.join(DATA, id)));
  fs.mkdirSync(path.join(DATA, id));
  files.forEach(f => fs.writeFileSync(path.join(DATA, id, f.name), f.buf));
  const ans = b.answers || {};
  const c = { id, token: crypto.randomBytes(16).toString('hex'), createdAt: Date.now(), email: str(b.email, 200), area: b.area, site: str(b.site, 80), age: str(b.age, 12), text: str(b.text, 800),
    answers: { dur: str(ans.dur, 40), changes: (Array.isArray(ans.changes) ? ans.changes : []).slice(0, 8).map(x => str(x, 40)) }, images: files.map(f => f.name), status: 'open', gem: null, gemErr: null, verdict: null };
  saveCase(c);
  if (KEY) analyse({ image: `data:${files[0].mime};base64,${files[0].buf.toString('base64')}`, area: c.area, site: c.site })   // run the photo description right away
    .then(g => { const cur = loadCase(id); if (cur) { cur.gem = g; saveCase(cur); } })
    .catch(e => { console.error('[analyse]', id, e.message); const cur = loadCase(id); if (cur) { cur.gemErr = String(e.message).slice(0, 140); saveCase(cur); } });
  return c;
}
const listOpen = () => fs.readdirSync(DATA).map(loadCase).filter(c => c && c.status === 'open').sort((a, b) => a.createdAt - b.createdAt)
  .map(({ token, email, ...c }) => c);                                     // the queue never exposes the patient's token or email
async function readJson(req, limit) { let raw = '', size = 0; for await (const ch of req) { size += ch.length; if (size > limit) throw Object.assign(new Error('Upload too large'), { status: 413 }); raw += ch; } try { return JSON.parse(raw || '{}'); } catch { throw bad('Bad request'); } }

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
  try {
    if (url.pathname === '/api/cases' && req.method === 'POST') { const c = createCase(await readJson(req, 9e6)); return send(res, 201, { id: c.id, token: c.token, createdAt: c.createdAt }); }
    if (url.pathname === '/api/cases' && req.method === 'GET') return send(res, 200, { cases: listOpen() });
    const m = /^\/api\/cases\/(FI-\d{4})(?:\/(image|verdict)(?:\/(\d\.(?:jpg|png|webp)))?)?$/.exec(url.pathname);
    if (m) {
      const c = loadCase(m[1]); if (!c) return send(res, 404, { error: 'No such case' });
      if (m[2] === 'image' && m[3] && req.method === 'GET') {
        if (!c.images.includes(m[3])) return send(res, 404, { error: 'No such photo' });
        res.writeHead(200, { 'content-type': MIME[path.extname(m[3])], 'cache-control': 'private, max-age=3600' }); return res.end(fs.readFileSync(path.join(DATA, c.id, m[3])));
      }
      if (m[2] === 'verdict' && req.method === 'POST') {
        const b = await readJson(req, 1e4);
        if (b.undo) { c.verdict = null; c.status = 'open'; }
        else { if (!['pos', 'neg', 'uns'].includes(b.v)) throw bad('Unknown verdict'); c.verdict = { v: b.v, note: str(b.note, 600), at: Date.now() }; c.status = 'answered'; }
        saveCase(c); return send(res, 200, { ok: true });
      }
      if (!m[2] && req.method === 'GET') {                               // the patient's own view of their case
        if (req.headers['x-case-token'] !== c.token) return send(res, 403, { error: 'Wrong case token' });
        return send(res, 200, { id: c.id, createdAt: c.createdAt, status: c.status, verdict: c.verdict });
      }
    }
    if (url.pathname.startsWith('/api/')) return send(res, 404, { error: 'Not found' });
  } catch (e) { return send(res, e.status || 500, { error: e.message }); }
  // static files
  let file = path.join(ROOT, decodeURIComponent(url.pathname));
  if (!file.startsWith(ROOT) || path.basename(file).startsWith('.env') || file.startsWith(path.join(ROOT, 'data'))) { res.writeHead(403); return res.end('Forbidden'); }
  try {
    if (fs.statSync(file).isDirectory()) { if (!url.pathname.endsWith('/')) { res.writeHead(301, { location: url.pathname + '/' }); return res.end(); } file = path.join(file, 'index.html'); }
    const buf = fs.readFileSync(file);
    res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' }); res.end(buf);
  } catch { res.writeHead(404, { 'content-type': 'text/plain' }); res.end('Not found'); }
}).listen(PORT, () => console.log(`Oncoscan on http://localhost:${PORT}  ·  AI analysis: ${KEY ? 'on (' + MODEL + ')' : 'off (no GEMINI_API_KEY)'}`));
