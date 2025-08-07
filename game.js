/* ---------- global state ---------- */
let phrases = [];
let current  = null;
let panZoom = null; // Store panZoom instance
let svgDoc; // set after the SVG loads
const feedbackEl = document.getElementById('feedback');
const nextBtn    = document.getElementById('next');

/* ---------- load data, then start ---------- */
fetch('data/phrases.json')
  .then(r => r.json())
  .then(json => { phrases = json; startGame(); });

/* ---------- util: ISO → Country Name (from <title>) ---------- */
function isoToName(element, iso) {
  if (!element) return iso;
  const title = element.querySelector('title');
  if (title && title.textContent.trim()) return title.textContent.trim();
  return iso; // fallback
}

/* ---------- main init ---------- */
function startGame() {
  nextPhrase(); // show first sentence
  nextBtn.onclick = nextPhrase;
  initMap();
}

function initMap() {
  const mapObj = document.getElementById('map');
  
  // Handle both cached and async-loaded SVGs
  const tryInit = () => {
    if (mapObj.contentDocument && !panZoom) {
      onSvgLoaded();
    }
  };

  // Try immediately if already loaded
  tryInit();
  
  // Also listen for future load events
  mapObj.addEventListener('load', tryInit);
}

function onSvgLoaded() {
  svgDoc = document.getElementById('map').contentDocument;
  
  // Enable zoom + pan
  try {
    panZoom = svgPanZoom(svgDoc.documentElement, {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: true,
      center: true,
      contain: true,
      minZoom: 1,
      maxZoom: 15,
      beforePan: (oldPan, newPan) => {
        // Prevent panning during drag operations
        return !document.body.classList.contains('dragging');
      }
    });
    
    // Ensure proper sizing
    window.addEventListener('resize', () => panZoom.resize());
  } catch (e) {
    console.error('SVG Pan Zoom initialization failed:', e);
  }

  // Add click handler for country selection
  svgDoc.addEventListener('click', function(e) {
    handleSvgClick(e);
  });
}

/* ---------- SVG click handler ---------- */
function handleSvgClick(e) {
  // Walk up to find country group
  let target = e.target;
  while (target && !target.id && target.parentNode !== svgDoc.documentElement) {
    target = target.parentNode;
  }
  
  // Validate target
  if (!target || !target.id || target.id.startsWith('VIEWPORT')) return;
  
  handleGuess(target);
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
