// Demo queue.
// Skin cases use real dermoscopy images from the HAM10000 dataset (see cases/ham10000/SOURCE.md).
// For those, area, age band and `truth` come from the dataset. The patient's words are fictional,
// and the analysis was written by hand from the image: no model is connected.
// Mouth cases are fully fictional and have no image.
// ai.score    0–100, likelihood that the finding needs a specialist's in-person look
// ai.signals  what in this case may indicate cancer (empty when there is nothing)
// ai.calm     what speaks against cancer
// ai.unclear  set when the photo is too poor to judge
// truth       the dataset's confirmed label, shown only after the specialist signs
window.RATE_EUR = 4; // demo fee per review
window.CASES = [
  { id: "FI-0415", answers: { dur: "Months or years", changes: ["it has grown", "it itches"] }, area: "Skin", site: "Lower leg", age: "40–49", minsAgo: 1062,
    images: ["ham10000/ISIC_0026993.jpg"], truth: "melanoma (histopathology)",
    text: "Mole on my leg that has got bigger over the summer. It itches now and then. No bleeding.",
    ai: { score: 86,
      signals: ["Asymmetric shape", "Irregular, notched border", "Several colours: brown, black, blue-grey", "Grew over the summer; itches (patient's report)"],
      calm: ["No bleeding or ulceration"] } },
  { id: "FI-0419", answers: { dur: "Months or years", changes: [] }, area: "Skin", site: "Lower leg", age: "40–49", minsAgo: 845,
    images: ["ham10000/ISIC_0031588.jpg"], truth: "benign mole (follow-up)",
    text: "Brown spot I've had as long as I can remember. A friend said to get it checked. Hasn't changed.",
    ai: { score: 8,
      signals: [],
      calm: ["Symmetric shape", "One even red-brown colour", "Smooth, regular border", "Unchanged for years (patient's report)"] } },
  { id: "FI-0428", answers: { dur: "Months or years", changes: ["it is not healing"] }, area: "Skin", site: "Face", age: "80+", minsAgo: 610,
    images: ["ham10000/ISIC_0024457.jpg"], truth: "basal cell carcinoma (histopathology)",
    text: "Sore on my face for a few months. It scabs over, heals, then comes back. I've worked outdoors all my life.",
    ai: { score: 81,
      signals: ["Ulcerated centre with crusts", "Raised, shiny pink border", "Dark pigment spots", "Scabs, heals and returns (patient's report)", "Sun-exposed site, lifelong outdoor work"],
      calm: [] } },
  { id: "FI-0440", answers: { dur: "Not sure", changes: ["it hurts"] }, area: "Skin", site: "Face", age: "70–79", minsAgo: 395,
    images: ["ham10000/ISIC_0029659.jpg"], truth: "actinic keratosis or early squamous cell carcinoma (histopathology)",
    text: "Rough, scaly patch on my forehead. Feels like sandpaper. A bit tender.",
    ai: { score: 58,
      signals: ["Red, rough, scaly surface", "Poorly defined edge", "Sun-exposed site", "Tender (patient's report)"],
      calm: ["Flat, no ulcer or bleeding"] } },
  { id: "FI-0436", answers: { dur: "Not sure", changes: [] }, area: "Skin", site: "Forearm", age: "40–49", minsAgo: 250,
    images: ["ham10000/ISIC_0024693.jpg"], truth: "benign mole (follow-up)",
    text: "Light patch on my arm. Not sure how long it's been there. Photo is a bit blurry, sorry.",
    ai: { score: 40, unclear: "Photo is out of focus. Border and colour cannot be judged.",
      signals: ["Faint pigmented area with no clear edge", "Duration unknown"],
      calm: [] } },
  { id: "FI-0412", answers: { dur: "More than 6 weeks", changes: ["it is not healing", "it bleeds"] }, area: "Mouth", site: "Lower lip, left", age: "60–69", minsAgo: 180,
    images: ["oral-001.jpg"],
    text: "Sore on the lower lip that hasn't healed in about six weeks. Bleeds sometimes when eating. Smoked for 30 years, stopped in 2019.",
    ai: { score: 84,
      signals: ["Not healed in 6 weeks (over 3 weeks is a red flag)", "Bleeds when eating", "30 years of smoking, age 60–69"],
      calm: [] } },
  { id: "FI-0423", answers: { dur: "Not sure", changes: [] }, area: "Mouth", site: "Inside right cheek", age: "50–59", minsAgo: 95,
    images: ["oral-002.jpg"],
    text: "White patch on the inside of my cheek, noticed by my dentist. Doesn't hurt. I think I bite my cheek there.",
    ai: { score: 38,
      signals: ["White patch found by the dentist", "Duration unknown"],
      calm: ["Painless", "On the bite line: friction is likely"] } },
  { id: "FI-0431", answers: { dur: "Less than 2 weeks", changes: ["it hurts"] }, area: "Mouth", site: "Tongue, right edge", age: "20–29", minsAgo: 35,
    images: ["oral-003.jpg"],
    text: "Painful round sore on the side of my tongue for four days. I get these a few times a year when stressed.",
    ai: { score: 7,
      signals: [],
      calm: ["Present 4 days (under 3 weeks)", "Same pattern several times a year", "Age 20–29"] } }
];
