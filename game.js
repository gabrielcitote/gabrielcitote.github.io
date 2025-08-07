let phrases = [];
let current = null;

fetch('data/phrases.json')
  .then(r => r.json())
  .then(json => { phrases = json; startGame(); });

function startGame() {
  nextPhrase();

  document.getElementById('map')
    .addEventListener('load', () => {
      const svgDoc = document.getElementById('map').contentDocument;

        svgPanZoom(svgDoc.documentElement, {
          zoomEnabled: true,
          controlIconsEnabled: true,
          fit: true,
          center: true,
          contain: true,   // keep map inside the box
          minZoom: 1,
          maxZoom: 15
        });


      svgDoc.querySelectorAll('path').forEach(p => {
        p.addEventListener('click', () => handleGuess(p));
      });
    });

  document.getElementById('next').onclick = nextPhrase;
}


function nextPhrase() {
  const svgDoc = document.getElementById('map').contentDocument;
  if (svgDoc) svgDoc.querySelectorAll('.correct,.wrong')
                   .forEach(p => p.classList.remove('correct','wrong'));

  current = phrases[Math.floor(Math.random()*phrases.length)];
  document.getElementById('question').textContent = current.text;
  document.getElementById('feedback').textContent = '';
  document.getElementById('next').hidden = true;
}

function handleGuess(target) {
  // climb until we reach a node that has an id (the <g>)
  while (target && !target.id) target = target.parentNode;
  if (!target) return;                 // clicked ocean / background

  const iso = target.id.toUpperCase(); // e.g. "FR"
  const isRight = current.iso.includes(iso);

  target.classList.add(isRight ? 'correct' : 'wrong');
  feedback.textContent = isRight
        ? '✅ Correct!'
        : `❌ Wrong – that’s ${iso}. Correct language: ${current.lang}`;

  if (!isRight) {
    const right = svgDoc.getElementById(current.iso[0]);
    if (right) right.classList.add('correct');
  }
  nextBtn.hidden = false;
}


  document.getElementById('next').hidden = false;
}
