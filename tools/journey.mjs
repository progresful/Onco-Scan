// Drives the real Oncoscan prototype in headless Chrome: screenshots, recordings, repeated-run check.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const BASE = 'http://localhost:4173', OUT = process.argv[2], RUNS = +(process.argv[3] || 5);
fs.mkdirSync(OUT + '/shots', { recursive: true }); fs.mkdirSync(OUT + '/rec', { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, defaultViewport: { width: 1920, height: 1080 }, args: ['--hide-scrollbars'] });
const shot = (page, name) => page.screenshot({ path: `${OUT}/shots/${name}.png` });
const visible = (page, n) => page.waitForFunction(n => !document.querySelector(`[data-step="${n}"]`).hidden, { timeout: 8000 }, n);

// synthetic test photos (clearly not clinical images): sharp, dark, blurred
async function addPhotos(page, kinds) {
  await page.evaluate(async kinds => {
    const make = kind => new Promise(res => {
      const c = document.createElement('canvas'); c.width = 1000; c.height = 750; const x = c.getContext('2d');
      x.fillStyle = kind === 'dark' ? '#17110d' : '#d8b89c'; x.fillRect(0, 0, 1000, 750);
      for (let i = 0; i < 900; i++) { const v = kind === 'dark' ? 20 : 150; x.fillStyle = `rgb(${v + Math.random() * 60 | 0},${v * .75 + Math.random() * 50 | 0},${v * .6 + Math.random() * 40 | 0})`; x.fillRect(Math.random() * 1000, Math.random() * 750, 5, 5); }
      x.fillStyle = kind === 'dark' ? '#0a0705' : '#5b3b2c'; x.beginPath(); x.ellipse(500, 375, 90, 70, .4, 0, 7); x.fill();
      let out = c;
      if (kind === 'blur') { out = document.createElement('canvas'); out.width = 1000; out.height = 750; const y = out.getContext('2d'); y.filter = 'blur(14px)'; y.drawImage(c, 0, 0); }
      out.toBlob(b => res(new File([b], kind + '.jpg', { type: 'image/jpeg' })), 'image/jpeg', .9);
    });
    const dt = new DataTransfer(); for (const k of kinds) dt.items.add(await make(k));
    const inp = document.querySelector('#files'); inp.files = dt.files; inp.dispatchEvent(new Event('change'));
  }, kinds);
  await page.waitForFunction(n => document.querySelectorAll('#thumbs .thumb').length === n, { timeout: 8000 }, kinds.length);
}

async function patientSubmit(page, cap, slow) {
  const d = slow ? 28 : 0, pause = slow ? 900 : 60;
  await page.goto(BASE + '/patient/'); await page.evaluate(() => localStorage.clear()); await page.reload(); await sleep(pause);
  if (cap) await shot(page, cap + '-1-signin');
  await page.type('#email', 'demo.patient@example.test', { delay: d }); await page.click('[data-step="0"] button[type=submit]'); await visible(page, 1); await sleep(pause);
  await page.evaluate(() => document.querySelector('input[name=area][value=Skin]').click()); await page.type('#site', 'Left forearm', { delay: d }); await sleep(pause);
  if (cap) await shot(page, cap + '-2-area');
  await page.click('[data-step="1"] button[type=submit]'); await visible(page, 2);
  await addPhotos(page, ['sharp', 'sharp']); await sleep(pause);
  if (cap) await shot(page, cap + '-3-photos');
  await page.click('#photos-next'); await visible(page, 3);
  await page.select('#dur', 'More than 6 weeks'); await page.select('#age', '40–49'); await page.evaluate(() => document.querySelector('.checks input').click());
  await page.type('#desc', 'A mole that looks larger than last year.', { delay: d }); await sleep(pause);
  if (cap) await shot(page, cap + '-4-description');
  await page.click('[data-step="3"] button[type=submit]'); await visible(page, 4);
  await page.select('#muni', 'Rovaniemi'); await page.click('#consent'); await sleep(pause);
  if (cap) await shot(page, cap + '-5-cover');
  await page.click('#send'); await visible(page, 5);
  return page.$eval('#s-id', e => e.textContent);
}

async function loop(i, capture) {
  const t0 = Date.now(); const patient = await browser.newPage(); let rec;
  if (capture) rec = await patient.screencast({ path: `${OUT}/rec/a-patient.webm` });
  const id = await patientSubmit(patient, capture ? 'patient' : null, capture);
  if (capture) { await sleep(5600); await shot(patient, 'patient-6-case'); await rec.stop(); }
  const review = await browser.newPage(); await review.goto(BASE + '/review/'); await sleep(capture ? 1200 : 150);
  if (capture) rec = await review.screencast({ path: `${OUT}/rec/b-review.webm` });
  const first = await review.$eval('#c-id', e => e.textContent);
  if (capture) { await sleep(1800); await shot(review, 'review-1-patient-case'); }
  await review.keyboard.press('ArrowRight'); await review.waitForSelector('#note.on', { timeout: 5000 }); await sleep(capture ? 1500 : 60);
  if (capture) await shot(review, 'review-2-note');
  await review.keyboard.press('Enter'); await sleep(capture ? 1200 : 100);
  if (capture) { await review.keyboard.press('Space'); await sleep(2200); await shot(review, 'review-3-ai-preread'); await rec.stop(); }
  await patient.bringToFront();
  if (capture) rec = await patient.screencast({ path: `${OUT}/rec/c-result.webm` });
  await visible(patient, 6); await sleep(capture ? 1800 : 50);
  if (capture) await shot(patient, 'patient-7-email');
  await patient.click('#open-result'); await visible(patient, 7); await sleep(capture ? 2600 : 50);
  if (capture) { await shot(patient, 'patient-8-result'); await rec.stop(); }
  const title = await patient.$eval('#r-title', e => e.textContent), note = await patient.$eval('#r-note', e => e.textContent);
  await patient.close(); await review.close();
  return { run: i, ok: first === id && /in person/.test(title) && note.length > 10, caseId: id, firstInQueue: first, result: title, ms: Date.now() - t0 };
}

const report = { date: new Date().toISOString(), runs: [] };
// landing screenshots
{ const p = await browser.newPage(); await p.goto(BASE + '/landing/'); await sleep(7000); await shot(p, 'landing-1-hero');
  await p.evaluate(() => { const e = document.querySelector('#steps'); scrollTo(0, e.getBoundingClientRect().top + scrollY - 70); }); await sleep(2500); await shot(p, 'landing-2-steps-patient');
  await p.click('#tab-specialist'); await sleep(900); await shot(p, 'landing-3-steps-specialist');
  await p.evaluate(() => { const e = document.querySelector('#problem'); scrollTo(0, e.getBoundingClientRect().top + scrollY - 70); }); await sleep(4000); await shot(p, 'landing-4-gap-map');
  report.farKm = await p.$eval('[data-far]', e => e.textContent); await p.close(); }
for (let i = 1; i <= RUNS; i++) { try { report.runs.push(await loop(i, i === 1)); } catch (e) { report.runs.push({ run: i, ok: false, error: String(e).slice(0, 200) }); } }
// photo quality check: sharp / dark / blurred
{ const p = await browser.newPage(); await p.goto(BASE + '/patient/'); await p.evaluate(() => localStorage.clear()); await p.reload();
  await p.type('#email', 'demo.patient@example.test'); await p.click('[data-step="0"] button[type=submit]'); await visible(p, 1);
  await p.evaluate(() => document.querySelector('input[name=area][value=Skin]').click()); await p.type('#site', 'Left forearm'); await p.click('[data-step="1"] button[type=submit]'); await visible(p, 2);
  await addPhotos(p, ['sharp', 'dark', 'blur']); await sleep(400);
  report.quality = await p.$$eval('#thumbs .q', els => els.map(e => e.textContent)); await shot(p, 'patient-3b-quality-check'); await p.close(); }
// phone width (emulated 390x844): submit and check for sideways overflow at each step
{ const p = await browser.newPage(); await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const over = []; const chk = async n => over.push({ step: n, overflowPx: await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) });
  await p.goto(BASE + '/patient/'); await p.evaluate(() => localStorage.clear()); await p.reload(); await chk(0); await shot(p, 'phone-1-signin');
  await p.type('#email', 'demo.patient@example.test'); await p.click('[data-step="0"] button[type=submit]'); await visible(p, 1); await chk(1);
  await p.evaluate(() => document.querySelector('input[name=area][value=Mouth]').click()); await p.type('#site', 'Lower lip'); await p.click('[data-step="1"] button[type=submit]'); await visible(p, 2);
  await addPhotos(p, ['sharp']); await chk(2); await shot(p, 'phone-2-photos'); await p.click('#photos-next'); await visible(p, 3); await chk(3);
  await p.select('#dur', 'More than 6 weeks'); await p.select('#age', '60–69'); await p.type('#desc', 'Sore that has not healed.'); await p.click('[data-step="3"] button[type=submit]'); await visible(p, 4); await chk(4);
  await p.select('#muni', 'Inari'); await p.click('#consent'); await p.click('#send'); await visible(p, 5); await sleep(1500); await chk(5); await shot(p, 'phone-3-case');
  await p.goto(BASE + '/landing/'); await sleep(5000); over.push({ step: 'landing', overflowPx: await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) }); await shot(p, 'phone-4-landing');
  await p.goto(BASE + '/review/'); await sleep(800); over.push({ step: 'review', overflowPx: await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) }); await shot(p, 'phone-5-review');
  await p.evaluate(() => localStorage.clear()); report.phone = over; await p.close(); }
await browser.close();
fs.writeFileSync(OUT + '/run-report.json', JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 1));
