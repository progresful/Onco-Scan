# Oncoscan — Cancer suspicion resolved in 24 hours, anywhere in Finland

> **One-liner:** Oncoscan turns every GP and dentist visit into an early cancer check. The clinician photographs the finding, our AI pre-sorts it, and a cancer specialist from a nationwide pool gives a verdict within 24 hours. Urgent cases skip the queue.

> **Placeholders:** every `[__]` is a figure to fill from Oncoscan's own data or a cited public source before pitching. Never present a number without its source.

---

## 1. The problem

**Where you live decides how fast cancer is found.**

- Cancer specialists are concentrated in the five university-hospital cities. Rural GPs and dentists often lack the experience to judge a suspicious finding.
- The result is a wait at the first step: "Is this cancer?" can take weeks of referral queues before a specialist even looks. `[__ days median, source: THL / county data]`
- Late detection means later stage, worse survival and more expensive treatment. `[stage-at-diagnosis gap between counties, source: Finnish Cancer Registry]`
- This is exactly the gap the **National Cancer Strategy 2026–2035, Goal 3** aims to close: `[quote the Goal 3 indicator]`.

**The bottleneck is not treatment. It's the first 2 steps: detection and referral.**

---

## 2. The solution

**Oncoscan: a 24-hour expert second opinion, built into primary care.**

| Step | Who | What happens | Time |
|---|---|---|---|
| 1. Capture | GP / dentist | Photo + short symptom description in the app | 3 min |
| 2. Pre-sort | Oncoscan AI | Model trained on `[__]` thousand labelled images estimates likelihood and flags urgency | Seconds |
| 3. Verdict | Specialist from the national pool | Reviews AI estimate + case, writes verdict and next step | Within 24 h |
| 4. Action | Clinician + patient | Cleared → reassured. Suspicion confirmed → fast-track referral and biopsy | Same week |

**Important:** Oncoscan resolves the *suspicion* in 24 hours. Final diagnosis still comes from biopsy/histology. Oncoscan makes sure the right patients get there weeks earlier.

---

## 3. Proof: already running in Latvia

| Metric | Value |
|---|---|
| Live since | `[__]` |
| Clinics connected | `[__]` |
| Cases reviewed | `[__]` |
| Median turnaround | `[__] h` (promise: ≤ 24 h) |
| AI sensitivity / specificity | `[__]% / [__]%` (95% CI `[__]`) |
| Share of cases confirmed suspicious | `[__]%` |
| Specialist throughput | ~20 reviews / hour (vs. ~`[__]` in-person visits / hour) |
| Cost per case | `[€__]` |

**Human in the loop by design:** the AI never gives the final word. A licensed specialist confirms or declines every case.

---

## 4. Why everyone wins

| Party | Gains |
|---|---|
| **Patient** | Answer in 24 h, not weeks of waiting. Earlier stage if it's cancer. Peace of mind if it isn't. |
| **GP / dentist** | Confidence and a clear next step; fewer unnecessary referrals. |
| **Specialist** | Reviews ~20 cases/hour from anywhere; flexible paid work; no wasted visits. |
| **Wellbeing services county** | Shorter specialist queues, earlier-stage cancers (cheaper to treat), equal access across the region. Measurable KPIs. |
| **National level** | Directly moves a Goal 3 indicator; a national pool balances specialist shortages between regions. |

---

## 5. Product roadmap: one platform, 10 cancer types

We start where the evidence is strongest and expand as each type is clinically validated.

| Wave | Cancer types | Input | Status |
|---|---|---|---|
| **1 — now** | Oral, skin (melanoma and others) | Photo, dermoscopy image | Oral live in Latvia; skin `[status]` |
| **2 — 12–24 mo** | Cervical, eye/eyelid, visible lumps (breast, thyroid, lymph nodes) | Photo, colposcopy image, symptoms | Data partnerships needed |
| **3 — 24 mo+** | Colorectal, lung, prostate, ovarian | Lab values (FIT, PSA, CA-125), imaging reports, symptom scores | Vision: triage on structured data |

Each new type: own dataset, own clinical validation, own EU medical-device (MDR) conformity step. That rigour is the moat.

---

## 6. Business model

**Pay per case reviewed. No upfront hardware. Clinicians use their phone or existing camera.**

| Flow | Who pays / earns |
|---|---|
| Case fee | Payer pays `[€__]` per case: county (public procurement) or private provider / insurer |
| Specialist fee | Reviewing specialist earns `[€__]` per review |
| Oncoscan margin | `[€__]` per case covers AI, platform, quality assurance |
| GP / dentist | Not paid per referral (avoids over-referral incentive); their gain is time and certainty |

**Two entry channels in Finland:**
1. **Public:** wellbeing services counties via procurement; start with a pilot.
2. **Private:** occupational health providers and private dental chains. Faster sales cycle, proves volume.

**Specialist pool:** county's own specialists first, cross-county sharing second. We add capacity to the public system; we don't pull doctors out of it.

---

## 7. Market

| | Value | Source |
|---|---|---|
| New cancer cases in Finland / year | `[__]` | Finnish Cancer Registry |
| Wave-1 cancers (oral + skin) / year | `[__]` | Finnish Cancer Registry |
| Suspicious findings in primary care / year (est.) | `[__]` | Assumption: `[__]` suspicions per confirmed case, validated with Latvian data |
| Finland revenue potential (wave 1) | `[__] cases × [€__]` | |
| Nordics + Baltics (all waves) | `[€__]` | |

---

## 8. Competition and our edge

| Alternative | Limitation | Oncoscan's edge |
|---|---|---|
| Standard referral | Weeks of waiting, no prioritisation | 24 h verdict, urgent cases flagged |
| eConsultation between GP and specialist (already used in Finland) | No AI pre-sorting, no guaranteed turnaround, limited to own region | AI triage + 24 h promise + national pool |
| Single-cancer AI apps (e.g. skin) | One cancer type, often consumer-facing | Clinician-led, multi-cancer platform, specialist-verified |
| Pure AI diagnosis | Regulatory and trust barrier | Human in the loop, always |

**Moat:** labelled image data from real cases, a growing verified specialist network, and per-cancer clinical validation that takes competitors years.

---

## 9. Trust, safety and regulation

- **Medical device:** `[CE / MDR class and status]`; each new cancer type follows its own conformity assessment.
- **EU AI Act:** high-risk system; human oversight built in (specialist signs every verdict).
- **Licensing:** reviewing doctors licensed by Valvira for Finnish patients.
- **Data:** GDPR, hosted in the EU, `[Finnish / Kanta integration plan]`.
- **Language:** Finnish and Swedish interface and verdicts.
- **Validation in Finland:** pilot includes local accuracy check against Finnish patients and devices.

---

## 10. The pilot we propose

**6-month pilot in `[county]`, a county with `[the largest detection gap shown in our gap map]`.**

| Item | Plan |
|---|---|
| Scope | Oral + skin; `[__]` health centres and dental clinics |
| Owner | County chief physician + head of primary care |
| Specialist pool | `[__]` specialists from the county + backup pool |
| Cost | `[€__]` total (`[__]` cases × `[€__]`) |
| KPIs | Days from first suspicion to specialist verdict; share of urgent cases referred within `[__]` days; unnecessary referrals avoided; stage at diagnosis (long-term) |
| Decision point | Month 6: scale county-wide or stop |

---

## 11. Team

| Name | Role | Why us |
|---|---|---|
| `[__]` | `[CEO]` | `[__]` |
| `[__]` | `[Medical lead]` | `[__]` |
| `[__]` | `[AI / tech lead]` | `[__]` |

---

## 12. The ask

**Raising `[€__]` `[pre-seed / seed]` to launch in Finland.**

| Use of funds | Share |
|---|---|
| Finnish pilot + clinical validation | `[__]%` |
| Skin model to production + wave-2 data partnerships | `[__]%` |
| Regulatory (MDR, AI Act) | `[__]%` |
| Sales: counties + occupational health | `[__]%` |

**Milestones in 18 months:** `[__]` Finnish clinics live, `[__]` cases/month, `[__]` cancer types validated, `[first county contract]`.

---

## Appendix A — 2-minute Junction pitch script

1. **Gap (map, 25 s):** "In `[county]`, cancers are found later than in Helsinki. Our gap map shows the delay starts before the referral, at detection."
2. **Fix (live demo, 45 s):** "A dentist photographs a lesion. The AI pre-sorts it. A specialist anywhere in Finland answers within 24 hours. Urgent cases skip the queue."
3. **Proof (20 s):** "This runs today in Latvia: `[cases]` cases, `[__] h` median answer."
4. **Scale (10 s):** "One platform, 10 cancer types, starting with oral and skin."
5. **Action (20 s):** "We propose a 6-month pilot in `[county]`: `[__]` clinics, `[€__]`, measured by days from suspicion to verdict, a Goal 3 indicator."

## Appendix B — Hard questions to prepare for

| Question | Answer direction |
|---|---|
| "70% accuracy isn't good enough." | Give sensitivity/specificity with CI; the specialist makes every final call; AI only sets priority. |
| "Does a Latvian model work on Finns?" | Local validation is built into the pilot. |
| "Who is liable for a missed cancer?" | The reviewing licensed specialist, as in any consultation; Oncoscan carries `[insurance]`. |
| "Won't this pull doctors from hospitals?" | County specialists first; reviews take minutes; capacity shared, not taken. |
| "Finland already has eConsultation." | We plug into it: add AI triage, a 24 h guarantee and a national pool. |
| "Isn't it just for one cancer?" | Oral is the proof; skin next; roadmap shows how each type is validated. |
| "What does it cost the county?" | `[€__]` per case versus the cost of a specialist visit and of later-stage treatment `[source]`. |
