let map;
let countriesLayer;
let phrases = [];
let current = null;
let countryLangMap = {}; // ALPHA-3 ISO → Languages

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
    layer.setStyle({ fillColor: "#ccc" });
  });

  current = phrases[Math.floor(Math.random() * phrases.length)];
  questionEl.textContent = current.text;
  feedbackEl.textContent = '';
  nextBtn.hidden = true;
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
        <strong>❌ Your Guess:</strong><br>
        That’s <b>${name}</b><br>
        <i>Languages detected:</i> ${langText}<br>
        <i>Your selected country:</i> ${name}
      </div>

      <div style="border: 2px solid green; padding: 10px; border-radius: 5px;">
        <strong>✅ Correct Answer:</strong><br>
        Correct language: <b>${current.lang}</b><br>
        Accepted countries: ${correctNames.join(', ')}
      </div>
    `;
  }

  nextBtn.hidden = false;
}
