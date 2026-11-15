# Submission: copy-paste blocks

Updated 15 November 2026 to match the live site.

## Name (8 / 30)
```
OncoScan
```

## Punchline (112 / 200)
```
Send a photo of a worrying skin or mouth spot. Get a specialist's answer in 24 hours, wherever you live in Finland.
```

## Challenge
```
Equal Care Across Finland (AstraZeneca)
```
Why it fits: the brief names three bottlenecks, late detection, referral to specialist care and treatment start. OncoScan has one step for each.

## Tech challenges
None. No partner technology is required. Google Gemini is optional and switched off on the live demo.

## Description (markdown, about 3,400 / 5,000)
```markdown
## The problem
You find a mole that has changed, or a mouth sore that won't heal. Today the first question, "does a specialist need to see this?", waits behind a GP or dentist visit and a referral. Finland has 308 municipalities and 5 university hospitals. From the farthest town on our map it is about 550 km to the nearest one (our straight-line estimate). At the end of August 2026, 126,200 people were waiting for non-urgent specialist care (THL). And while you wait, you cannot see where your case is.

AstraZeneca's brief names three bottlenecks: late detection, referral to specialist care, and treatment start. We add a fourth we kept running into: no transparency.

## What we built
OncoScan is a working, hosted prototype of photo-first review.

1. **Send a photo.** A short chat collects 1 or 2 photos and the history a doctor would ask for: where, how long, what changed, age, home municipality. Each photo is checked for focus and light.
2. **A specialist reviews it.** A 24-hour case clock starts. The specialist sees the photo, the patient's words and a checklist of warning signs, and signs one of three answers with a note: no concern, better photo needed, or suspicious. The patient follows the status live.
3. **Book the nearest specialist.** A suspicious result opens a list of specialists sorted by distance from the patient's municipality and by first free time, with booking.

OncoScan never says "you have cancer". A suspicious result means "a specialist should see this in person".

## How to try it
Open https://oncoscan.pgf.lv
- **Patient:** "Get checked now", then answer in your own words and add a photo.
- **Doctor:** "Review cases". Your case is first in the queue. Sign an answer.
- **Patient again:** the result arrives on the case page.
- Shortcuts: the four step buttons on the home page open the chat, the doctor's view, and an example result with the booking list.

## The technical part
A dependency-free Node server stores each case and its photos and serves both sides, so patient and doctor can be on different devices. The chat understands free text with our own patterns; an optional language model can fill gaps, but every reply the patient sees is scripted by us. The photo check measures brightness and edge sharpness in the browser.

## What we measured
We tested Google Gemini on 42 labelled dermatoscopy images (HAM10000), photo only. The cheaper model flagged 13 of 18 cancers and cleared only 5 of 24 benign lesions. That is not good enough to sort patients, so the model only describes what is visible. The warning-sign checklist comes from the patient's own answers, and the doctor decides.

## Limitations
- The 16 bookable specialists, their times and the email are examples. No booking or email is sent.
- 24 hours is a product target. We have not measured it in use.
- No one outside the team has tested it.
- The doctor's view has no login in this demo, so do not upload real patient photos.
- The demo images are dermatoscopy images, not phone photos.
- We found no reliable public figure for how many cancers are detected late in Finland, so we do not state one.

## Next
A 6-month pilot in one wellbeing services county: agree one indicator with the county, test with 5 clinicians and their patients, and measure days from first suspicion to a specialist's answer.
```

## Links (each must open in an incognito window on a phone)
| Field | Value |
|---|---|
| Demo | https://oncoscan.pgf.lv |
| Source | https://github.com/progresful/Onco-Scan (**private**: make it public or invite the judges before submitting) |
| Video | `presentation/video/v3/video.mp4` (44 s, with voiceover). Upload as unlisted and paste the link here |
| Other | — |

## Before you submit
- [ ] Latvia: the video's end card says "Already in use in Latvia". Confirm the exact wording you want to stand behind.
- [ ] Make the repository public, or share access.
- [ ] Upload the video and paste its link.
- [ ] Open all three links in an incognito window on a phone.
