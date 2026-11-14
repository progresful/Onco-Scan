# Oncoscan landing page — plan

Stack: a single `index.html` + `styles.css` + `main.js`. No build step. GSAP, ScrollTrigger, Lenis and Three.js loaded from a CDN.
Skills used: **build-awwwards-quality-sites**, with **gsap** for motion and **no-ai-design-slop** as the quality gate.

---

## 1. Art direction

**Visual thesis: "The 24-hour clock."**
Oncoscan's whole promise is time. The site is built around a timecode running from `T+00:00` (the photo is taken) to `T+24:00` (the specialist answers). Every section is a moment on that clock. The look is calm and clinical-editorial, like a well-designed medical journal, not a startup gradient page.

| Element | Choice |
|---|---|
| Hero focal asset | Large photograph of a clinician's hand holding a phone over an exam light. A WebGL **scan line** sweeps across it once and leaves a thin triage overlay (urgency tag + timecode). The "scan" is the brand metaphor. |
| Typefaces | **Schibsted Grotesk** for headings (sturdy, Nordic, not the usual AI default). **Inter** for body text. **IBM Plex Mono** for timecodes and labels. |
| Colours | Bone `#F3F1EC` (background), ink `#0E1A24` (text, dark sections), signal orange `#E8743B` (urgency, CTA; same as the deck), clinical blue `#2F6FB0` (used sparingly for data). |
| Layout idiom | Wide editorial grid, big type, lots of air, thin 1px rules, timecode labels in the margin of each section. No glass, no blobs, no bento grid. |
| Smooth scroll | **Lenis** (lighter than Locomotive and works cleanly with ScrollTrigger). Only one engine. Off under reduced motion. |
| Three.js | **Yes, one canvas, hero only:** the scan-line shader over the hero photo. Static poster image when WebGL is unavailable or motion is reduced. Paused offscreen. |
| Icons | Solar icons via Iconify. |
| Data graphic | Finland dot map (section 2), drawn from real city coordinates: 5 university-hospital cities vs. clinics across the country. Data graphics are allowed to be authored. |

---

## 2. Page content, section by section

### 0 · Navigation
Oncoscan wordmark · How it works · For clinics · For specialists · For counties · **Start a pilot** (button).
On mobile: a full-screen menu.

### 1 · Hero — `T+00:00`
- **Headline:** "Is it cancer? Know within 24 hours."
- **Subline:** "Oncoscan connects every GP and dentist in Finland to a cancer specialist. Take a photo, our AI sorts it, a specialist answers within a day."
- **CTAs:** Start a pilot · See how it works
- **Motion:** headline words rise one by one; the scan line passes over the photo; a timecode ticks from `T+00:00`.

### 2 · The problem — "Where you live shouldn't decide when cancer is found"
- Finland dot map: specialists cluster in 5 cities; clinics are everywhere.
- Short text: the wait is at the very first step, "is this cancer?", before a referral even starts.
- One big figure: average wait from suspicion to a specialist's view. **Shown only if we have a sourced number.**
- Link to the National Cancer Strategy 2026–2035, Goal 3.

### 3 · How it works — pinned 4-step timeline
The section pins while the timecode advances through 4 steps. Each step shows a small product screen built in HTML (real interface, not an illustration).

| Timecode | Step | Text |
|---|---|---|
| `T+00:03` | Capture | GP or dentist photographs the finding and adds symptoms. 3 minutes. |
| `T+00:04` | AI pre-sort | Model trained on thousands of labelled cases estimates likelihood and flags urgency. |
| `T+≤24:00` | Specialist verdict | A licensed specialist from the national pool confirms or clears the case. |
| `T+days` | Fast-track | Cleared: patient reassured. Suspicious: urgent referral and biopsy, the same week. |

Note under the timeline: "Oncoscan resolves the suspicion. Final diagnosis is still made by biopsy."

### 4 · Who it's for — three rows
| Audience | Headline | Points |
|---|---|---|
| **Clinics (GPs, dentists)** | "A specialist in your pocket" | Answer in 24 h · clear next step · fewer unnecessary referrals |
| **Specialists** | "Review from anywhere" | ~20 cases per hour · paid per review · flexible hours · sign up |
| **Counties** | "Equal care, measurable" | Shorter queues · earlier-stage cancers · KPI dashboard · pay per case |

Plus one line for patients: "For patients: an answer in a day instead of weeks of waiting."

### 5 · Safety and trust — "AI sorts. A doctor decides."
Four short items with icons:
- Human in the loop: a licensed specialist signs every verdict.
- Medical-device status: **[needs your CE/MDR facts]**.
- Data: GDPR, hosted in the EU.
- Licensing: reviewers licensed by Valvira for Finnish patients.

### 6 · Proof — "Already running in Latvia"
3–4 large figures (cases, median answer time, sensitivity, clinics). **Only real numbers. If you can't share them yet, this section is left out.**

### 7 · Roadmap — "One platform, 10 cancer types"
Horizontal scroll of three waves:
- Wave 1 (now): oral, skin
- Wave 2: cervical, eye, visible lumps
- Wave 3: colorectal, lung, prostate, ovarian (lab- and imaging-based triage)

### 8 · Start a pilot — final CTA
- **Headline:** "Run a 6-month pilot in your county."
- What's included: setup, training, specialist pool, KPI reporting.
- **Form:** name, organisation, role (county / clinic / specialist), email, message. Full states: focus, error, sending, success. No backend yet: it shows a success state and logs locally (or a `mailto:` link, your choice).

### 9 · FAQ
- Is Oncoscan a diagnosis? (No: it resolves the suspicion; biopsy confirms.)
- Who is responsible for the verdict?
- What does it cost?
- How is patient data protected?
- Which cancers are covered today?

### 10 · Footer
Wordmark, contact, links, "Built at Junction 2026", image credits.

---

## 3. Motion plan

| Where | Motion |
|---|---|
| Hero | GSAP intro: rule lines draw, headline words rise, scan line sweeps, timecode starts. Content readable from frame one. |
| Section headings | Word-by-word rise, small stagger. Accessible full text kept. |
| Dot map | Clinics appear region by region as you scroll; 5 specialist cities glow; connecting lines show the national pool. |
| How it works | Pinned; timecode scrubs `T+00:00 → T+24:00`; product screens cross-fade. |
| Roadmap | Horizontal scrub of the three waves. |
| Hover / focus | CSS only: underline sweeps, button fill, visible focus rings. |
| Reduced motion | Lenis and scrubbing off; everything shown in its final state. |

---

## 4. Assets

| Asset | Source |
|---|---|
| Hero photo (clinician + phone + exam light) | **Your choice:** generated original image, licensed stock (e.g. Unsplash), or your own photo |
| Section photos (dentist at work, specialist reviewing) | Same as above |
| Product screens | Built in HTML/CSS |
| Finland map | City coordinates (public), drawn as dots |
| Icons | Solar via Iconify |
| People photos | None. No fake testimonials or team faces unless you provide real ones. |

---

## 5. Open questions before building

1. **Images:** generate originals, use licensed stock, or do you have photos?
2. **Latvian numbers:** can we show real figures (cases, answer time, sensitivity)? If not, section 6 is left out.
3. **CE / MDR status:** what can we truthfully say?
4. **Form:** `mailto:` to which address, or a dummy success state for the demo?
5. **Language:** English only, or English + Finnish?
