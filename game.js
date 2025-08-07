let map;
let countriesLayer;
let phrases = [];
let current = null;
let countryLangMap = {}; // NEW: Stores country-to-languages

const feedbackEl = document.getElementById('feedback');
const questionEl = document.getElementById('question');
const nextBtn    = document.getElementById('next');

// Load phrases, GeoJSON map, and country languages
Promise.all([
  fetch('data/phrases.json').then(r => r.json()),
  fetch('data/countries.geo.json').then(r => r.json()),
  fetch('data/countries-languages.json').then(r => r.json())  // NEW
]).then(([phraseData, geoData, langData]) => {
  phrases = phraseData;
  countryLangMap = langData;  // NEW
  initMap(geoData);
  nextPhrase();
  nextBtn.onclick = nextPhrase;
});

function initMap(geoData) {
  map = L.map('map').setView([20, 0], 2);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
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
  countriesLayer.eachLayer(layer => {
    layer.setStyle({ fillColor: "#ccc" });
  });

  current = phrases[Math.floor(Math.random() * phrases.length)];
  questionEl.textContent = current.text;
  feedbackEl.textContent = '';
  nextBtn.hidden = true;
}

function handleGuess(feature, layer) {
  const iso = feature.id;
  const name = feature.properties.name;
  const isRight = current.iso.includes(iso);

  const languages = countryLangMap[iso] || [];
  const langText = languages.length ? languages.join(', ') : 'Unknown';

  if (isRight) {
    layer.setStyle({ fillColor: "green" });
    feedbackEl.textContent = `✅ Correct! (${name}) — Languages: ${langText}`;
  } else {
    layer.setStyle({ fillColor: "red" });
    feedbackEl.textContent = `❌ Wrong – that’s ${name}. Languages: ${langText}. Correct language: ${current.lang}`;

    countriesLayer.eachLayer(l => {
      const correct = current.iso.includes(l.feature.id);
      if (correct) l.setStyle({ fillColor: "green" });
    });
  }

  nextBtn.hidden = false;
}
