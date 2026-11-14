# Chat-style intake: three plans

Goal: replace the patient form (area, body site, photos, duration, changes, own words, age, municipality) with a conversation. The patient writes or taps, and OncoScan replies, confirms what it understood and asks only for what is still missing.

What the chat must collect, whichever plan is used:

| Field | Needed for |
|---|---|
| Area (skin or mouth) | Routing to the right specialist |
| Body site | The specialist's context |
| 1 or 2 photos | The review itself |
| How long it has been there | Warning-sign rules (for example, a mouth lesion over 3 weeks) |
| Changes noticed (grown, colour, bleeds, hurts, itches, not healing) | Warning-sign rules |
| Age band | The specialist's context |
| Home municipality | Cover check and distance to specialists |
| Email and consent | Sending the result |

---

## Plan 1 · Guided chat (rules only)

The chat follows a fixed order. Each question offers tap-able answers and also accepts typed text, which is matched against keywords ("lip" → mouth, "3 months" → months or years, "bleeds" → bleeds).

| | |
|---|---|
| How it understands text | Keyword and pattern matching in the browser |
| Feels like | A friendly form in chat clothing; fast with taps |
| Strengths | Works offline, no cost, no data leaves the server, fully predictable, easy to test |
| Weaknesses | Misses phrasing it doesn't know ("it's been there since Midsummer"); English only unless every keyword is translated |
| Effort | 1 day. **The dummy version in `chat.html` is this plan.** |
| Risk | Low |

## Plan 2 · AI-led chat

Every patient message goes to a language model (Gemini) with the conversation so far. The model decides what to say next, pulls out the fields, and asks follow-up questions in its own words.

| | |
|---|---|
| How it understands text | A language model, any phrasing, any language |
| Feels like | Talking to a person |
| Strengths | Handles messy, long or multilingual messages; can ask a clarifying question nobody scripted |
| Weaknesses | Costs money per message; the patient's words go to Google; replies vary; the model can drift into medical opinions unless tightly constrained; needs internet; harder to test |
| Effort | 3–4 days including guardrails and a fallback |
| Risk | High for a medical product. A wrong or alarming sentence from the model is a safety problem |

Guardrails this plan would need: a fixed list of fields it may ask about, a ban on diagnoses and reassurance, a visible "this is an assistant, not a clinician" line, and an automatic switch to Plan 1 when the model is slow or unavailable.

## Plan 3 · Hybrid (recommended)

The conversation is scripted as in Plan 1, so the wording the patient sees is always ours. The language model is used for one narrow job: reading a free-text message and returning the fields it contains as structured data. It never writes a reply.

| | |
|---|---|
| How it understands text | Rules first; the model fills gaps the rules miss |
| Feels like | Plan 2 when the patient types freely, Plan 1 when they tap |
| Strengths | Natural input, predictable output; nothing the model says reaches the patient; falls back to rules with no visible change; cheap (one short call per free-text message) |
| Weaknesses | Still sends the patient's text to Google when the model is used; two code paths to maintain |
| Effort | 2 days on top of Plan 1 |
| Risk | Medium-low. The worst case is a field extracted wrongly, which the summary step lets the patient correct |

---

## Recommendation

Build Plan 1 now (done as a dummy), then add the model as an extractor (Plan 3). Skip Plan 2: for a cancer-triage product, a model that writes its own replies is the wrong place to take risk.

## Design rules for all three

1. **One question at a time**, with tap-able answers under it and free typing always allowed.
2. **Say back what was understood** ("Got it: skin, left forearm, about 3 months, has grown") so mistakes are caught early.
3. **Skip what is already known.** A first message that covers four fields should lead to the fifth question, not the first.
4. **Photos in the chat**, with the focus and light check as an immediate reply.
5. **A summary before sending**, with every line editable.
6. **Never a medical opinion.** The chat collects; the specialist judges.
7. **Calm copy**: short sentences, no alarm words, the 24-hour promise stated once the case is sent.
8. **Accessible**: keyboard-only use, screen-reader announcements for new messages, reduced-motion support.

## What the dummy version does and does not do

| Does | Does not |
|---|---|
| Runs the full conversation and sends a real case to the server | Use any AI |
| Understands a free-text first message with simple patterns | Understand unusual phrasing or other languages |
| Accepts 1 or 2 photos with the focus and light check | Remember a half-finished chat after a reload |
| Shows an editable summary and asks for consent | Replace the existing patient flow (it lives beside it at `patient/chat.html`) |
| Hands over to the existing case page for progress, result and booking | |
