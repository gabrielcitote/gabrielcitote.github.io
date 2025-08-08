let map;
let countriesLayer;
let phrases = [];
let current = null;
let countryLangMap = {}; // ALPHA-3 ISO → Languages
let familyShown = false;
let workingPhrases = [];                  // phrases after filtering

const modeSelect = document.getElementById('mode');

const iso2to3 = {
  "AF": "AFG", "AX": "ALA", "AL": "ALB", "DZ": "DZA", "AS": "ASM", "AD": "AND",
  "AO": "AGO", "AI": "AIA", "AQ": "ATA", "AG": "ATG", "AR": "ARG", "AM": "ARM",
  "AW": "ABW", "AU": "AUS", "AT": "AUT", "AZ": "AZE", "BS": "BHS", "BH": "BHR",
  "BD": "BGD", "BB": "BRB", "BY": "BLR", "BE": "BEL", "BZ": "BLZ", "BJ": "BEN",
  "BM": "BMU", "BT": "BTN", "BO": "BOL", "BQ": "BES", "BA": "BIH", "BW": "BWA",
  "BV": "BVT", "BR": "BRA", "IO": "IOT", "BN": "BRN", "BG": "BGR", "BF": "BFA",
  "BI": "BDI", "CV": "CPV", "KH": "KHM", "CM": "CMR", "CA": "CAN", "KY": "CYM",
  "CF": "CAF", "TD": "TCD", "CL": "CHL", "CN": "CHN", "CX": "CXR", "CC": "CCK",
  "CO": "COL", "KM": "COM", "CG": "COG", "CD": "COD", "CK": "COK", "CR": "CRI",
  "CI": "CIV", "HR": "HRV", "CU": "CUB", "CW": "CUW", "CY": "CYP", "CZ": "CZE",
  "DK": "DNK", "DJ": "DJI", "DM": "DMA", "DO": "DOM", "EC": "ECU", "EG": "EGY",
  "SV": "SLV", "GQ": "GNQ", "ER": "ERI", "EE": "EST", "SZ": "SWZ", "ET": "ETH",
  "FK": "FLK", "FO": "FRO", "FJ": "FJI", "FI": "FIN", "FR": "FRA", "GF": "GUF",
  "PF": "PYF", "TF": "ATF", "GA": "GAB", "GM": "GMB", "GE": "GEO", "DE": "DEU",
  "GH": "GHA", "GI": "GIB", "GR": "GRC", "GL": "GRL", "GD": "GRD", "GP": "GLP",
  "GU": "GUM", "GT": "GTM", "GG": "GGY", "GN": "GIN", "GW": "GNB", "GY": "GUY",
  "HT": "HTI", "HM": "HMD", "VA": "VAT", "HN": "HND", "HK": "HKG", "HU": "HUN",
  "IS": "ISL", "IN": "IND", "ID": "IDN", "IR": "IRN", "IQ": "IRQ", "IE": "IRL",
  "IM": "IMN", "IL": "ISR", "IT": "ITA", "JM": "JAM", "JP": "JPN", "JE": "JEY",
  "JO": "JOR", "KZ": "KAZ", "KE": "KEN", "KI": "KIR", "KP": "PRK", "KR": "KOR",
  "KW": "KWT", "KG": "KGZ", "LA": "LAO", "LV": "LVA", "LB": "LBN", "LS": "LSO",
  "LR": "LBR", "LY": "LBY", "LI": "LIE", "LT": "LTU", "LU": "LUX", "MO": "MAC",
  "MK": "MKD", "MG": "MDG", "MW": "MWI", "MY": "MYS", "MV": "MDV", "ML": "MLI",
  "MT": "MLT", "MH": "MHL", "MQ": "MTQ", "MR": "MRT", "MU": "MUS", "YT": "MYT",
  "MX": "MEX", "FM": "FSM", "MD": "MDA", "MC": "MCO", "MN": "MNG", "ME": "MNE",
  "MS": "MSR", "MA": "MAR", "MZ": "MOZ", "MM": "MMR", "NA": "NAM", "NR": "NRU",
  "NP": "NPL", "NL": "NLD", "NC": "NCL", "NZ": "NZL", "NI": "NIC", "NE": "NER",
  "NG": "NGA", "NU": "NIU", "NF": "NFK", "MP": "MNP", "NO": "NOR", "OM": "OMN",
  "PK": "PAK", "PW": "PLW", "PS": "PSE", "PA": "PAN", "PG": "PNG", "PY": "PRY",
  "PE": "PER", "PH": "PHL", "PL": "POL", "PT": "PRT", "PR": "PRI", "QA": "QAT",
  "RE": "REU", "RO": "ROU", "RU": "RUS", "RW": "RWA", "BL": "BLM", "SH": "SHN",
  "KN": "KNA", "LC": "LCA", "MF": "MAF", "PM": "SPM", "VC": "VCT", "WS": "WSM",
  "SM": "SMR", "ST": "STP", "SA": "SAU", "SN": "SEN", "RS": "SRB", "SC": "SYC",
  "SL": "SLE", "SG": "SGP", "SX": "SXM", "SK": "SVK", "SI": "SVN", "SB": "SLB",
  "SO": "SOM", "ZA": "ZAF", "GS": "SGS", "SS": "SSD", "ES": "ESP", "LK": "LKA",
  "SD": "SDN", "SR": "SUR", "SJ": "SJM", "SE": "SWE", "CH": "CHE", "SY": "SYR",
  "TW": "TWN", "TJ": "TJK", "TZ": "TZA", "TH": "THA", "TL": "TLS", "TG": "TGO",
  "TK": "TKL", "TO": "TON", "TT": "TTO", "TN": "TUN", "TR": "TUR", "TM": "TKM",
  "TC": "TCA", "TV": "TUV", "UG": "UGA", "UA": "UKR", "AE": "ARE", "GB": "GBR",
  "US": "USA", "UM": "UMI", "UY": "URY", "UZ": "UZB", "VU": "VUT", "VE": "VEN",
  "VN": "VNM", "VG": "VGB", "VI": "VIR", "WF": "WLF", "EH": "ESH", "YE": "YEM",
  "ZM": "ZMB", "ZW": "ZWE"
};

const languageFamilyMap = {
  // Germanic
  "English": "Germanic",
  "German": "Germanic",
  "Dutch": "Germanic",
  "Afrikaans": "Germanic",
  "Swedish": "Germanic",
  "Norwegian": "Germanic",
  "Danish": "Germanic",
  "Icelandic": "Germanic",
  "Frisian": "Germanic",
  "Luxembourgish": "Germanic",
  "Scots": "Germanic",
  "Low German": "Germanic",

  // Romance
  "French": "Romance",
  "Spanish": "Romance",
  "Portuguese": "Romance",
  "Italian": "Romance",
  "Romanian": "Romance",
  "Catalan": "Romance",
  "Galician": "Romance",
  "Occitan": "Romance",
  "Walloon": "Romance",
  "Sardinian": "Romance",
  "Ladino": "Romance",

  // Slavic
  "Russian": "Slavic",
  "Polish": "Slavic",
  "Ukrainian": "Slavic",
  "Belarusian": "Slavic",
  "Czech": "Slavic",
  "Slovak": "Slavic",
  "Slovene": "Slavic",
  "Serbian": "Slavic",
  "Croatian": "Slavic",
  "Bosnian": "Slavic",
  "Macedonian": "Slavic",
  "Bulgarian": "Slavic",
  "Montenegrin": "Slavic",
  "Rusyn": "Slavic",

  // Uralic
  "Finnish": "Uralic",
  "Estonian": "Uralic",
  "Hungarian": "Uralic",

  // Sino-Tibetan
  "Chinese": "Sino-Tibetan",
  "Simplified Chinese": "Sino-Tibetan",
  "Traditional Chinese": "Sino-Tibetan",
  "Mandarin": "Sino-Tibetan",
  "Cantonese": "Sino-Tibetan",
  "Wu": "Sino-Tibetan",
  "Hakka": "Sino-Tibetan",
  "Min Nan": "Sino-Tibetan",
  "Gan": "Sino-Tibetan",
  "Xiang": "Sino-Tibetan",
  "Tibetan": "Sino-Tibetan",
  "Burmese": "Sino-Tibetan",

  // Indo-Aryan
  "Hindi": "Indo-Aryan",
  "Urdu": "Indo-Aryan",
  "Bengali": "Indo-Aryan",
  "Punjabi": "Indo-Aryan",
  "Marathi": "Indo-Aryan",
  "Gujarati": "Indo-Aryan",
  "Sindhi": "Indo-Aryan",
  "Sinhala": "Indo-Aryan",
  "Nepali": "Indo-Aryan",
  "Assamese": "Indo-Aryan",
  "Odia": "Indo-Aryan",
  "Maithili": "Indo-Aryan",

  // Dravidian
  "Tamil": "Dravidian",
  "Telugu": "Dravidian",
  "Kannada": "Dravidian",
  "Malayalam": "Dravidian",

  // Turkic
  "Turkish": "Turkic",
  "Kazakh": "Turkic",
  "Uzbek": "Turkic",
  "Kyrgyz": "Turkic",
  "Tatar": "Turkic",
  "Azerbaijani": "Turkic",
  "Uyghur": "Turkic",
  "Turkmen": "Turkic",
  "Bashkir": "Turkic",
  "Chuvash": "Turkic",

  // Semitic
  "Arabic": "Semitic",
  "Hebrew": "Semitic",
  "Amharic": "Semitic",
  "Tigrinya": "Semitic",
  "Maltese": "Semitic",

  // Japonic & Koreanic
  "Japanese": "Japonic",
  "Korean": "Koreanic",

  // Austroasiatic
  "Vietnamese": "Austroasiatic",
  "Khmer": "Austroasiatic",

  // Austronesian
  "Tagalog": "Austronesian",
  "Malagasy": "Austronesian",
  "Malay": "Austronesian",
  "Indonesian": "Austronesian",
  "Javanese": "Austronesian",
  "Cebuano": "Austronesian",
  "Samoan": "Austronesian",
  "Maori": "Austronesian",
  "Hawaiian": "Austronesian",
  "Fijian": "Austronesian",

  // Niger-Congo
  "Swahili": "Niger-Congo",
  "Yoruba": "Niger-Congo",
  "Igbo": "Niger-Congo",
  "Zulu": "Niger-Congo",
  "Shona": "Niger-Congo",
  "Xhosa": "Niger-Congo",
  "Lingala": "Niger-Congo",
  "Kinyarwanda": "Niger-Congo",
  "Kirundi": "Niger-Congo",
  "Wolof": "Niger-Congo",
  "Bambara": "Niger-Congo",

  // Afroasiatic (non-Semitic)
  "Somali": "Afroasiatic",
  "Hausa": "Afroasiatic",
  "Berber": "Afroasiatic",

  // Other small families & isolates
  "Basque": "Language Isolate",
  "Georgian": "Kartvelian",
  "Armenian": "Indo-European (Armenian branch)",
  "Mongolian": "Mongolic",
  "Esperanto": "Constructed"
}

const feedbackEl = document.getElementById('feedback');
const questionEl = document.getElementById('question');
const nextBtn    = document.getElementById('next');
const showAnswerBtn = document.getElementById('show-answer');  
const skipBtn = document.getElementById('skip');              

// --- Regions (ISO-3) ---
const Regions = {
  Europe: new Set([
    "ALB","AND","AUT","BEL","BIH","BGR","HRV","CYP","CZE","DNK","EST","FIN","FRA",
    "DEU","GRC","HUN","ISL","IRL","ITA","LVA","LIE","LTU","LUX","MLT","MDA","MCO",
    "MNE","NLD","MKD","NOR","POL","PRT","ROU","SMR","SRB","SVK","SVN","ESP","SWE",
    "CHE","UKR","GBR","VAT","KOS" // include Kosovo if your GeoJSON has it
  ]),
  Asia: new Set([
    "AFG","ARM","AZE","BHR","BGD","BTN","BRN","KHM","CHN","CYP","GEO","HKG","IND",
    "IDN","IRN","IRQ","ISR","JPN","JOR","KAZ","KWT","KGZ","LAO","LBN","MAC","MYS",
    "MDV","MNG","MMR","NPL","PRK","OMN","PAK","PSE","PHL","QAT","SAU","SGP","KOR",
    "LKA","SYR","TWN","TJK","THA","TUR","TKM","ARE","UZB","VNM","YEM"
  ])
};

Object.assign(languageFamilyMap, {
  // Indo-Iranian (Indo-European)
  "Persian": "Indo-Iranian", "Farsi": "Indo-Iranian", "Dari": "Indo-Iranian", "Tajik": "Indo-Iranian",
  "Pashto": "Indo-Iranian", "Kurdish": "Indo-Iranian",

  // Tai–Kadai
  "Thai": "Tai-Kadai", "Lao": "Tai-Kadai",

  // Celtic
  "Welsh": "Celtic", "Irish": "Celtic", "Scottish Gaelic": "Celtic",
  "Breton": "Celtic", "Cornish": "Celtic", "Manx": "Celtic",

  // Eskimo–Aleut
  "Greenlandic": "Eskimo–Aleut", "Kalaallisut": "Eskimo–Aleut",

  // Austronesian (ensure both forms)
  "Filipino": "Austronesian", "Tagalog": "Austronesian",
  "Marshallese": "Austronesian", "Tongan": "Austronesian",

  // Bantu / Niger-Congo (fill the ones used in Hard)
  "Sesotho": "Niger-Congo", "Tswana": "Niger-Congo", "Venda": "Niger-Congo",
  "Tsonga": "Niger-Congo", "Herero": "Niger-Congo",
  "Akan": "Niger-Congo", "Twi": "Niger-Congo", // alias help
  "Chewa": "Niger-Congo", "Chichewa": "Niger-Congo", // treat as same
  "Sango": "Niger-Congo", // (Ubangi; good enough bucket)

  // Cushitic / Semitic (Afroasiatic)
  "Oromo": "Afroasiatic (Cushitic)",
  "Tigrinya": "Semitic",

  // Sino-Tibetan additions
  "Dzongkha": "Sino-Tibetan",

  // Mainland SE Asia you already have: Khmer (Austroasiatic), Burmese (Sino-Tibetan).

  // Caucasus / others already covered: Georgian (Kartvelian), Armenian present.

  // Indigenous Americas used in Hard
  "Quechua": "Quechuan",
  "Aymara": "Aymaran",
  "Guarani": "Tupian",
  "Nahuatl": "Uto-Aztecan",
  "Mapudungun": "Araucanian",

  // Creoles
  "Haitian Creole": "Creole (French-based)"
});


// --- GeoGuessr country set (fill this with the ISO-3 list you want) ---
const GeoGuessrISO3 = new Set([
  // Example starter set — replace/expand with your actual GG roster:
  "USA","CAN","MEX","BRA","ARG","CHL","COL","PER","ECU","URY","PRY","BOL",
  "GBR","IRL","FRA","DEU","ESP","PRT","ITA","CHE","AUT","NLD","BEL","LUX",
  "NOR","SWE","FIN","DNK","ISL","POL","CZE","SVK","HUN","ROU","BGR","GRC",
  "TUR","RUS","UKR","EST","LVA","LTU","SRB","HRV","SVN","BIH","MNE","MKD","ALB",
  "MAR","TUN","DZA","EGY","ZAF","NAM","BWA","ZMB","ZWE","MOZ","KEN","UGA",
  "NGA","GHA","CIV","SEN",
  "SAU","ARE","OMN","QAT","JOR","LBN","ISR",
  "IND","PAK","NPL","BGD","LKA",
  "CHN","TWN","JPN","KOR","HKG","MAC",
  "THA","VNM","KHM","LAO","MMR","MYS","SGP","IDN","PHL",
  "AUS","NZL"
]);

// After phrases are loaded OR at the top of game.js

// Difficulty by language
const EasyLanguages = new Set([
  "English", "Spanish", "French", "German", "Mandarin", "Arabic", "Portuguese"
]);

const MediumLanguages = new Set([
  ...EasyLanguages,
  "Italian", "Russian", "Japanese", "Korean", "Hindi", "Bengali",
  "Turkish", "Dutch", "Persian", "Swedish", "Norwegian", "Danish",
  "Polish", "Ukrainian", "Romanian", "Thai", "Vietnamese", "Greek",
  "Czech", "Finnish", "Malay", "Swahili", "Hebrew", "Urdu",
  "Catalan", "Serbian", "Croatian", "Slovak", "Bulgarian",
  "Indonesian", "Filipino", "Tamil", "Telugu", "Kannada",
  "Malayalam", "Punjabi"
]);

const HardLanguages = new Set([
  ...MediumLanguages,
  "Basque", "Icelandic", "Hungarian", "Georgian", "Amharic", "Maltese",
  "Mongolian", "Uzbek", "Khmer", "Burmese", "Tibetan", "Zulu",
  "Dzongkha", "Twi", "Fijian", "Samoan", "Tongan", "Marshallese",
  "Greenlandic", "Lao", "Kinyarwanda", "Sesotho", "Shona", "Xhosa",
  "Chewa", "Pashto", "Sindhi", "Wolof", "Kirundi", "Sango",
  "Chichewa", "Luxembourgish", "Breton", "Cornish", "Frisian",
  "Galician", "Occitan", "Romansh", "Aymara", "Guarani", "Quechua",
  "Nahuatl", "Mapudungun", "Maori", "Haitian Creole", "Somali",
  "Tswana", "Venda", "Tsonga", "Herero", "Oromo", "Tigrinya"
]);

function langDifficulty(lang) {
  if (EasyLanguages.has(lang)) return "easy";
  if (HardLanguages.has(lang)) return "hard";
  if (MediumLanguages.has(lang)) return "medium";
  return "medium"; // fallback
}


function startGame(phraseData, geoData, langData) {
  phrases = phraseData;
  countryLangMap = langData;

  // Debug: check for missing languages
  phrases.forEach(p => {
    if (!EasyLanguages.has(p.lang) && !HardLanguages.has(p.lang) && langDifficulty(p.lang) === "medium") {
      console.warn(`Language missing from explicit difficulty sets: ${p.lang}`);
    }
    if (!languageFamilyMap[p.lang]) {
      console.warn(`Language missing from family map: ${p.lang}`);
    }
  });

  initMap(geoData);
  applyMode('all'); // will call nextPhrase()

  // Hook up button events
  modeSelect.addEventListener('change', (e) => applyMode(e.target.value));
  nextBtn.onclick = nextPhrase;
  showAnswerBtn.onclick = showAnswer;
  skipBtn.onclick = nextPhrase;

  // Fix map sizing after load
  setTimeout(() => map.invalidateSize(), 100);
}


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
    }
  }).addTo(map);
}

function applyMode(mode) {
  let allowSet = null;

  if (mode === 'easy' || mode === 'medium' || mode === 'hard') {
    workingPhrases = phrases.filter(p => langDifficulty(p.lang) === mode);
    allowSet = null; // no region limit if just difficulty
  }
  else if (mode === 'europe') allowSet = Regions.Europe;
  else if (mode === 'asia') allowSet = Regions.Asia;
  else if (mode === 'geoguessr') allowSet = GeoGuessrISO3;
  else {
    workingPhrases = phrases.slice(); // all
  }

  // If it's a region mode
  if (allowSet) {
    workingPhrases = phrases.filter(p => p.iso.some(iso => allowSet.has(iso)));
  }

  // Style and bind clicks
  countriesLayer.eachLayer(layer => {
    const iso = iso2to3[layer.feature.id] || layer.feature.id;
    const allowed = !allowSet || allowSet.has(iso);
    layer.setStyle({
      fillOpacity: allowed ? 0.7 : 0.15,
      color: allowed ? '#444' : '#bbb'
    });
    layer.off('click');
    if (allowed) {
      layer.on('click', () => handleGuess(layer.feature, layer));
    }
  });

  nextPhrase();
}

function nextPhrase() {
  // If applyMode hasn’t run yet, fall back to all phrases
  if (!workingPhrases.length) workingPhrases = phrases.slice();

  // Reset map styles to neutral (but maintain dimming from applyMode)
  countriesLayer.eachLayer(layer => {
    const cur = layer.options.fillOpacity ?? 0.7;
    const isDimmed = cur < 0.7;
    layer.setStyle({ fillColor: "#ccc", fillOpacity: isDimmed ? 0.15 : 0.7 });
  });

  // Pick random phrase
  if (!workingPhrases.length) {
    questionEl.textContent = "No phrases for this mode.";
    feedbackEl.textContent = '';
    nextBtn.hidden = true;
    document.getElementById('show-family').hidden = true;
    document.getElementById('show-answer').hidden = true;
    document.getElementById('skip').hidden = true;
    return;
  }

  current = workingPhrases[Math.floor(Math.random() * workingPhrases.length)];
  questionEl.textContent = current.text;
  feedbackEl.textContent = '';

  // Buttons: before guess
  nextBtn.hidden = true;
  document.getElementById('show-family').hidden = true;
  document.getElementById('show-answer').hidden = false;
  document.getElementById('skip').hidden = false;
  familyShown = false;
}



function handleGuess(feature, layer) {
  const iso2 = feature.id;
  const iso = iso2to3[iso2] || iso2;
  const name = feature.properties.name;
  const isRight = current.iso.includes(iso);

  const languages = countryLangMap[iso] || [];
  const langText = languages.length ? languages.join(', ') : 'Unknown';

  if (isRight) {
    layer.setStyle({ fillColor: "green" });
    feedbackEl.innerHTML = `
      <div style="border: 2px solid green; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
        <strong>✅ Correct!</strong><br>
        <b>${name}</b><br>
        Languages: ${langText}
      </div>
    `;
  } else {
    layer.setStyle({ fillColor: "red" });

    const correctNames = [];
    countriesLayer.eachLayer(l => {
      const correctIso = iso2to3[l.feature.id] || l.feature.id;
      if (current.iso.includes(correctIso)) {
        l.setStyle({ fillColor: "green" });
        correctNames.push(l.feature.properties.name);
      }
    });

    feedbackEl.innerHTML = `
      <div style="border: 2px solid red; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
        <strong>❌ Your Guess:</strong> <b>${name}</b><br>
        <i>Language(s) spoken:</i> ${langText}
      </div>
    
      <div style="border: 2px solid green; padding: 10px; border-radius: 5px;">
        <strong>✅ Correct Answer:</strong><br>
        Correct language: <b>${current.lang}</b><br>
        Spoken in: ${correctNames.join(', ')}
      </div>
    `;
  }

  document.getElementById('show-family').hidden = false;
  nextBtn.hidden = false;
  document.getElementById('show-answer').hidden = true;
  document.getElementById('skip').hidden = true;
}

function showAnswer() {
  const correctNames = [];
  countriesLayer.eachLayer(layer => {
    const iso = iso2to3[layer.feature.id] || layer.feature.id;
    if (current.iso.includes(iso)) {
      layer.setStyle({ fillColor: "green" });
      correctNames.push(layer.feature.properties.name);
    } else {
      // keep dimming state consistent
      const cur = layer.options.fillOpacity ?? 0.7;
      const isDimmed = cur < 0.7;
      layer.setStyle({ fillColor: "#ccc", fillOpacity: isDimmed ? 0.15 : 0.7 });
    }
  });

  const allLangs = [...new Set(
    current.iso.flatMap(iso => countryLangMap[iso] || [])
  )];
  const langText = allLangs.length ? allLangs.join(', ') : 'Unknown';

  feedbackEl.innerHTML = `
    <div style="border: 2px solid green; padding: 10px; border-radius: 5px;">
      <strong>✅ Correct Answer:</strong><br>
      Correct language: <b>${current.lang}</b><br>
      Spoken in: ${correctNames.join(', ')}<br>
      <i>Language(s):</i> ${langText}
    </div>
  `;

  document.getElementById('show-family').hidden = false;
  nextBtn.hidden = false;
  document.getElementById('show-answer').hidden = true;
  document.getElementById('skip').hidden = true;
}
