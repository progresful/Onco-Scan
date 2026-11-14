// Renders index.html frame by frame into video.mp4 (needs puppeteer-core, Chrome and ffmpeg; the page must be served, e.g. by `node server.mjs`).
// usage: node render.mjs <url> <out.mp4> [fps]
import p from 'puppeteer-core'; import { spawn } from 'node:child_process';
const [,, url, out, fpsArg] = process.argv, fps = +fpsArg || 25;
const b = await p.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, defaultViewport: { width: 1920, height: 1080 } });
const g = await b.newPage(); await g.goto(url, { waitUntil: 'load', timeout: 60000 }); await g.evaluate(() => document.fonts.ready.then(() => 1));
const dur = await g.evaluate(() => window.DURATION), n = Math.round(dur * fps);
const audio = `aevalsrc='0.75*sin(2*PI*52*t)*exp(-16*mod(t,1))+0.55*sin(2*PI*46*t)*exp(-16*mod(t+0.72,1))+(0.05*sin(2*PI*98*t)+0.035*sin(2*PI*116.5*t))*(1-min(1,max(0,(t-32)/2)))+0.045*(sin(2*PI*196*t)+sin(2*PI*246.94*t)+sin(2*PI*293.66*t)+0.6*sin(2*PI*392*t))*min(1,max(0,(t-33.5)/3))*(0.8+0.2*sin(2*PI*0.25*t)):s=44100:d=${dur}',afade=t=in:d=1,afade=t=out:st=${dur - 2.5}:d=2.5`;
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-f', 'lavfi', '-i', audio, '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
for (let i = 0; i < n; i++) { await g.evaluate(t => window.seek(t), i / fps);
  const buf = await g.screenshot({ type: 'jpeg', quality: 90 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 250 === 0) console.log(`frame ${i}/${n}`); }
ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('done', out);
