# Decision sheet

| Question | Answer |
|---|---|
| Who is the first user? | An adult in a town far from a university hospital who has found a skin spot or mouth sore that worries them. Second user: the cancer specialist who reviews the case. |
| What goes wrong today? | The first question, "does a specialist need to see this?", waits behind a referral. AstraZeneca's brief names late detection and the primary-to-specialist referral as known bottlenecks. |
| What do they do currently? | Book a GP or dentist visit and wait for a referral, or do nothing. |
| What is our single promise? | A specialist's answer on a worrying skin or mouth spot within 24 hours, wherever you live in Finland. |
| What works now? | A browser prototype: a patient submits photos and a description, the case appears first in a specialist's review queue, the specialist signs a verdict and note, and the patient sees one of three results with a next step. One browser, no server. |
| What is the decisive demo moment? | The specialist presses one key to sign "suspicious", and the patient's screen changes from a running case clock to "A specialist should see this in person" with the specialist's note. |
| Why is our approach better? | The specialist looks first, from a photo, before any appointment exists. A standard referral puts the appointment first. This is a design argument; we have no measured comparison. |
| What was difficult to build? | A two-sided loop with no backend in a weekend. Both screens share browser storage and react to each other; photos are downscaled and checked for darkness and blur in the browser. Evidence: 5 of 5 automated runs completed. |
| What evidence do we have? | Automated runs of the full journey (5/5), a photo check that flagged a dark and a blurred test image (3/3 labels correct), and no sideways overflow at phone width on 8 screens. No user tests. |
| Why does this fit the challenge? | It targets two of the three bottlenecks in the brief: late detection and referral. It does **not** yet cite a Goal 3 indicator or use public data, and no AI model is connected. |
| Largest unresolved weakness? | The prototype shows a service, not evidence of a gap. Next test: pick one Goal 3 indicator with the mentors, add its public data by county, and run the product test with 3–5 clinicians. |
