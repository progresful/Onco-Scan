// The voiceover, one line per beat. Used by index.html (captions, timing) and voice.mjs (speech).
const LINES = [
  "Anna finds a dark spot on her arm. Her GP can't say for sure. The specialist is five hundred kilometres away.",
  "So she joins a queue of a hundred and twenty-six thousand people. Weeks pass, and nobody can tell her where her case is.",
  "OncoScan changes that. A specialist's answer, in twenty-four hours.",
  "Step one. Anna sends a photo and her story, in a short chat, from home.",
  "Step two. A specialist reviews it. The photo, her history, the warning signs. One decision, signed.",
  "Anna follows every stage, live.",
  "And the queue is shared. Any verified specialist can join, anywhere in the country.",
  "Step three. If the answer is, see someone in person, she books the nearest specialist in one tap.",
  "The next day, Anna has her answer, and an appointment.",
  "OncoScan. Already in use in Latvia. Next, Finland."
];
if (typeof window !== 'undefined') window.LINES = LINES;
if (typeof module !== 'undefined') module.exports = LINES;
