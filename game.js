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

/* ---------- util: ISO → Country Name (from <title>) ---------- */
function isoToName(element, iso){
  if(!element) return iso;
  const title = element.querySelector('title');
  if(title && title.textContent.trim()) return title.textContent.trim();
  return iso; // fallback
}

/* ---------- main init ---------- */
function startGame() {
  nextPhrase();                     // show first sentence

  const mapObj = document.getElementById('map');

  // Init once—whether SVG is cached or fires 'load'
  const tryInit = () => {
    if (panZoom || !mapObj.contentDocument) return;        // already done or not ready
    onSvgLoaded();
  };

  if (mapObj.contentDocument) tryInit();
  mapObj.addEventListener('load', tryInit);

  nextBtn.onclick = nextPhrase;
}

function onSvgLoaded() {
  svgDoc = document.getElementById('map').contentDocument;

  /* enable zoom + pan */
  window.panZoom = svgPanZoom(svgDoc.documentElement, {
    zoomEnabled: true,
    controlIconsEnabled: true,
    fit: true,
    center: true,
    contain: true,
    minZoom: 1,
    maxZoom: 15
  });

  /* click-vs-drag helper */
  let startX, startY, moved;
  svgDoc.addEventListener('mousedown', e => {
    startX = e.clientX; startY = e.clientY; moved = false;
  });
  svgDoc.addEventListener('mousemove', e => {
    if (Math.abs(e.clientX - startX) > 3 || Math.abs(e.clientY - startY) > 3)
      moved = true;
  });
  svgDoc.addEventListener('mouseup', e => {
    if (!moved) handleGuess(e.target);
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
  // Walk up to the <g id="XX"> that carries the ISO code
  while (target && !target.id) target = target.parentNode;
  if (!target || target.id.startsWith('VIEWPORT')) return; // ocean/background or viewport group

  const iso = target.id.toUpperCase();
  const isRight = current.iso.includes(iso);
  const countryName = isoToName(target, iso);

  target.classList.add(isRight ? 'correct' : 'wrong');
  feedbackEl.textContent = isRight
    ? `✅ Correct! (${countryName})`
    : `❌ Wrong – that’s ${countryName}. Correct language: ${current.lang}`;

  if (!isRight && svgDoc) {
    const rightEl = svgDoc.getElementById(current.iso[0]);
    if (rightEl) rightEl.classList.add('correct');
  }

  nextBtn.hidden = false;
}
