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

/* -------- onSvgLoaded (replace the whole block) ---------- */
function onSvgLoaded() {
  svgDoc = document.getElementById('map').contentDocument;

  /* enable zoom + pan */
  panZoom = svgPanZoom(svgDoc.documentElement, {
    zoomEnabled: true,
    controlIconsEnabled: true,
    fit: true,
    center: true,
    contain: true,
    minZoom: 1,
    maxZoom: 15
  });

  /* click-vs-drag filter on each path */
  svgDoc.querySelectorAll('path').forEach(path => {
    let sx = 0, sy = 0, moved = false;

    path.addEventListener('mousedown', e => {
      sx = e.clientX; sy = e.clientY; moved = false;
    });

    path.addEventListener('mousemove', e => {
      if (Math.abs(e.clientX - sx) > 3 || Math.abs(e.clientY - sy) > 3)
        moved = true;
    });

    path.addEventListener('mouseup', e => {
      if (!moved) handleGuess(path);          // real click
    });
  });
}

/* ---------- show new phrase ---------- */
function nextPhrase() {
  if (svgDoc) {
    svgDoc.querySelectorAll('.correct, .wrong')
          .forEach(p => p.classList.remove('correct', 'wrong'));
  }

  current = phrases[Math.floor(Math.random() * phrases.length)];
  document.getElementById('question').textContent = current.text;
  feedbackEl.textContent = '';
  nextBtn.hidden = true;
  
  // Allow panning again
  document.body.classList.remove('no-pan');
}

/* ---------- handle country click ---------- */
function handleGuess(target) {
  const iso = target.id.toUpperCase();
  const isRight = current.iso.includes(iso);
  const name = isoToName(target, iso);   // use element + iso

  // Visual feedback
  target.classList.add(isRight ? 'correct' : 'wrong');
  
  // Text feedback
  feedbackEl.textContent = isRight
    ? `✅ Correct! (${countryName})`
    : `❌ Wrong - that's ${countryName}. Correct language: ${current.lang}`;

  // Highlight correct country if wrong
  if (!isRight && svgDoc) {
    current.iso.forEach(correctIso => {
      const correctEl = svgDoc.getElementById(correctIso);
      if (correctEl) correctEl.classList.add('correct');
    });
  }

  nextBtn.hidden = false;
  
  // Prevent panning after selection
  document.body.classList.add('no-pan');
}
