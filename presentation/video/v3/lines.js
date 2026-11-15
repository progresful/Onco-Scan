// The voiceover, one line per beat. Used by index.html (captions, timing) and voice.mjs (speech).
const LINES = [
  "Anna finds a dark spot. Her GP can't say for sure. The specialist is five hundred kilometres away.",
  "She joins a queue of a hundred and twenty-six thousand. Weeks pass. No one can say where her case is.",
  "OncoScan. A specialist's answer in twenty-four hours.",
  "One. Send a photo and your story, from home.",
  "Two. A specialist reviews it, and signs one decision.",
  "You follow every stage, live.",
  "Any verified specialist can join the shared queue.",
  "Three. If you need a visit, book the nearest specialist in one tap.",
  "The next day, Anna has her answer.",
  "OncoScan. In use in Latvia. Next, Finland."
];
if (typeof window !== 'undefined') window.LINES = LINES;
if (typeof module !== 'undefined') module.exports = LINES;
