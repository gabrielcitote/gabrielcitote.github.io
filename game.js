/* ---------- global state ---------- */
let phrases = [];
let current  = null;

let svgDoc      = null;                     // set after SVG loads
let panZoom     = null;                     // svg-pan-zoom instance
const feedbackEl = document.getElementById('feedback');
const nextBtn    = document.getElementById('next');

/* ---------- load phrases, then start ---------- */
fetch('data/phrases.json')
  .then(r => r.json())
  .then(json => { phrases = json; startGame(); });

/* ---------- ISO → country name helper ---------- */
function isoToName(el, iso) {
  if (!el) return iso;
  const t = el.querySelector('title');
  return t && t.textContent.trim() ? t.textContent.trim() : iso;
}

/* ---------- main initialiser ---------- */
function startGame() {
  nextPhrase();                                  // show first sentence

  const mapObj = document.getElementById('map');

  // If SVG already cached, init immediately; else wait for 'load'
  if (mapObj.contentDocument) {
    onSvgLoaded();
  } else {
    mapObj.addEventListener('load', onSvgLoaded);
  }

  nextBtn.onclick = nextPhrase;
}

/* runs exactly once, after SVG is available */
function onSvgLoaded() {
  svgDoc = document.getElementById('map').contentDocument;

  /* enable zoom + pan */
  panZoom = svgPanZoom(svgDoc.documentElement, {
    zoomEnabled: true,
    controlIconsEnabled: true,
    fit: true,
    center: true,
    contain: true,      // keep the map inside its box
    minZoom: 1,
    maxZoom: 15
  });

  /* click-vs-drag filter on each PATH (so wheel/drag still work) */
  svgDoc.querySelectorAll('path').forEach(path => {
    let sx, sy, moved = false;

    path.addEventListener('mousedown', e => {
      sx = e.clientX; sy = e.clientY; moved = false;
    });
    path.addEventListener('mousemove', e => {
      if (Math.abs(e.clientX - sx) > 3 || Math.abs(e.clientY - sy) > 3) moved = true;
    });
    path.addEventListener('mouseup', e => {
      if (!moved) handleGuess(path);
    });
  });
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
  // Walk up to the <g id="XX"> that owns the ISO code
  while (target && !target.id) target = target.parentNode;
  if (!target || target.id.startsWith('VIEWPORT')) return;   // ocean / background

  const iso   = target.id.toUpperCase();
  const name  = isoToName(target, iso);
  const right = current.iso.includes(iso);

  target.classList.add(right ? 'correct' : 'wrong');
  feedbackEl.textContent = right
    ? `✅ Correct! (${name})`
    : `❌ Wrong – that’s ${name}. Correct language: ${current.lang}`;

  if (!right && svgDoc) {
    const correctEl = svgDoc.getElementById(current.iso[0]);
    if (correctEl) correctEl.classList.add('correct');
  }

  nextBtn.hidden = false;
}
