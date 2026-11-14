# Submission: copy-paste blocks

## Name (8 / 30)
```
OncoScan
```

## Punchline (101 / 200)
```
A specialist's answer on a worrying skin or mouth spot within 24 hours, wherever you live in Finland.
```

## Challenge
```
Equal Care Across Finland (AstraZeneca)
```
Why it fits: it targets two bottlenecks named in the brief, late detection and the referral from primary to specialist care.

## Tech challenges
None. No partner technology is used.

## Description (markdown, 2,999 / 5,000)
```markdown
## The problem
You find a mole that has grown, or a mouth sore that won't heal. Whether a specialist needs to see it is the first question, and today it waits behind a GP or dentist visit and a referral. AstraZeneca's brief names late detection and the primary-to-specialist referral as known bottlenecks in Finnish cancer care. The further you live from a specialist, the more that first step matters.

## What we built
OncoScan is a working browser prototype of a photo-first review:

1. **The patient** sends 1–4 photos and a short description. Each photo is checked for darkness and blur before it is sent.
2. **A case clock** starts, counting toward a 24-hour answer.
3. **The specialist** sees the case first in a review queue, with a large photo and the patient's own words, and signs one of three verdicts with a note: no concern, suspicious, or can't tell.
4. **The patient** gets one of three calm results with a next step. OncoScan never says "you have cancer"; a suspicious result means "a specialist should see this in person".

## How to try it
Open the patient page and the specialist page in two tabs of the same browser.
- Patient: any email, pick skin or mouth, add a photo, describe it, choose Rovaniemi, send.
- Specialist: your case is first in the queue. Press → then Enter.
- Patient: open the result.

Look for: the photo label ("Looks clear", "Too dark", "May be blurry"), the case jumping the queue, and the specialist's note arriving on the patient's screen.

## The technical part
We had no time for a backend, so the whole two-sided loop runs in the browser. Both screens share local storage and react to each other, photos are downscaled on the device, and the quality check measures brightness and edge sharpness on a small copy of the image. The tradeoff: both tabs must be in one browser on one computer.

## Evidence
- The full journey passed **5 of 5** automated runs in headless Chrome, twice.
- The photo check labelled a sharp, a dark and a blurred test image correctly (3 of 3; synthetic images).
- No sideways overflow at phone width on 8 screens (emulated).

Compared with a standard referral, the specialist looks first, before any appointment exists. We have not measured the difference.

## Challenge fit
OncoScan addresses detection and referral, two of the three bottlenecks in the brief, and gives a county something concrete to pilot: photo-first specialist review from health centres and dental clinics.

## Limitations
- **No AI model is connected.** The scores on the 8 demo cases are hand-written examples; patient cases show "no AI pre-read".
- **No Goal 3 indicator or public dataset is used yet**, so the regional gap is argued, not shown.
- Sign-in, email, payment, county cover, licence checks and payouts are simulated.
- No one outside the team has tested it.

## Next
Pick one Goal 3 indicator with the mentors and show it by county. Connect a model. Test with 3–5 clinicians. Then propose a 6-month pilot in one wellbeing services county.
```

## Links (each must open in an incognito window on a phone)
| Field | Value |
|---|---|
| Demo | **Missing.** The prototype runs only on localhost. Needs hosting by the team |
| Source | **Missing.** The project is not in a git repository |
| Video | **Missing.** `video/video.mp4` is ready to upload as unlisted |
| Other | — |
