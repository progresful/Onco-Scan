// Oncoscan landing — motion: GSAP + ScrollTrigger, native scrolling, no WebGL.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = !!(window.gsap && window.ScrollTrigger);
const motion = hasGsap && !reduce;
if (hasGsap) { gsap.registerPlugin(ScrollTrigger); gsap.ticker.lagSmoothing(0); } // keep animations on real time even if frames are throttled

/* ---------- nav ---------- */
const nav = $('.nav'), menuBtn = $('.menu-btn'), menu = $('#mobile-menu');
const onScrollNav = () => nav.classList.toggle('is-solid', scrollY > 40);
addEventListener('scroll', onScrollNav, { passive: true }); onScrollNav();
const setMenu = open => { menuBtn.setAttribute('aria-expanded', open); menu.hidden = !open; document.body.style.overflow = open ? 'hidden' : ''; };
menuBtn.addEventListener('click', () => setMenu(menu.hidden));
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });

/* ---------- split headings (accessible) ---------- */
function split(el) {
  el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  const wrapText = node => {
    const frag = document.createDocumentFragment();
    node.textContent.split(/([ \n\t]+)/).forEach(part => {
      if (!part) return;
      if (/^[ \n\t]+$/.test(part)) { frag.append(' '); return; }
      const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true'); w.style.overflow = 'hidden'; w.style.verticalAlign = 'top'; w.style.paddingBottom = '.08em';
      const i = document.createElement('span'); i.className = 'wi'; i.textContent = part; w.append(i); frag.append(w);
    });
    node.replaceWith(frag);
  };
  const walk = n => [...n.childNodes].forEach(c => c.nodeType === 3 ? wrapText(c) : c.nodeType === 1 && walk(c));
  walk(el);
  return $$('.wi', el);
}

if (motion) {
  /* hero intro */
  const h1Words = split($('.hero h1'));
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero-img', { scale: 1.08, duration: 1.8, ease: 'power2.out' }, 0)
    .from('.tc', { y: 16, autoAlpha: 0, duration: .6 }, .1)
    .from(h1Words, { yPercent: 110, duration: .9, stagger: .06 }, .2)
    .from('.hero-sub', { y: 20, autoAlpha: 0, duration: .7 }, .75)
    .from('.hero-cta > *', { y: 16, autoAlpha: 0, duration: .6, stagger: .08 }, .9)
    .from('.hero-sim', { x: 24, autoAlpha: 0, duration: .7 }, 2.2);

  /* section headings + copy */
  $$('h2.split').forEach(h => {
    const words = split(h);
    gsap.from(words, { yPercent: 110, duration: .8, ease: 'power3.out', stagger: .045, scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
  });
  $$('.body, .stat, .ticks li, .trust-item, .wave, .faq-list details, .origin, .patients, .form, .flow-tabs').forEach(el =>
    gsap.from(el, { y: 24, autoAlpha: 0, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));

  /* image parallax */
  $$('.aud-img img').forEach(img => gsap.fromTo(img, { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } }));
}

/* ---------- hero case clock ---------- */
const clockEl = $('[data-clock]'); const t0 = Date.now();
const pad = n => String(n).padStart(2, '0');
let clockT = reduce ? null : setInterval(() => {
  if (document.hidden) return;
  const s = Math.floor((Date.now() - t0) / 1000);
  clockEl.textContent = `T+${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
}, 1000);

/* ---------- Finland map (data graphic from public city coordinates) ---------- */
const HUBS = [['Helsinki', 60.17, 24.94], ['Turku', 60.45, 22.27], ['Tampere', 61.50, 23.76], ['Kuopio', 62.89, 27.68], ['Oulu', 65.01, 25.47]];
const TOWNS = [[66.50,25.73],[65.74,24.56],[64.23,27.73],[65.96,29.19],[67.42,26.59],[68.91,27.03],[69.91,27.03],[67.65,24.91],[67.96,23.68],[68.38,23.63],[66.71,27.43],[66.83,28.67],[65.85,24.15],[64.68,24.48],[64.07,24.53],[63.84,23.13],[63.10,21.62],[62.79,22.84],[62.24,25.75],[62.60,29.76],[63.32,30.02],[63.54,29.14],[64.13,29.52],[64.89,28.91],[63.56,27.19],[61.87,28.88],[61.69,27.27],[61.06,28.19],[60.47,26.95],[60.87,26.70],[60.98,25.66],[61.00,24.46],[61.49,21.80],[61.13,21.51],[62.27,21.38],[60.38,23.13],[59.82,22.97],[60.39,25.66],[62.30,27.16],[62.32,27.87],[62.60,25.73],[62.10,30.14],[62.67,30.93],[65.36,27.00],[68.66,27.54],[66.77,23.96],[60.10,19.94]];
const px = (lat, lon) => [20 + (lon - 19.5) * 43.5, 20 + (70.2 - lat) * 100];
const km = (a, b, c, d) => { const R = 6371, r = Math.PI / 180, x = Math.sin((c - a) * r / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin((d - b) * r / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); };
(function drawMap() {
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const gL = $('.map-lines'), gD = $('.map-dots'), gH = $('.map-hubs'); let far = 0;
  TOWNS.forEach(([la, lo]) => {
    let best = HUBS[0], bd = Infinity; HUBS.forEach(h => { const d = km(la, lo, h[1], h[2]); if (d < bd) { bd = d; best = h; } });
    far = Math.max(far, bd);
    const [x, y] = px(la, lo), [hx, hy] = px(best[1], best[2]);
    const line = mk('line', { x1: x, y1: y, x2: hx, y2: hy }); line.dataset.d = bd; gL.append(line);
    const dot = mk('circle', { cx: x, cy: y, r: 4 }); dot.dataset.d = bd; gD.append(dot);
  });
  HUBS.forEach(([name, la, lo]) => {
    const [x, y] = px(la, lo);
    gH.append(mk('circle', { cx: x, cy: y, r: 20, class: 'ring' }), mk('circle', { cx: x, cy: y, r: 8 }));
    const left = name === 'Turku'; const t = mk('text', { x: x + (left ? -16 : 16), y: y + (name === 'Helsinki' ? 30 : 5), 'text-anchor': left ? 'end' : 'start' }); t.textContent = name; gH.append(t);
  });
  const farEl = $('[data-far]'); const farKm = Math.round(far / 10) * 10; farEl.textContent = farKm;
  if (!motion) return;
  const st = { trigger: '.map', start: 'top 70%', once: true };
  gsap.from('.map-hubs circle:not(.ring)', { scale: 0, transformOrigin: 'center', duration: .6, stagger: .08, ease: 'back.out(2)', scrollTrigger: st });
  gsap.from('.map-hubs .ring, .map-hubs text', { autoAlpha: 0, duration: .6, delay: .4, scrollTrigger: st });
  gsap.from($$('.map-dots circle').sort((a, b) => a.dataset.d - b.dataset.d), { scale: 0, transformOrigin: 'center', duration: .4, stagger: .025, delay: .5, scrollTrigger: st });
  $$('.map-lines line').forEach(l => { const len = l.getTotalLength(); l.style.strokeDasharray = len; gsap.from(l, { strokeDashoffset: len, duration: .9, delay: .9 + l.dataset.d / 600, ease: 'power2.out', scrollTrigger: st }); });
  const o = { v: 0 }; gsap.to(o, { v: farKm, duration: 1.6, ease: 'power2.out', scrollTrigger: st, onUpdate: () => farEl.textContent = Math.round(o.v) });
})();

/* ---------- form (demo: no backend) ---------- */
const form = $('.form');
form.addEventListener('submit', e => {
  e.preventDefault(); let first = null;
  $$('.field', form).forEach(f => {
    const c = $('input,select,textarea', f); if (!c.required) return;
    const bad = !c.value.trim() || (c.type === 'email' && !/^\S+@\S+\.\S+$/.test(c.value));
    f.classList.toggle('invalid', bad); c.setAttribute('aria-invalid', bad);
    if (bad) { c.setAttribute('aria-describedby', $('.err', f).id); first ||= c; } else c.removeAttribute('aria-describedby');
  });
  if (first) { first.focus(); return; }
  const btn = $('button[type=submit]', form), label = $('.btn-label', btn);
  btn.disabled = true; label.textContent = 'Sending…';
  setTimeout(() => { btn.disabled = false; label.textContent = 'Request a call'; $('.form-ok', form).textContent = 'Demo only. Nothing was sent.'; form.reset(); }, 900);
});
form.addEventListener('input', e => { const f = e.target.closest('.field'); if (f) f.classList.remove('invalid'); });

/* ---- hero simulation (illustrative cases, not real data) ---- */
(function sim() {
  const list = $('.sim-list'); if (!list) return;
  const TOWNS = ['Inari','Kuusamo','Kajaani','Kemi','Sodankylä','Joensuu','Savonlinna','Kokkola','Rovaniemi','Mikkeli','Lieksa','Pori'];
  const STAGES = ['Received','AI pre-sorted','With specialist','Answered'];
  const OUT = [['neg','No concern'],['neg','No concern'],['neg','No concern'],['pos','Fast-track'],['uns','Better photo']];
  const rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.floor(Math.random() * a.length)];
  const fmt = m => `T+${String(Math.floor(m / 60)).padStart(2, '0')}:${String(Math.round(m) % 60).padStart(2, '0')}`;
  let n = 400 + Math.floor(Math.random() * 80), cases = [], answered = [], fast = 0, timer = null, visible = true;
  const draw = c => {
    c.el.querySelector('.sim-t').textContent = fmt(c.t);
    c.el.querySelectorAll('.sim-bar i').forEach((b, i) => b.classList.toggle('on', i <= c.stage));
    const st = c.el.querySelector('.sim-status');
    st.innerHTML = c.stage < 3 ? `<span>${STAGES[c.stage]}</span>` : `<span>Answered</span><em class="${c.out[0]}">${c.out[1]}</em>`;
  };
  const add = (stage = 0) => {
    const c = { id: 'FI-0' + (++n), area: Math.random() < .55 ? 'Skin' : 'Mouth', town: pick(TOWNS), stage: 0, t: 0, out: pick(OUT) };
    c.el = document.createElement('li'); c.el.className = 'sim-case';
    c.el.innerHTML = `<div class="sim-row"><span><b>${c.id}</b> <span class="sim-where">· ${c.area} · ${c.town}</span></span><span class="sim-t"></span></div><div class="sim-bar"><i></i><i></i><i></i><i></i></div><div class="sim-status"></div>`;
    list.prepend(c.el); cases.unshift(c); for (let i = 0; i < stage; i++) advance(c, true); draw(c); return c;
  };
  const advance = (c, quiet) => {
    c.stage++; c.t = c.stage === 1 ? 4 : c.stage === 2 ? rnd(60, 600) : Math.min(1425, c.t + rnd(40, 420));
    if (c.stage === 3 && !quiet) {
      answered.push(c.t); if (c.out[0] === 'pos') fast++;
      const s = answered.slice().sort((a, b) => a - b), med = s[Math.floor(s.length / 2)];
      $('[data-sim-n]').textContent = answered.length; $('[data-sim-f]').textContent = fast;
      $('[data-sim-m]').textContent = `${Math.floor(med / 60)} h ${String(Math.round(med) % 60).padStart(2, '0')} min`;
    }
  };
  const tick = () => {
    if (document.hidden || !visible) return;
    const done = cases.find(c => c.stage === 3 && !c.leaving);
    if (done && done.shown) { done.leaving = true; done.el.classList.add('out'); setTimeout(() => { done.el.remove(); cases = cases.filter(x => x !== done); add(); }, 460); return; }
    if (done) { done.shown = true; return; }
    const c = cases.slice().reverse().find(c => c.stage < 3); if (c) { advance(c); draw(c); }
  };
  [2, 2, 1, 0].forEach(s => add(s));
  if (reduce) return;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe($('.hero'));
  timer = setInterval(tick, 1300);
  addEventListener('pagehide', () => clearInterval(timer), { once: true });
})();

/* ---------- step-by-step tabs (patient / specialist) ---------- */
(function tabs() {
  const tabs = $$('.flow-tabs [role=tab]'); if (!tabs.length) return;
  const show = (t, focus) => { tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; }); if (focus) t.focus(); };
  tabs.forEach((t, i) => { t.addEventListener('click', () => show(t)); t.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); show(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true); } }); });
  show(tabs[0]);
})();

/* refresh measurements after fonts and images settle */
if (hasGsap) { document.fonts?.ready.then(() => ScrollTrigger.refresh()); addEventListener('load', () => ScrollTrigger.refresh()); }
