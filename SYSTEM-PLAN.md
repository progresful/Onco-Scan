# OncoScan — system plan

Two apps on one backend: a **patient app** (submit photos, get an answer in 24 h) and a **reviewer app** (doctors swipe through cases and get paid). An AI pre-read sits between them.

---

## 1. Flow at a glance

```
Patient: sign in → new case (photos + description) → coverage check / pay → "submitted" → email ≤ 24 h → result page
                                   │
                              AI pre-read (score + written findings)
                                   │
Doctor:  register → licence check → approved → review queue (swipe + / −) → verdict + short note → earnings
```

---

## 2. Patient app

| Screen | What it does |
|---|---|
| **Sign in** | Email magic link (no password). Later: Finnish strong ID (Suomi.fi). |
| **New case** | Pick area: skin or mouth. Upload 1–4 photos with a framing guide (distance, light, focus). Description: where, how long, changes, pain, bleeding. Consent tick box. |
| **Photo check** | Instant check for blur and darkness; ask for a retake before submitting. Bad photos are the main cause of useless reviews. |
| **Coverage / paywall** | "Covered by your wellbeing county" if the home municipality is in a contracted county (or a clinic referral code is entered): pay €0. Otherwise pay by card. |
| **Submitted** | Case clock starts: "Answer by [time], at the latest." Status: received → pre-sorted → with specialist → answered. |
| **Email** | "Your OncoScan result is ready" with a link only. No medical content in the email itself. |
| **Result** | One of three outcomes, the specialist's short note, and the next step. |

**Result wording (never "you have cancer"):**
- **No sign of concern.** What to watch for; when to re-check.
- **Needs an in-person look.** Book a GP/dentist visit; not urgent.
- **Suspicious: fast-track.** Urgent referral letter attached; who to call.

---

## 3. Reviewer (doctor) app

| Screen | What it does |
|---|---|
| **Register** | Name, specialty, licence number. Checked against Valvira's public register (JulkiTerhikki). Manual approval at first. |
| **Calibration** | Before real cases: 20 cases from the 500-image library with known answers. Must pass a threshold. Also used for ongoing quality checks. |
| **Review queue** | One case per screen, large image, urgent cases first. |
| **Earnings** | Cases reviewed, amount earned, payout history. Paid per review, monthly. |

**The swipe card:**
- Full-height image, pinch to zoom, tap for next photo.
- Bottom sheet: patient description, age band, area, duration.
- AI panel: score (0–100) and written findings ("irregular border, colour variation, 7 mm").
- Actions: **− No concern** (swipe left / ←), **+ Suspicious** (swipe right / →), **? Can't tell, needs better photo** (swipe up / ↑).
- After the swipe: one-line note (templates + free text), then next case. Undo for 5 seconds.

**Three safeguards I recommend adding to the plain +/−:**
1. **"Can't tell" option.** Binary forces a guess on bad photos.
2. **Second reviewer** when the doctor and the AI disagree strongly, or on every "+". Two votes before a patient is told "suspicious".
3. **AI shown after the first look** (tap to reveal) as an option, so the score doesn't anchor the doctor. Worth testing both ways.

---

## 4. AI pre-read

| Item | Plan |
|---|---|
| Output | Score 0–100, urgency band (low / medium / high), 2–4 written findings |
| Use | Sorts the queue; shown to the doctor as decision support. Never shown to the patient; never the final word. |
| Demo | Your existing Oriscan model for the score, if it can be called from the app. Otherwise a vision-language model writes the findings and a score for demo purposes, clearly labelled. |
| 500-image library | Too small to train on. Use it for: demo cases, reviewer calibration, and measuring AI accuracy (sensitivity / specificity) to show judges. |

---

## 5. Payments

| Who | How |
|---|---|
| Patient, county-covered | €0. Case is billed to the county's monthly invoice. |
| Patient, self-pay | Card payment before submission (Stripe). |
| Doctor | Fixed fee per review; monthly payout (Stripe Connect or bank transfer). |
| County | Dashboard: cases, median answer time, share fast-tracked, cost. |

---

## 6. Data model (minimum)

`users` (role: patient / reviewer / admin) · `cases` (area, description, status, coverage, created_at, due_at) · `images` (case_id, file, quality_ok) · `ai_reads` (case_id, score, band, findings) · `reviews` (case_id, reviewer_id, verdict, note, seconds) · `reviewer_profiles` (licence, specialty, approved, calibration_score) · `payments` · `payouts`

---

## 7. Tech (simple default)

| Part | Choice |
|---|---|
| App | Next.js (one codebase, two areas: `/patient`, `/review`) |
| Auth, database, image storage | Supabase (EU region) |
| Payments | Stripe, test mode |
| Email | Resend |
| AI | Existing model behind one `/api/preread` endpoint |
| Hosting | Vercel |

---

## 8. Design direction

**"Clinical paper."** Light mode only. Reads as medical-grade because it is quiet, precise and high-contrast, not because it is blue.

- **Colours:** white `#FFFFFF` surfaces on warm off-white `#F6F5F2`; ink `#0E1A24`; one accent, signal orange `#E8743B`, for urgency and primary actions; green and red only for the +/− verdicts, always with an icon and label too.
- **Type:** Schibsted Grotesk (headings), Inter (text), IBM Plex Mono (case clock, IDs, scores). Same as the landing page.
- **Layout:** large type, generous spacing, 1px hairlines instead of shadows, 6–10px corners. One job per screen.
- **Signature element:** the **case clock** (`T+03:12`), on every case, in both apps.
- **Motion:** the swipe card has real physics (drag, tilt, snap); verdict stamps in. Everything else is calm fades. Full keyboard control for reviewers.
- **Avoid:** gradients, glass, stock-doctor photos, playful illustrations, dark patterns on the paywall.

---

## 9. Build order for the hackathon

| # | Piece | Real or mocked for the demo |
|---|---|---|
| 1 | Reviewer swipe screen with the 500-image library and AI panel | **Real.** This is the demo's wow moment. |
| 2 | Patient submit flow (photos, description, clock) | Real |
| 3 | Result page + email | Real page; email sent on verdict |
| 4 | Coverage / paywall | Mocked: county check by municipality; Stripe test card |
| 5 | Doctor registration + calibration | Simple form; calibration real (uses library) |
| 6 | Earnings, county dashboard | Mocked numbers, clearly labelled |

**Live demo script (60 s):** patient uploads a photo on a phone → case appears in the doctor's queue on the big screen → AI findings reveal → doctor swipes "+" → patient's phone gets the email and the fast-track result.

---

## 10. Things to decide

1. **Who submits:** patients directly (this plan) or GPs/dentists (the pitch and landing page)? Patient-direct means lower photo quality and more worried-well cases, and it bypasses the clinic. Supporting both is possible: same flow, a clinic account just submits on the patient's behalf.
2. **AI:** can the existing Oriscan model be called from the app this weekend?
3. **Library:** do the 500 images have confirmed labels and permission to be shown in a public demo?
4. **Legal framing:** a patient-facing photo verdict is a medical device and a healthcare service. For the pitch, say so and present the pilot as the validation step.
