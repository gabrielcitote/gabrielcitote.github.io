/* ---------- global state ---------- */
let phrases = [];
let current  = null;

let svgDoc;                               // set after the SVG loads
const feedbackEl = document.getElementById('feedback');
const nextBtn    = document.getElementById('next');

/* ---------- load data, then start ---------- */
fetch('data/phrases.json')
  .then(r => r.json())
  .then(json => { phrases = json; startGame(); });

/* ---------- main init ---------- */
function startGame() {
  nextPhrase();                     // show first sentence

  const mapObj = document.getElementById('map');

  // If SVG already cached & ready, init immediately; else wait for load event
  if (mapObj.contentDocument) {
    onSvgLoaded();
  } else {
    mapObj.addEventListener('load', onSvgLoaded);
  }

  nextBtn.onclick = nextPhrase;
}

/* ---------- called once when SVG is ready ---------- */
function onSvgLoaded() {
  svgDoc = document.getElementById('map').contentDocument;

  // enable zoom + pan
  window.panZoom = svgPanZoom(svgDoc.documentElement, {
    zoomEnabled: true,
    controlIconsEnabled: true,
    fit: true,
    center: true,
    contain: true,     // keep map within box
    minZoom: 1,
    maxZoom: 15
  });

  // add click listeners to every country path
  svgDoc.querySelectorAll('path').forEach(p =>
    p.addEventListener('click', () => handleGuess(p))
  );
}

/* ---------- show a new random phrase ---------- */
function nextPhrase() {
  if (svgDoc) {
    svgDoc.querySelectorAll('.correct, .wrong')
          .forEach(p => p.classList.remove('correct', 'wrong'));
  }

  current = phrases[Math.floor(Math.random() * phrases.length)];
  document.getElementById('question').textContent = current.text;
  feedbackEl.textContent = '';
  nextBtn.hidden = true;
}

/* ---------- handle a country click ---------- */
function handleGuess(target) {
  // Walk up the DOM to the <g id="XX"> with the ISO code
  while (target && !target.id) target = target.parentNode;
  if (!target) return;                // clicked the ocean

  const iso = target.id.toUpperCase();
  const isRight = current.iso.includes(iso);

  target.classList.add(isRight ? 'correct' : 'wrong');
  feedbackEl.textContent = isRight
    ? '✅ Correct!'
    : `❌ Wrong – that’s ${iso}. Correct language: ${current.lang}`;

  // highlight one correct country if user guessed wrong
  if (!isRight && svgDoc) {
    const rightEl = svgDoc.getElementById(current.iso[0]);
    if (rightEl) rightEl.classList.add('correct');
  }

  nextBtn.hidden = false;
}
