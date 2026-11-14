# Report

Date: 14 Nov 2026. **5 of 11 release gates pass. Not ready to submit.**

## Release gates

| # | Gate | Status | Evidence or reason |
|---|---|---|---|
| 1 | Core journey completes reliably over repeated runs | **PASS** | 5/5 automated runs, twice (`tools/journey.mjs`, headless Chrome). One browser, "suspicious" path only |
| 2 | A stranger can explain the product after a short viewing | **FAIL** | Communication test not run. Protocol and blank table are in VALIDATION.md |
| 3 | Every important claim is in the ledger with support | **PASS** for SUBMISSION.md, deck, video and cover. **Open** for the product: the landing page still carries unsupported claims (LEDGER.md, last section) |
| 4 | Strongest technical contribution is visible | **PASS** | Deck slide 4, video 30–40 s, description "The technical part". It is modest: a serverless two-sided loop and an in-browser photo check |
| 5 | Challenge fit is explicit | **FAIL** | Stated, but two minimum requirements are unmet: no Goal 3 indicator, no public data source. The brief also asks for an AI solution; no model is connected |
| 6 | Demo and repository open in incognito, on a phone, without login | **FAIL** | Runs on localhost only. No public URL. The folder is not a git repository |
| 7 | A recorded backup of the demo exists | **PASS** | `video/backup-demo.mp4` (26 s, real screen recording) |
| 8 | Name, promise and numbers are consistent, no typos | **PASS** | "Oncoscan" spelled identically 13 times across assets. Numbers used: 24 hours, 5/5, 2.3 s, 3/3, 550 km |
| 9 | PDF is readable and within the upload limit | **PASS** | `deck/deck.pdf`: 6 pages, 1.5 MB (limit 20 MB), opened and read |
| 10 | Every field and link has been checked | **FAIL** | Text fields are within limits (name 8/30, punchline 101/200, description 2,999/5,000). Demo, source and video links do not exist |
| 11 | Final submission is confirmed | **FAIL** | Not submitted. The page shows "Status: Closed" (unverified) |

## What was produced

| Asset | State |
|---|---|
| BRIEF, DECISION, DEMO, LEDGER, VALIDATION, SUBMISSION | Written |
| `cover.png` | 1920×1080, 6-word promise, real screenshot. Not checked at thumbnail size with other people |
| `deck/index.html` + `deck.pdf` | 6 slides, ≤25 words each, real screenshots, print mode |
| `deck/assets/` | 22 screenshots from the running product, `demo.gif` (1.2 MB), `run-report.json` |
| `video/video.mp4` | 52.7 s, 1920×1080 H.264 + AAC, burned-in captions, 132 words |
| `video/backup-demo.mp4` | Full journey, untouched |
| `README.md` (project root) | Setup in 1 command, real vs simulated, limitations, disclosure |
| `tools/journey.mjs` | The test and capture script |

## Open items

1. **Challenge minimums.** Pick one Goal 3 indicator and add its public data by county (Finnish Cancer Registry, THL Sotkanet). Without it the entry misses a stated minimum requirement and most of the Insight score (25%).
2. **AI.** No model is connected. Either connect one or keep saying so plainly, as the assets do now.
3. **Landing-page claims** with no support: Oriscan in Latvia, "up to 20 cases an hour", five university-hospital cities, outcome bullets, data-protection and Valvira statements. The patient result says "Your urgent referral has been sent". Source them, mark as planned, or remove.
4. **Demo photos.** The 8 demo cases show a striped placeholder. Screenshots and video use a synthetic test image, labelled as such.
5. **Video.** Voice is the macOS fallback, there is no music, and in the 7–30 s demo section the captions run slightly ahead of or behind the footage.
6. **Deck.** Slides 5 and 6 are sparse; they hold only what the ledger supports.
7. **Not tested:** real phone, real clinical photos, the "no concern" and "can't tell" paths in the automated script, two devices.
8. **Disk space.** The laptop had under 0.5 GB free during the build and one video render failed for lack of space. About 1.1 GB is free now. Free space before the demo.

## Needed from team

| # | What | Why |
|---|---|---|
| 1 | Confirm with organizers: is submission open ("Status: Closed"), the deadline, pitch/demo/video time limits, how Peer Review works | BRIEF.md unknowns |
| 2 | Confirm that building on an existing product (Oriscan) is allowed, and how to disclose it | Eligibility |
| 3 | Which Goal 3 indicator to use, from the strategy PDF or the mentors | Minimum requirement |
| 4 | Evidence for Oriscan: live link or screenshots, case counts, turnaround, sensitivity and specificity, review speed | Claims removed from the ledger |
| 5 | The 500-image library, with labels and permission to show it | Demo cases and real screenshots |
| 6 | Whether the model can be called from the prototype | AI requirement |
| 7 | A public demo URL and a public repository | Gate 6 and the link fields |
| 8 | Upload `video/video.mp4` as unlisted and give the link | Link field |
| 9 | A human voiceover and royalty-free music, if you want them | Video quality |
| 10 | Run the product test (3–5 people) and communication test (3 people from other teams); fill in VALIDATION.md | Gate 2 |
| 11 | Team names, roles and photos | Not in any asset yet |
| 12 | Any AstraZeneca mentor feedback you want quoted, with permission | Sponsor support is not claimed anywhere |
| 13 | The final Submit click | Gate 11 |
