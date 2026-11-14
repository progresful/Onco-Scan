// Renders index.html frame by frame and mixes the voice lines (vo/line-N.mp3) over a quiet heartbeat bed.
// Needs puppeteer-core, Chrome and ffmpeg; the page must be served (node server.mjs).  usage: node render.mjs <url> <voDir> <out.mp4> [fps]
import p from 'puppeteer-core'; import { spawn } from 'node:child_process'; import fs from 'node:fs'; import path from 'node:path';
const [,, url, voDir, out, fpsArg] = process.argv, fps = +fpsArg || 25;
const b = await p.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, defaultViewport: { width: 1920, height: 1080 } });
const g = await b.newPage(); await g.goto(url, { waitUntil: 'load', timeout: 60000 }); await g.evaluate(() => document.fonts.ready.then(() => 1));
const { dur, starts } = await g.evaluate(() => ({ dur: +window.DURATION.toFixed(2), starts: window.STARTS.map(x => +x.toFixed(2)) })), n = Math.round(dur * fps);
const vo = starts.map((_, i) => path.join(voDir, `line-${i + 1}.mp3`)).filter(f => fs.existsSync(f));
const bed = `aevalsrc='0.34*sin(2*PI*52*t)*exp(-16*mod(t,1))+0.25*sin(2*PI*46*t)*exp(-16*mod(t+0.72,1))+(0.03*sin(2*PI*98*t)+0.02*sin(2*PI*116.5*t))*(1-min(1,max(0,(t-${starts[2]})/2)))+0.022*(sin(2*PI*196*t)+sin(2*PI*246.94*t)+sin(2*PI*293.66*t)+0.6*sin(2*PI*392*t))*min(1,max(0,(t-${starts[2]})/2.5))*(0.8+0.2*sin(2*PI*0.25*t)):s=44100:d=${dur}',afade=t=in:d=0.6,afade=t=out:st=${(dur - 2).toFixed(2)}:d=2`;
const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-f', 'lavfi', '-i', bed];
vo.forEach(f => args.push('-i', f));
const fc = vo.map((_, i) => `[${i + 2}:a]aresample=44100,volume=1.5,adelay=${Math.round(starts[i] * 1000)}:all=1[v${i}]`).concat(`[1:a]${vo.map((_, i) => `[v${i}]`).join('')}amix=inputs=${vo.length + 1}:normalize=0:duration=first,alimiter=limit=0.95[a]`).join(';');
args.push('-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-t', String(dur), '-movflags', '+faststart', out);
const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
for (let i = 0; i < n; i++) { await g.evaluate(t => window.seek(t), i / fps);
  const buf = await g.screenshot({ type: 'jpeg', quality: 90 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 250 === 0) console.log(`frame ${i}/${n}`); }
ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('done', out, vo.length, 'voice lines');
