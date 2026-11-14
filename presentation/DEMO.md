# Demo journey

Updated 15 November 2026 to match the live site.

> A person far from a university hospital finds **a spot that worries them**. In a short chat they send **1 or 2 photos and their history**. OncoScan **checks the photos, opens a case with a 24-hour clock and puts it in the specialist's queue**. The specialist signs an answer and a note, the person **sees the status live and gets one of three results**, and a suspicious result **opens the nearest specialists to book**.

## Live script (about 90 seconds, works on two devices)
1. Home `https://oncoscan.pgf.lv`: point at the 24-hour clock and the three ticked bottlenecks.
2. "Get checked now": type one sentence ("A mole on my left forearm has grown over 3 months, I'm 45 and live in Rovaniemi"), add a photo, confirm the summary, send.
3. Case page: the clock is running and the status rows fill in.
4. Second device or tab, "Review cases": the new case is first. Read the signal check, press Suspicious, sign.
5. Back on the case page: "Your result is ready" → the result → the list of specialists sorted by distance → Book.

## If something fails
| Problem | Fallback |
|---|---|
| No network | Run `node server.mjs` locally and use `http://localhost:4173` |
| Chat misreads a sentence | Use the answer buttons under each question |
| No time for the full loop | Home page step buttons: "See doctors and times" opens an example suspicious result; `/patient/?demo=done` opens a finished case |
| Everything fails | Play `video/v3/video.mp4` |

## Priority split
| Must work | Must prove | Optional |
|---|---|---|
| Chat intake with a photo | The loop closes: the doctor's answer reaches the patient | Home page animations |
| Case appears in the doctor's queue | Status is visible to the patient the whole time | Heartbeat sound |
| Signing an answer | A suspicious result leads to a booking | Sorting specialists by soonest |

## Known limits
- Specialists, appointment times and the result email are examples; nothing is booked or sent.
- The doctor's view has no login in this demo. Do not upload real patient photos.
- AI assist is off on the live site; the chat runs on patterns and buttons.
- Not tested by anyone outside the team. Not tested on a real phone by us in this version.
