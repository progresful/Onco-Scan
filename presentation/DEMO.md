# Demo journey

> A person far from a university hospital finds **a spot that worries them**. They provide **1–4 photos and a short description**. Oncoscan **checks the photos, opens a case with a 24-hour clock and puts it first in a specialist's queue**. The specialist signs a verdict and note, and the person receives **one of three results with a next step**. We demonstrate it through **a live run, plus 5 of 5 automated runs and a recorded backup**.

## Live script (about 60 seconds, one laptop, two tabs)
1. Patient tab `/patient/`: sign in with any email → Skin → "Left forearm" → add a photo → description → Rovaniemi (shows €0) → Send. The case clock starts.
2. Specialist tab `/review/`: the case is first, tagged "New from patient". Press → (suspicious), then Enter to sign.
3. Patient tab: "You've got mail" → View my result → "A specialist should see this in person" with the note.

## Priority split
| Must work | Must prove | Optional |
|---|---|---|
| Patient submit, 5 steps | The loop closes: verdict reaches the patient | Landing page animations |
| Case appears first in the queue | Photo check catches dark and blurred images | Hero case-flow simulation |
| Verdict + note signing | Three distinct, calm result messages | The five alternative specialist layouts (`?v=0..5`) |
| Result page | | Earnings counter |

## Demo resilience
| Item | Status |
|---|---|
| Seeded demo data | Yes: 8 fictional cases in `review/cases.js` |
| Guest mode, no login | Yes: any email works, nothing is sent |
| Tested on a phone | Emulated only (390×844): no sideways overflow on 8 screens. **Not tested on a real phone** |
| Rate limits and API costs | None: no external API is called |
| Recorded backup | `video/backup-demo.mp4` |
| Known limits | Both tabs must be in the **same browser on the same computer**. A phone cannot send a case to a laptop. Demo cases have no photos (placeholder shown) |
