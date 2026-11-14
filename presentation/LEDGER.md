# Claim-and-evidence ledger

Labels: `measured` · `observed` · `sourced` · `estimated` · `planned`. Dates are 14 Nov 2026 unless noted.
Used in: S = SUBMISSION.md · D = deck · V = video · C = cover.

## Claims used in the submission assets

| # | Claim | Label | Support | Used in |
|---|---|---|---|---|
| 1 | A patient can submit photos and a description, and the case appears first in the specialist queue | measured | `tools/journey.mjs`, 5/5 automated runs in headless Chrome: submitted case ID equals the first ID in the queue | S, D, V |
| 2 | A signed verdict and note reach the patient's result page | measured | Same runs: result title and note read back on the patient page, 5/5 | S, D, V |
| 3 | The full loop completes in about 2.3 s when automated | measured | Runs 2–5: 2.28–2.32 s each (no pauses). Says nothing about human speed | S, D |
| 4 | The photo check flags dark and blurred photos | measured | 3 synthetic test images (sharp, dark, blurred) labelled "Looks clear", "Too dark", "May be blurry". Sample of 3; not tested on real clinical photos | S, D, V |
| 5 | No sideways overflow at phone width | measured | Emulated 390×844, 8 screens, 0 px overflow. Not a real phone | S |
| 6 | The brief names late detection and the primary-to-specialist referral as known bottlenecks | sourced | AstraZeneca challenge page, as pasted by the team on 13 Nov | S, D, V |
| 7 | Farthest town on our map is about 550 km from its nearest university hospital | estimated | Straight-line (haversine) distance from 47 towns to 5 university-hospital cities, computed in `landing/main.js`. Coordinates were typed in by hand and are approximate; not an official dataset. Not travel distance | D |
| 8 | The whole prototype runs in the browser with no server | observed | Code inspection: static HTML/CSS/JS, `localStorage` only, no network calls except fonts, icons and GSAP from CDNs | S, D, V |
| 9 | Target: an answer within 24 hours | planned | Product promise. The prototype shows a 24-hour clock; nothing enforces or measures it | S, D, V, C |
| 10 | No AI model is connected; AI scores on the 8 demo cases are hand-written examples | observed | `review/cases.js` header comment; patient cases show "No AI pre-read" | S, D, V |

## Claims removed from the assets (no support yet)

| Claim | Why removed | What would support it |
|---|---|---|
| Oriscan runs in Latvian dental clinics | Team statement only | A link, screenshot or usage figures |
| Models trained on thousands of images, about 70% accuracy | Team statement only; no data seen | Validation report: sample, sensitivity, specificity |
| A specialist reviews 10–20 cases per hour | Team statement only | Logged review times |
| 500-image skin/dental library | Not in the project folder | The files, with labels and permission |
| Specialists work in five university-hospital cities | No source cited | THL or STM reference |
| Fewer unnecessary referrals, shorter queues, earlier-stage cancers | No evidence | Pilot data or published studies |
| Any € market, cost or fee figure (€29, €4 per review, €512) | Invented placeholders, labelled as examples in the UI | Real pricing |

## Still present in the product itself (not in S/D/V/C)
The landing page keeps some of the removed claims: "builds on Oriscan … used by dental clinics in Latvia", "up to 20 cases an hour", "five university-hospital cities", outcome bullets, and data-protection and licensing statements. The patient result also says "Your urgent referral has been sent". These need a team decision: source them, mark them as planned, or remove them.
