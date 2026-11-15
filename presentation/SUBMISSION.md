# Submission: copy-paste blocks

Updated 15 November 2026 to match the live site and the final video.

## Name (8 / 30)
```
OncoScan
```

## Punchline (115 / 200)
```
Send a photo of a worrying skin or mouth spot. Get a specialist's answer in 24 hours, wherever you live in Finland.
```

## Challenge
```
Equal Care Across Finland (AstraZeneca)
```

## Tech challenges
None. No partner technology is required. Google Gemini is optional and switched off on the live demo.

## Description (markdown, 4,039 / 5,000)
```markdown
## The gap
Where you live in Finland decides how fast a specialist looks at a suspicious spot.

- Finland has **308 municipalities** and **5 university hospitals** (Statistics Finland, 2026).
- From the farthest town on our map it is about **550 km** to the nearest one (our straight-line estimate).
- **126,200 people** were waiting for non-urgent specialist care at the end of August 2026 (THL).
- The law allows **3 weeks** for assessing a referral and **6 months** for treatment to start (care guarantee).
- While waiting, a patient cannot see where their case is.

AstraZeneca's brief names three bottlenecks: late detection, referral to specialist care, and treatment start. We add a fourth: no transparency.

## What we recommend
Let the specialist look first. For visible lesions (skin and mouth), a photo and a short history are enough for a specialist to decide who must be seen in person and who can be reassured. That decision should take one day, not a referral queue.

**Proposed pilot:** one wellbeing services county, 6 months, 5 clinicians. Measure one indicator: days from first suspicion to a specialist's assessment, by municipality, before and after.

## What we built
A working, hosted prototype: https://oncoscan.pgf.lv

1. **Send a photo.** A short chat collects 1 or 2 photos and the history a doctor would ask for. Each photo is checked for focus and light.
2. **A specialist reviews it.** A 24-hour case clock starts. The specialist sees the photo, the patient's words and a checklist of warning signs, and signs one answer: no concern, better photo needed, or suspicious. The patient follows every stage live.
3. **Book the nearest specialist.** A suspicious result opens specialists sorted by distance from the patient's municipality and by first free time.

| Bottleneck | Our step |
|---|---|
| Late detection | Photo and history from home |
| Referral queue | Specialist review, 24-hour target |
| Treatment start | Booking the nearest specialist |
| No transparency | Live case status |

OncoScan never says "you have cancer". A suspicious result means "a specialist should see this in person".

## Try it in 90 seconds
- **Patient:** "Get checked now", describe the spot in your own words, add a photo, send.
- **Doctor:** "Review cases". The new case is first. Sign an answer.
- **Patient:** the result arrives on the case page, with the booking list if it is suspicious.

Patient and doctor can be on different devices: a small Node server stores each case and its photos.

## Data and honesty
- **AI, measured.** We tested Google Gemini on 42 labelled dermatoscopy images (HAM10000), photo only. It flagged 13 of 18 cancers and cleared only 5 of 24 benign lesions. That is not good enough to sort patients, so the model is not used for triage. The warning-sign checklist comes from the patient's own answers, and the doctor decides.
- **Examples are labelled.** The 16 bookable specialists, their times and the result email are examples. Nothing is booked or sent.
- **Targets are targets.** 24 hours is a product target, not a measured result.
- **Missing data, stated.** We found no reliable public figure for the share of cancers detected late in Finland, so we do not give one. The 126,200 figure covers all specialties, not only skin and mouth.
- **Not yet tested** by anyone outside the team. The doctor's view has no login in this demo, so do not upload real patient photos.

## Background
The idea builds on Oriscan, the team's existing photo-review service used by dentists in Latvia. Everything in this repository was built during Junction 2026.

## Sources
- Statistics Finland, Municipalities 2026: https://stat.fi/en/luokitukset/kunta/kunta_1_20260101
- THL waiting data, as quoted by Terveystalo: https://terveystalo.com/en/company/investors/Terveystalo-as-an-investment/operating-environment2
- HUS, access to specialist care: https://www.hus.fi/en/patient/patient-guide/your-rights-patient/access-treatment-specialist-medical-care
- HAM10000 dermatoscopy dataset (Tschandl et al., 2018)
```

## Links (each must open in an incognito window on a phone)
| Field | Value |
|---|---|
| Demo | https://oncoscan.pgf.lv |
| Source | https://github.com/progresful/Onco-Scan (**private**: make it public or invite the judges) |
| Video | `presentation/video/v3/video.mp4` (45 s, voiceover, sound effects, captions). Upload as unlisted and paste the link here |
| Slides | `presentation/deck/deck.pdf` (older wording: says "2 of 3" bottlenecks; update or leave out) |

## How the description maps to the judging criteria
| Criterion | Weight | Where it is answered |
|---|---|---|
| Actionability | 30% | "What we recommend": specialist-first review and a 6-month pilot with one indicator |
| Insight | 25% | "The gap": distance, queue size, legal waits, no visibility |
| Data quality and transparency | 20% | "Data and honesty" and "Sources" |
| Execution | 15% | "What we built" and the live demo |
| Clarity | 10% | Three steps, one table, a 45-second video |

## Open points before you submit
- [ ] **Goal 3 indicator.** The brief requires at least one indicator tied to Goal 3 of the national cancer strategy. We propose "days from first suspicion to a specialist's assessment" but have not confirmed it matches a Goal 3 indicator. Check with a mentor, or name the official indicator in the pilot paragraph.
- [ ] **Latvia wording.** The description says Oriscan is "used by dentists in Latvia" and the video says "In use in Latvia". Confirm both are accurate as written.
- [ ] **Pre-existing work.** Confirm with the organizers that building on Oriscan is allowed, and that "built during Junction 2026" is true for everything in the repository.
- [ ] **THL figure.** 126,200 was read from Terveystalo's investor page quoting THL, not from THL's own table. Replace the source link with THL's if you can find it.
- [ ] Make the repository public, or share access.
- [ ] Upload the video and paste its link.
- [ ] Open all links in an incognito window on a phone.
