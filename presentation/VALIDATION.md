# Validation

## What was run (14 Nov 2026, automated)

Script: `tools/journey.mjs` (headless Chrome, 1920×1080, against the local server on port 4174).

| Test | Result |
|---|---|
| Full journey: patient submits → case first in queue → specialist signs "suspicious" → patient sees result and note | **5 / 5 passed**, run twice (10 / 10 in total) |
| Loop time without pauses | 2.28–2.32 s (runs 2–5) |
| Photo check on 3 synthetic images | sharp → "Looks clear" · dark → "Too dark" · blurred → "May be blurry" |
| Phone width (emulated 390×844), 8 screens | 0 px sideways overflow on all |

Limits: one machine, one browser, synthetic photos, the "suspicious" path only. "No concern" and "Can't tell" were exercised by hand earlier but not in the script.

## Product test with people: NOT RUN

Nobody outside the team has tried it. To run it (3–5 people, ideally a GP, dentist or nurse; 5 minutes each):
1. Give them the patient tab and say only: "You found a mole that worries you. Use this."
2. Record: where they hesitate · whether they reach "Your case is with us" · whether the result page tells them what to do.
3. Give a second person the specialist tab: "Review the first case." Record the same three things.

| Person (role) | Struggled at | Finished? | Result helpful? |
|---|---|---|---|
| | | | |

## Communication test: NOT RUN

Show `cover.png` and the punchline for 5 seconds to at least 3 people from other teams. Then ask:
1. What does it do?
2. Who is it for?
3. Why would someone use it?
4. What do you believe actually works?

Our answers, to compare against:
1. Sends photos of a worrying spot to a cancer specialist.
2. People far from a specialist; the specialist who reviews.
3. To know within 24 hours whether they need to be seen.
4. The photo-to-verdict loop works as a browser prototype; the AI and the 24-hour service do not exist yet.

| Person | Q1 | Q2 | Q3 | Q4 | Matches ours? |
|---|---|---|---|---|---|
| | | | | | |
