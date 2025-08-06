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

function handleGuess(pathEl) {
  const iso = pathEl.id;
  const isRight = current.iso.includes(iso);

  pathEl.classList.add(isRight ? 'correct' : 'wrong');
  document.getElementById('feedback').textContent =
    isRight ? '✅ Correct!' :
    `❌ Wrong – that’s ${iso}. Correct language: ${current.lang}`;

  if (!isRight) {
    const svgDoc = document.getElementById('map').contentDocument;
    const rightId = current.iso[0];
    const rightEl = svgDoc.getElementById(rightId);
    if (rightEl) rightEl.classList.add('correct');
  }

  document.getElementById('next').hidden = false;
}
