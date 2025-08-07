let map;
let countriesLayer;
let phrases = [];
let current = null;
let countryLangMap = {}; // ALPHA-3 ISO → Languages

const feedbackEl = document.getElementById('feedback');
const questionEl = document.getElementById('question');
const nextBtn    = document.getElementById('next');

// Load all game data
Promise.all([
  fetch('data/phrases.json').then(r => r.json()),
  fetch('data/countries.geo.json').then(r => r.json()),
  fetch('data/countries-languages.json').then(r => r.json())
]).then(([phraseData, geoData, langData]) => {
  phrases = phraseData;
  countryLangMap = langData;
  initMap(geoData);
  nextPhrase();
  nextBtn.onclick = nextPhrase;
});

function initMap(geoData) {
  map = L.map('map').setView([20, 0], 2);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    minZoom: 1,
    maxZoom: 6
  }).addTo(map);

  countriesLayer = L.geoJSON(geoData, {
    style: {
      color: "#444",
      weight: 1,
      fillColor: "#ccc",
      fillOpacity: 0.7
    },
    onEachFeature: (feature, layer) => {
      layer.on('click', () => handleGuess(feature, layer));
    }
  }).addTo(map);
}

function nextPhrase() {
  // Reset map styles
  countriesLayer.eachLayer(layer => {
    layer.setStyle({ fillColor: "#ccc" });
  });

  // Pick random phrase
  current = phrases[Math.floor(Math.random() * phrases.length)];
  questionEl.textContent = current.text;
  feedbackEl.textContent = '';
  nextBtn.hidden = true;
}

function handleGuess(feature, layer) {
  const iso = feature.properties.iso_a3; // 3-letter ISO
  const name = feature.properties.name;
  const isRight = current.iso.includes(iso);

  const languages = countryLangMap[iso] || [];
  const langText = languages.length ? languages.join(', ') : 'Unknown';

  if (isRight) {
    layer.setStyle({ fillColor: "green" });
    feedbackEl.textContent = `✅ Correct! (${name}) — Languages: ${langText}`;
  } else {
    layer.setStyle({ fillColor: "red" });

    // Show correct countries
    const correctNames = [];

    countriesLayer.eachLayer(l => {
      const correctIso = l.feature.properties.iso_a3;
      if (current.iso.includes(correctIso)) {
        l.setStyle({ fillColor: "green" });
        correctNames.push(l.feature.properties.name);
      }
    });

    feedbackEl.textContent =
      `❌ Wrong – that’s ${name}. Languages: ${langText}. ` +
      `Correct language: ${current.lang}. Accepted countries: ${correctNames.join(', ')}`;
  }

  nextBtn.hidden = false;
}
