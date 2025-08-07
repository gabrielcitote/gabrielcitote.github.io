let map;
let countriesLayer;
let phrases = [];
let current = null;
let countryLangMap = {}; // ALPHA-3 ISO → Languages
let familyShown = false;

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

  "French": "Romance",
  "Spanish": "Romance",
  "Portuguese": "Romance",
  "Italian": "Romance",
  "Romanian": "Romance",
  "Catalan": "Romance",
  "Galician": "Romance",
  "Occitan": "Romance",

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

  "Finnish": "Uralic",
  "Estonian": "Uralic",
  "Hungarian": "Uralic",

  "Mandarin": "Sino-Tibetan",
  "Cantonese": "Sino-Tibetan",
  "Wu": "Sino-Tibetan",
  "Hakka": "Sino-Tibetan",
  "Min Nan": "Sino-Tibetan",
  "Tibetan": "Sino-Tibetan",
  "Burmese": "Sino-Tibetan",

  "Hindi": "Indo-Aryan",
  "Urdu": "Indo-Aryan",
  "Bengali": "Indo-Aryan",
  "Punjabi": "Indo-Aryan",
  "Marathi": "Indo-Aryan",
  "Gujarati": "Indo-Aryan",
  "Sindhi": "Indo-Aryan",
  "Sinhala": "Indo-Aryan",
  "Nepali": "Indo-Aryan",

  "Tamil": "Dravidian",
  "Telugu": "Dravidian",
  "Kannada": "Dravidian",
  "Malayalam": "Dravidian",

  "Turkish": "Turkic",
  "Kazakh": "Turkic",
  "Uzbek": "Turkic",
  "Kyrgyz": "Turkic",
  "Tatar": "Turkic",
  "Azerbaijani": "Turkic",
  "Uyghur": "Turkic",
  "Turkmen": "Turkic",

  "Arabic": "Semitic",
  "Hebrew": "Semitic",
  "Amharic": "Semitic",
  "Tigrinya": "Semitic",
  "Maltese": "Semitic",

  "Japanese": "Japonic",
  "Korean": "Koreanic",

  "Vietnamese": "Austroasiatic",
  "Khmer": "Austroasiatic",

  "Tagalog": "Austronesian",
  "Malagasy": "Austronesian",
  "Malay": "Austronesian",
  "Indonesian": "Austronesian",
  "Javanese": "Austronesian",
  "Cebuano": "Austronesian",

  "Swahili": "Niger-Congo",
  "Yoruba": "Niger-Congo",
  "Igbo": "Niger-Congo",
  "Zulu": "Niger-Congo",
  "Shona": "Niger-Congo",
  "Xhosa": "Niger-Congo",
  "Lingala": "Niger-Congo",
  "Kinyarwanda": "Niger-Congo",
  "Kirundi": "Niger-Congo",

  "Somali": "Afroasiatic",
  "Hausa": "Afroasiatic",
  "Berber": "Afroasiatic",

  "Basque": "Language Isolate",
  "Esperanto": "Constructed"
}

const feedbackEl = document.getElementById('feedback');
const questionEl = document.getElementById('question');
const nextBtn    = document.getElementById('next');

function startGame(phraseData, geoData, langData) {
  phrases = phraseData;
  countryLangMap = langData;
  initMap(geoData);
  nextPhrase();
  nextBtn.onclick = nextPhrase;

  setTimeout(() => {
    map.invalidateSize(); // fixes map render issues
  }, 100);
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
      layer.on('click', () => handleGuess(feature, layer));
    }
  }).addTo(map);
}

function nextPhrase() {
  countriesLayer.eachLayer(layer => {
    layer.setStyle({ fillColor: "#ccc", fillOpacity: 0.7 });
  });

  current = phrases[Math.floor(Math.random() * phrases.length)];
  questionEl.textContent = current.text;
  feedbackEl.textContent = '';
  nextBtn.hidden = true;
  familyShown = false;  // Reset here
  document.getElementById('show-family').hidden = true;
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
}

document.addEventListener('DOMContentLoaded', () => {
  // Hide main game UI
  document.querySelector('header').style.display = 'none';
  document.querySelector('main').style.display = 'none';
  document.querySelector('footer').style.display = 'none';

  // Show game on button click
  document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    document.querySelector('header').style.display = 'block';
    document.querySelector('main').style.display = 'block';
    document.querySelector('footer').style.display = 'block';

    // Load data and start game
    Promise.all([
      fetch('data/phrases.json').then(r => r.json()),
      fetch('data/countries.geo.json').then(r => r.json()),
      fetch('data/countries-languages.json').then(r => r.json())
    ]).then(([phraseData, geoData, langData]) => {
      startGame(phraseData, geoData, langData);
    });
  });
});

document.getElementById('show-family').addEventListener('click', () => {
  if (familyShown) return;  // Prevent duplicates
  familyShown = true;

  const currentLang = current.lang;
  const currentFamily = languageFamilyMap[currentLang];

  if (!currentFamily) {
    feedbackEl.innerHTML += `
      <div style="border: 2px solid orange; padding: 10px; margin-top: 10px; border-radius: 5px;">
        ⚠️ No family info for <b>${currentLang}</b>.
      </div>
    `;
    return;
  }

  const matchingISOs = Object.entries(countryLangMap)
    .filter(([iso, langs]) =>
      langs.some(lang => languageFamilyMap[lang] === currentFamily)
    )
    .map(([iso]) => iso);

  countriesLayer.eachLayer(layer => {
    const iso = iso2to3[layer.feature.id] || layer.feature.id;
    if (matchingISOs.includes(iso)) {
      layer.setStyle({ fillColor: 'gold' });
    }
  });

  const members = Object.entries(languageFamilyMap)
    .filter(([_, fam]) => fam === currentFamily)
    .map(([lang]) => lang)
    .sort()
    .join(', ');

  feedbackEl.innerHTML += `
    <div style="border: 2px dashed orange; padding: 10px; margin-top: 10px; border-radius: 5px;">
      🌐 <strong>Language Family:</strong> <br>
      <b>${currentFamily}</b><br>
      Family Members: ${members}
    </div>
  `;
});
