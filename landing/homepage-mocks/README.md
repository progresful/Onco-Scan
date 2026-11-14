# OncoScan homepage concepts

Open `index.html` to compare all four directions. It embeds all four pages, so the comparison file works independently and offline. Each numbered HTML file also opens independently. No installation or build is required. External clinician/patient demo links require internet access.

## Recommendation

Use **01 — Action first** for the challenge submission. It puts the intended decision-maker, gap, proposed intervention and evidence status on the first screen. Use **04 — Human pathway** if retaining the patient-facing product positioning is the priority. Concept 02 preserves the existing dark/mint identity. Concept 03 makes a stronger regional planning tool but requires real comparable data before it can substantiate a finding.

## Live homepage assessment

Reviewed https://oncoscan.pgf.lv/landing/ on 15 November 2026 (Riga).

The current homepage has distinctive typography, strong dark/mint contrast, clear patient and clinician entry points, and a concrete service flow. Below the hero it already discusses three care bottlenecks and provides some source labels. The problem is the hierarchy and strength of the claims, rather than a complete absence of challenge content.

| Criterion | Current weakness | Recommended change |
| --- | --- | --- |
| Actionability, 30% | A patient/clinician service journey does not tell a county what to implement. | Show a proposal with owner, scope, implementation steps, measurement and resource dependencies. |
| Insight, 25% | Distance to university hospitals and a general specialist queue do not establish a cancer-specific regional pathway gap. | Compare a defined cancer cohort and identify the stage where differences appear; separate hypotheses from established causes. |
| Data quality, 20% | The 24-hour promise dominates, while its status as a product target is disclosed farther down. General specialist-care figures can be mistaken for cancer-care evidence. | Put limitations alongside claims. Name source, period, denominator, scope and target definition. Do not use general waiting-time guarantees as cancer treatment targets. |
| Clarity, 10% | The huge countdown communicates urgency but not the county decision or proposed action. | Replace it with a concise gap → bottleneck → recommendation briefing. |
| Execution, 15% | Patient and clinician demos demonstrate a workflow, but the landing page alone does not demonstrate an AI analyst or validated recommendations. | Make the judging route explicit and connect the analysis to evidence, then to a reviewable county plan. |

The words “before the clock runs out” can also imply a clinical deadline the product has not established. Avoid marking “treatment start” as complete merely because an appointment is offered. A photo review, referral, diagnostic confirmation and treatment initiation are different events.

## Verified strategy connection

The National Cancer Strategy 2026–2035, page 5, includes access to treatment within target timeframes under Goal 3. Its footnote points to THL, Ohjaus 21/2016. The proposed operational measure in these mocks is the share starting treatment within the applicable cancer-specific timeframe. Exact cohort, timestamps, denominator and target rules require verification before implementation.

Source: https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf#page=5

## What these mocks do and do not establish

- All county figures are explicitly fictional, with sample counties A–C rather than real regions.
- The regional scenario is arithmetic, not a prediction of clinical benefit.
- Pilot actions are proposals to validate with clinicians and a county. They are not presented as proven interventions.
- The strategy supports the outcome choice; it does not substantiate the invented regional differences or the effectiveness of the proposed pilot.
- No live AI or data feed is connected. Changing the homepage cannot itself satisfy the working-AI, evidence or real-gap requirements.
- Existing patient and clinician flows remain available through links to the current site.

## Included interactions

1. Action first: expandable county pilot plan and evidence disclosures.
2. Pathway: four selectable stages with different gaps, owners, actions and measures.
3. Regional lens: county selector and an explicit assumed-improvement slider.
4. Human pathway: patient/clinician demo links and expandable county pilot plan.

## Validation

HTML structure, local anchor targets and JavaScript syntax checked. Browser rendering and click-through testing could not be completed because the environment blocks starting a local HTTP server. Responsive CSS is included, but device rendering remains unverified.
