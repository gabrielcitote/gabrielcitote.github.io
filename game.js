/* ---------- global state ---------- */
let phrases = [];
let current  = null;
let panZoom = null;
let svgDoc;
const feedbackEl = document.getElementById('feedback');
const nextBtn    = document.getElementById('next');

/* ---------- load data, then start ---------- */
fetch('data/phrases.json')
  .then(r => r.json())
  .then(json => { phrases = json; startGame(); });

/* -------- util: ISO ➜ country name ------------- */
function isoToName(el, iso){
  if (!el) return iso;
  const t = el.querySelector('title');
  return t && t.textContent.trim() ? t.textContent.trim() : iso;
}

/* ---------- main init ---------- */
function startGame() {
  nextPhrase();
  initMap();
  nextBtn.onclick = nextPhrase;
}

function initMap() {
  const mapObj = document.getElementById('map');
  
  const tryInit = () => {
    if (!mapObj.contentDocument) {
      console.error('SVG failed to load');
      return;
    }
    onSvgLoaded();
  };

  // Set timeout as fallback
  const loadTimeout = setTimeout(() => {
    if (!panZoom) {
      console.error('SVG loading timed out');
    }
  }, 3000);

  mapObj.addEventListener('load', () => {
    clearTimeout(loadTimeout);
    tryInit();
  });

  // Try immediately if already loaded
  if (mapObj.contentDocument) {
    clearTimeout(loadTimeout);
    tryInit();
  }
}

/* ... your existing code ... */

function onSvgLoaded() {
  svgDoc = document.getElementById('map').contentDocument;

  panZoom = svgPanZoom(svgDoc.documentElement, {
    zoomEnabled: true,
    controlIconsEnabled: true,
    fit: true,
    center: true,
    contain: true,
    minZoom: 1,
    maxZoom: 15
  });

  svgDoc.addEventListener('click', e => {
    let el = e.target;
    while (el && !el.id) el = el.parentNode;
    if (el && !el.id.startsWith('VIEWPORT')) handleGuess(el);
  });
}

/* OUTSIDE of onSvgLoaded: */
function nextPhrase() {
  if (svgDoc) {
    svgDoc.querySelectorAll('.correct, .wrong')
          .forEach(p => p.classList.remove('correct', 'wrong'));
  }

  current = phrases[Math.floor(Math.random() * phrases.length)];
  document.getElementById('question').textContent = current.text;
  feedbackEl.textContent = '';
  nextBtn.hidden = true;
  document.body.classList.remove('no-pan');
}

function handleGuess(target) {
  const iso = target.id.toUpperCase();
  const isRight = current.iso.includes(iso);
  const name = isoToName(target, iso);

  target.classList.add(isRight ? 'correct' : 'wrong');
  
  feedbackEl.textContent = isRight
    ? `✅ Correct! (${name})`
    : `❌ Wrong – that's ${name}. Correct language: ${current.lang}`;

  if (!isRight && svgDoc) {
    current.iso.forEach(correctIso => {
      const correctEl = svgDoc.getElementById(correctIso);
      if (correctEl) correctEl.classList.add('correct');
    });
  }

  nextBtn.hidden = false;
  document.body.classList.add('no-pan');
}
