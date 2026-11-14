// Runs the server's Gemini photo analysis over the labelled HAM10000 sample and reports how the
// score separates lesions confirmed as cancer or pre-cancer from benign ones.
//   node tools/eval.mjs            (server must be running with a GEMINI_API_KEY)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'review/cases/ham10000'), BASE = process.env.BASE || 'http://localhost:4173';
const MALIGNANT = new Set(['mel', 'bcc', 'akiec']);   // melanoma, basal cell carcinoma, actinic keratosis / intraepithelial carcinoma
const NAME = { mel: 'melanoma', bcc: 'basal cell carcinoma', akiec: 'actinic keratosis / early SCC', nv: 'benign mole', bkl: 'benign keratosis', df: 'dermatofibroma', vasc: 'vascular lesion' };
const rows = JSON.parse(fs.readFileSync(path.join(DIR, 'sample.json'), 'utf8'));
const out = []; let tin = 0, tout = 0;
for (const r of rows) {
  const res = await fetch(BASE + '/api/analyse', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ image: `ham10000/${r.image_id}.jpg`, area: 'Skin', site: r.localization }) });
  const j = await res.json();
  if (!res.ok) { console.error(r.image_id, 'failed:', j.error); continue; }
  tin += j.tokens?.in || 0; tout += j.tokens?.out || 0;
  out.push({ image: r.image_id, dx: r.dx, label: NAME[r.dx], confirmed_by: r.dx_type, malignant: MALIGNANT.has(r.dx), score: j.score, unclear: !!j.unclear, signals: j.signals, calm: j.calm });
}
const at = t => { const m = out.filter(o => o.malignant), b = out.filter(o => !o.malignant), tp = m.filter(o => o.score >= t).length, tn = b.filter(o => o.score < t).length;
  return { threshold: t, flagged_cancer: `${tp}/${m.length}`, cleared_benign: `${tn}/${b.length}`, sensitivity: +(tp / m.length).toFixed(2), specificity: +(tn / b.length).toFixed(2) }; };
const byDx = Object.keys(NAME).map(dx => { const g = out.filter(o => o.dx === dx); return { dx, label: NAME[dx], n: g.length, scores: g.map(o => o.score).sort((a, b) => a - b).join(' '), mean: g.length ? Math.round(g.reduce((n, o) => n + o.score, 0) / g.length) : null }; });
const summary = { date: new Date().toISOString(), model: out.length ? (await (await fetch(BASE + '/api/status')).json()).model : null, images: out.length, at65: at(65), at30: at(30), byDx, tokens: { in: tin, out: tout, perImageIn: Math.round(tin / out.length), perImageOut: Math.round(tout / out.length) } };
fs.writeFileSync(path.join(DIR, `gemini-eval-${summary.model}.json`), JSON.stringify({ summary, results: out }, null, 1));
console.log(JSON.stringify(summary, null, 1));
