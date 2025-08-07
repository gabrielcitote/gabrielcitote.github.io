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

/* ---------- util: ISO → Country Name ---------- */
function isoToName(iso) {
  // Map ISO codes to country names
  const countryNames = {
    DK: "Denmark", ZA: "South Africa", FR: "France", ES: "Spain", 
    DE: "Germany", IT: "Italy", RU: "Russia", CN: "China", 
    JP: "Japan", BR: "Brazil", IN: "India", US: "United States",
    // Add more as needed
  };
  return countryNames[iso] || iso;
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
    if (panZoom || !mapObj.contentDocument) return;
    onSvgLoaded();
  };

  if (mapObj.contentDocument) tryInit();
  mapObj.addEventListener('load', tryInit);
}

function onSvgLoaded() {
  svgDoc = document.getElementById('map').contentDocument;
  
  // Enable zoom + pan with proper event prevention
  try {
    panZoom = svgPanZoom(svgDoc.documentElement, {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: true,
      center: true,
      minZoom: 1,
      maxZoom: 15,
      preventMouseEventsDefault: true,
      beforePan: () => !document.body.classList.contains('no-pan')
    });
    
    window.addEventListener('resize', () => panZoom.resize());
  } catch (e) {
    console.error('PanZoom init error:', e);
  }

  // Click handler with better country detection
  svgDoc.addEventListener('click', function(e) {
    // Prevent zoom/pan interference
    if (document.body.classList.contains('no-pan')) return;
    
    // Find country element by walking up DOM
    let target = e.target;
    while (target && target !== svgDoc.documentElement) {
      if (target.id && target.id.length === 2 && !target.id.startsWith('VIEWPORT')) {
        handleGuess(target);
        return;
      }
      target = target.parentNode;
    }
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
  const countryName = isoToName(iso);

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
