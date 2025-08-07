/* ---------- global state ---------- */
let phrases   = [];
let current   = null;
let svgDoc    = null;          // will hold the SVG DOM
let panZoom   = null;          // svg-pan-zoom instance
const feedbackEl = document.getElementById('feedback');
const nextBtn    = document.getElementById('next');

/* ---------- load data, then start ---------- */
fetch('data/phrases.json')
  .then(r => r.json())
  .then(json => { phrases = json; startGame(); });

/* ---------- helper: ISO ➜ country name (from <title>) ---------- */
function isoToName(el, iso) {
  const t = el && el.querySelector ? el.querySelector('title') : null;
  return (t && t.textContent.trim()) || iso;
}

/* ---------- start-up ---------- */
function startGame() {
  nextPhrase();
  initMap();
  nextBtn.onclick = nextPhrase;
}

/* ---------- load / init the SVG map ---------- */
function initMap() {
  const mapObj = document.getElementById('map');

  const tryInit = () => {
    if (!mapObj.contentDocument) return;   // not ready yet
    onSvgLoaded();
  };

  // if SVG already cached
  if (mapObj.contentDocument) tryInit();

  // or wait for load event
  mapObj.addEventListener('load', tryInit);
}

/* ---------- runs once when SVG is available ---------- */
function onSvgLoaded() {
  svgDoc = document.getElementById('map').contentDocument;

  /* enable zoom & pan */
  panZoom = svgPanZoom(svgDoc.documentElement, {
    zoomEnabled: true,
    controlIconsEnabled: true,
    fit: true,
    center: true,
    contain: true,
    minZoom: 1,
    maxZoom: 15
  });

  /* — Click-vs-drag filter — */
  let isDragging = false;
  svgDoc.addEventListener('mousedown', () =>  isDragging = false);
  svgDoc.addEventListener('mousemove', () =>  isDragging = true);
  svgDoc.addEventListener('mouseup',   e => { if (!isDragging) handleMapClick(e); });

  // Touch support
  svgDoc.addEventListener('touchstart', () => isDragging = false);
  svgDoc.addEventListener('touchmove',  () => isDragging = true);
  svgDoc.addEventListener('touchend',   e => { if (!isDragging) handleMapClick(e); });
}

/* ---------- map click dispatcher ---------- */
function handleMapClick(e) {
  let el = e.target;

  // walk up to first ancestor that has a 2-letter ISO id
  while (el && (!el.id || el.id.startsWith('VIEWPORT') || el.id.length !== 2)) {
    el = el.parentNode;
  }
  if (el && el.id && el.id.length === 2) {
    handleGuess(el);          // valid country group
  }
}

/* ---------- show a new random phrase ---------- */
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

/* ---------- evaluate a guess ---------- */
function handleGuess(countryEl) {
  const iso   = countryEl.id.toUpperCase();
  const name  = isoToName(countryEl, iso);
  const right = current.iso.includes(iso);

  countryEl.classList.add(right ? 'correct' : 'wrong');
  feedbackEl.textContent = right
    ? `✅ Correct! (${name})`
    : `❌ Wrong – that's ${name}. Correct language: ${current.lang}`;

  if (!right && svgDoc) {
    current.iso.forEach(correctIso => {
      const ok = svgDoc.getElementById(correctIso);
      if (ok) ok.classList.add('correct');
    });
  }

  nextBtn.hidden = false;
}
