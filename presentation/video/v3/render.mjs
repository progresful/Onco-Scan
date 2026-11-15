// Renders index.html frame by frame and mixes the voice lines (vo/line-N.mp3) over a quiet heartbeat bed.
// Needs puppeteer-core, Chrome and ffmpeg; the page must be served (node server.mjs).  usage: node render.mjs <url> <voDir> <out.mp4> [fps]
import p from 'puppeteer-core'; import { spawn, execFileSync } from 'node:child_process'; import fs from 'node:fs'; import path from 'node:path';
const [,, url, voDir, out, fpsArg] = process.argv, fps = +fpsArg || 25;
const b = await p.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, defaultViewport: { width: 1920, height: 1080 } });
const g = await b.newPage(); await g.goto(url, { waitUntil: 'load', timeout: 60000 }); await g.evaluate(() => document.fonts.ready.then(() => 1));
const { dur, starts, cues } = await g.evaluate(() => ({ dur: +window.DURATION.toFixed(2), starts: window.STARTS.map(x => +x.toFixed(2)), cues: window.SFX || [] })), n = Math.round(dur * fps);
// sound effects: each kind is synthesised once, then placed at every cue into one track (sfx.wav)
const sfxDir = path.join(voDir, '..', 'sfx'); fs.mkdirSync(sfxDir, { recursive: true });
const KIND = {
  whoosh: ["anoisesrc=d=0.5:c=pink:a=0.9:seed=7", "highpass=f=500,lowpass=f=6000,afade=t=in:d=0.2:curve=qsin,afade=t=out:st=0.2:d=0.3,volume=0.5"],
  click: ["aevalsrc='0.7*sin(2*PI*2100*t)*exp(-220*t)+0.3*sin(2*PI*900*t)*exp(-160*t):s=44100:d=0.07'", "volume=0.55"],
  tick: ["aevalsrc='0.6*sin(2*PI*2600*t)*exp(-150*t):s=44100:d=0.06'", "volume=0.4"],
  pop: ["aevalsrc='0.7*sin(2*PI*(420+2600*t)*t)*exp(-34*t):s=44100:d=0.14'", "volume=0.45"],
  thud: ["aevalsrc='0.9*sin(2*PI*(95-90*t)*t)*exp(-13*t):s=44100:d=0.4'", "volume=0.7"],
  chime: ["aevalsrc='(0.35*sin(2*PI*880*t)+0.3*sin(2*PI*1318.5*t)+0.22*sin(2*PI*1760*t))*exp(-3.2*t):s=44100:d=1.6'", "afade=t=in:d=0.01,volume=0.6"] };
for (const k in KIND) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', KIND[k][0], '-af', KIND[k][1], '-ar', '44100', '-ac', '1', path.join(sfxDir, k + '.wav')]);
const sfx = path.join(sfxDir, 'sfx.wav'), ev = cues.filter(c => KIND[c.type] && c.t >= 0 && c.t < dur);
{ const a = ['-y', '-loglevel', 'error']; ev.forEach(c => a.push('-i', path.join(sfxDir, c.type + '.wav')));
  a.push('-filter_complex', ev.map((c, i) => `[${i}:a]adelay=${Math.round(c.t * 1000)}:all=1[s${i}]`).join(';') + ';' + ev.map((_, i) => `[s${i}]`).join('') + `amix=inputs=${ev.length}:normalize=0,apad=whole_dur=${dur}[o]`, '-map', '[o]', '-t', String(dur), sfx);
  execFileSync('ffmpeg', a); console.log(ev.length, 'sound cues'); }
const vo = starts.map((_, i) => path.join(voDir, `line-${i + 1}.mp3`)).filter(f => fs.existsSync(f));
const bed = `aevalsrc='0.34*sin(2*PI*52*t)*exp(-16*mod(t,1))+0.25*sin(2*PI*46*t)*exp(-16*mod(t+0.72,1))+(0.03*sin(2*PI*98*t)+0.02*sin(2*PI*116.5*t))*(1-min(1,max(0,(t-${starts[2]})/2)))+0.022*(sin(2*PI*196*t)+sin(2*PI*246.94*t)+sin(2*PI*293.66*t)+0.6*sin(2*PI*392*t))*min(1,max(0,(t-${starts[2]})/2.5))*(0.8+0.2*sin(2*PI*0.25*t)):s=44100:d=${dur}',afade=t=in:d=0.6,afade=t=out:st=${(dur - 2).toFixed(2)}:d=2`;
const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-f', 'lavfi', '-i', bed];
vo.forEach(f => args.push('-i', f)); args.push('-i', sfx);
const fc = vo.map((_, i) => `[${i + 2}:a]aresample=44100,volume=1.5,adelay=${Math.round(starts[i] * 1000)}:all=1[v${i}]`).concat(`[1:a]${vo.map((_, i) => `[v${i}]`).join('')}[${vo.length + 2}:a]amix=inputs=${vo.length + 2}:normalize=0:duration=first,alimiter=limit=0.95[a]`).join(';');
args.push('-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-t', String(dur), '-movflags', '+faststart', out);
const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
for (let i = 0; i < n; i++) { await g.evaluate(t => window.seek(t), i / fps);
  const buf = await g.screenshot({ type: 'jpeg', quality: 90 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 250 === 0) console.log(`frame ${i}/${n}`); }
ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('done', out, vo.length, 'voice lines');
