// Speaks lines.js with ElevenLabs and writes vo/line-N.mp3 plus timing.js (seconds per line).
// The key is read from oriscan-finland/.env (ELEVENLABS_API_KEY) and is never printed.  usage: node voice.mjs
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process'; import { createRequire } from 'node:module'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url)), LINES = createRequire(import.meta.url)('./lines.js');
const env = fs.readFileSync(path.join(here, '../../../.env'), 'utf8'), KEY = (env.match(/^ELEVENLABS_API_KEY=(.+)$/m) || [])[1];
if (!KEY) { console.error('No ELEVENLABS_API_KEY in .env'); process.exit(2); }
const api = (p, o = {}) => fetch('https://api.elevenlabs.io' + p, { ...o, headers: { 'xi-api-key': KEY, 'content-type': 'application/json', ...(o.headers || {}) } });
const r = await api('/v1/voices'); if (!r.ok) { console.error('Voices request failed:', r.status, (await r.text()).slice(0, 200)); process.exit(1); }
const voices = (await r.json()).voices || [], L = v => Object.values(v.labels || {}).join(' ').toLowerCase() + ' ' + (v.description || '').toLowerCase();
const women = voices.filter(v => /female|woman/.test(L(v)));
const forced = process.env.VOICE_ID && (voices.find(v => v.voice_id === process.env.VOICE_ID) || { voice_id: process.env.VOICE_ID, name: process.env.VOICE_NAME || 'library voice', labels: {} });
const pick = forced || women.find(v => /swed|norw|danish|scandinav|nordic|finn/.test(L(v))) || women.find(v => /warm|calm|soft|gentle/.test(L(v))) || women[0] || voices[0];
if (!pick) { console.error('No voices on this account'); process.exit(1); }
console.log('Voice:', pick.name, '|', L(pick).trim().slice(0, 120));
fs.mkdirSync(path.join(here, 'vo'), { recursive: true }); const dur = [];
for (let i = 0; i < LINES.length; i++) { const f = path.join(here, 'vo', `line-${i + 1}.mp3`);
  const t = await api(`/v1/text-to-speech/${pick.voice_id}?output_format=mp3_44100_128`, { method: 'POST', body: JSON.stringify({ text: LINES[i], model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.25, use_speaker_boost: true } }) });
  if (!t.ok) { console.error('Speech failed on line', i + 1, t.status, (await t.text()).slice(0, 200)); process.exit(1); }
  fs.writeFileSync(f, Buffer.from(await t.arrayBuffer()));
  dur.push(+execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim()); console.log(`line ${i + 1}: ${dur[i].toFixed(2)} s`); }
fs.writeFileSync(path.join(here, 'timing.js'), `// Spoken length of each line in seconds (written by voice.mjs; voice: ${pick.name}).\nwindow.VO = ${JSON.stringify(dur.map(d => +d.toFixed(2)))};\n`);
console.log('total', dur.reduce((a, b) => a + b, 0).toFixed(1), 's');
