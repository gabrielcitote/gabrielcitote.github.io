/* ---------- global state ---------- */
let phrases = [];
let current  = null;
let svgDoc   = null;          // SVG DOM once loaded
let panZoom  = null;          // svg-pan-zoom instance
const feedbackEl = document.getElementById('feedback');
const nextBtn    = document.getElementById('next');

/* ---------- load phrases, then start ---------- */
fetch('data/phrases.json')
  .then(r => r.json())
  .then(json => { phrases = json; startGame(); });

/* ---------- tiny helper: ISO ➜ country name (from <title>) ---------- */
function isoToName(el, iso) {
  const t = el && el.querySelector ? el.querySelector('title') : null;
  return t && t.textContent.trim() ? t.textContent.trim() : iso;
}

/* ---------- game bootstrapping ---------- */
function startGame() {
  nextPhrase();
  initMap();
  nextBtn.onclick = nextPhrase;
}

/* ---------- load the SVG map and init pan-zoom ---------- */
function initMap() {
  const mapObj = document.getElementById('map');

  const tryInit = () => {
    if (!mapObj.contentDocument) return;   // still not ready
    onSvgLoaded();
  };

  if (mapObj.contentDocument) tryInit();           // cached
  mapObj.addEventListener('load', tryInit);        // or freshly loaded
}

function onSvgLoaded() {
  svgDoc = document.getElementById('map').contentDocument;

  /* zoom + pan */
  panZoom = svgPanZoom(svgDoc.documentElement, {
    zoomEnabled: true,
    controlIconsEnabled: true,
    fit: true,
    center: true,
    contain: true,
    minZoom: 1,
    maxZoom: 15
  });

  /* single click listener — svg-pan-zoom suppresses click after a drag */
  svgDoc.addEventListener('click', handleMapClick);
}

/* ---------- click dispatcher ---------- */
function handleMapClick(e) {
  let el = e.target;

  // Climb until a 2-letter ISO id that is not VIEWPORT-noise
  while (el && (!el.id || el.id.length !== 2 || el.id.startsWith('VIEWPORT'))) {
    el = el.parentNode;
  }
  if (el && el.id && el.id.length === 2) handleGuess(el);
}

/* ---------- new prompt ---------- */
function nextPhrase() {
  if (svgDoc) {
    svgDoc.querySelectorAll('.correct, .wrong')
          .forEach(el => el.classList.remove('correct', 'wrong'));
  }

  current = phrases[Math.floor(Math.random() * phrases.length)];
  document.getElementById('question').textContent = current.text;
  feedbackEl.textContent = '';
  nextBtn.hidden = true;
}

/* ---------- evaluate guess ---------- */
function handleGuess(countryEl) {
  const iso   = countryEl.id.toUpperCase();
  const name  = isoToName(countryEl, iso);
  const right = current.iso.includes(iso);

  countryEl.classList.add(right ? 'correct' : 'wrong');
  feedbackEl.textContent = right
    ? `✅ Correct! (${name})`
    : `❌ Wrong – that’s ${name}. Correct language: ${current.lang}`;

  if (!right && svgDoc) {
    current.iso.forEach(correctIso => {
      const ok = svgDoc.getElementById(correctIso);
      if (ok) ok.classList.add('correct');
    });
  }

  nextBtn.hidden = false;
}
