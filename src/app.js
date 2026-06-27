/* AirIQ India — main application logic */

/* ── Data constants ──────────────────────────────────── */
const WARDS = [
  "Anand Vihar", "Rohini Sec-5", "Okhla Ph-II", "Sadar Bazaar",
  "Dwarka Sec-10", "Lodhi Road", "Wazirpur", "Shahdara",
];
const HOURS = ["00", "03", "06", "09", "12", "15", "18", "21"];

/* ── AQI colour helper ───────────────────────────────── */
function aqiColor(v) {
  if (v < 50)  return "#639922";
  if (v < 100) return "#EF9F27";
  if (v < 150) return "#D85A30";
  if (v < 200) return "#A32D2D";
  return "#7F1414";
}

/* ── Tab navigation ──────────────────────────────────── */
function showTab(i) {
  document.querySelectorAll(".panel").forEach((p, j) => {
    p.className = "panel" + (i === j ? " active" : "");
  });
  document.querySelectorAll(".tab").forEach((t, j) => {
    t.className = "tab" + (i === j ? " active" : "");
  });
}

/* ── Heatmap ─────────────────────────────────────────── */
function buildHeatmap() {
  const tl = document.getElementById("timelabels");
  HOURS.forEach((h) => {
    const s = document.createElement("span");
    s.className = "timelabel";
    s.textContent = h + "h";
    tl.appendChild(s);
  });

  const hm = document.getElementById("heatmap");
  WARDS.forEach((w) => {
    const row = document.createElement("div");
    row.className = "heatrow";

    const lbl = document.createElement("span");
    lbl.className = "wardlabel";
    lbl.textContent = w;
    row.appendChild(lbl);

    HOURS.forEach(() => {
      const v = Math.round(60 + Math.random() * 220);
      const cell = document.createElement("div");
      cell.className = "heatcell";
      cell.style.background = aqiColor(v);
      cell.textContent = v;
      cell.title = w + ": AQI " + v;
      row.appendChild(cell);
    });
    hm.appendChild(row);
  });
}

/* ── CAAQMS station feed ─────────────────────────────── */
function buildStationFeed() {
  const el = document.getElementById("station-feed");
  const stations = [
    { name: "Anand Vihar",  aqi: 287, status: "Severe"    },
    { name: "Rohini Sec-5", aqi: 168, status: "Poor"       },
    { name: "Lodhi Road",   aqi:  98, status: "Moderate"   },
    { name: "IGI Airport",  aqi: 134, status: "Poor"       },
    { name: "Punjabi Bagh", aqi: 201, status: "Very Poor"  },
  ];
  stations.forEach((s) => {
    const row = document.createElement("div");
    row.style.cssText =
      "display:flex;align-items:center;gap:8px;padding:6px 0;" +
      "border-bottom:0.5px solid var(--border);font-size:12px";

    const dot = document.createElement("span");
    dot.className = "live-dot pulse";
    if (s.aqi > 200)      dot.classList.add("red");
    else if (s.aqi > 100) dot.classList.replace("live-dot", "live-dot");

    const name = document.createElement("span");
    name.style.cssText = "flex:1;color:var(--text)";
    name.textContent = s.name;

    const aqi = document.createElement("span");
    aqi.style.cssText = "font-weight:500;color:" + aqiColor(s.aqi);
    aqi.textContent = s.aqi;

    const badge = document.createElement("span");
    badge.className =
      "badge " + (s.aqi > 200 ? "badge-red" : s.aqi > 100 ? "badge-amber" : "badge-green");
    badge.textContent = s.status;

    row.appendChild(dot);
    row.appendChild(name);
    row.appendChild(aqi);
    row.appendChild(badge);
    el.appendChild(row);
  });
}

/* ── Forecast bars ───────────────────────────────────── */
function buildForecastBars() {
  const el = document.getElementById("forecast-bars");
  el.innerHTML = "";

  const base  = 218;
  const wind  = parseInt(document.getElementById("wind-s").value);
  const temp  = parseInt(document.getElementById("temp-s").value);
  const hum   = parseInt(document.getElementById("hum-s").value);
  const traf  = parseInt(document.getElementById("traf-s").value);
  const hours = ["Now", "6h", "12h", "18h", "24h", "36h", "48h", "72h"];
  const factor = 1 - wind * 0.02 + hum * 0.002 + traf * 0.015 - (temp > 30 ? 0.05 : 0);

  hours.forEach((h, i) => {
    const v   = Math.round(base * factor * (1 + i * 0.01 * Math.sin(i) + Math.random() * 0.08 - 0.04));
    const pct = Math.min(100, (v / 300) * 100);

    const row   = document.createElement("div");
    row.className = "forecast-bar";

    const lbl   = document.createElement("span");
    lbl.className = "fclabel";
    lbl.textContent = h;

    const val   = document.createElement("span");
    val.className = "fcval";
    val.style.color = aqiColor(v);
    val.textContent = v;

    const track = document.createElement("div");
    track.className = "fctrack";

    const fill  = document.createElement("div");
    fill.className = "fcfill";
    fill.style.cssText = "width:" + pct + "%;background:" + aqiColor(v);

    const badge = document.createElement("span");
    badge.className =
      "badge " + (v > 200 ? "badge-red" : v > 150 ? "badge-amber" : "badge-green");
    badge.textContent = v > 200 ? "Severe" : v > 150 ? "Poor" : "Moderate";

    track.appendChild(fill);
    row.appendChild(lbl);
    row.appendChild(val);
    row.appendChild(track);
    row.appendChild(badge);
    el.appendChild(row);
  });
}

function updateForecast() {
  ["wind", "temp", "hum", "traf"].forEach((k) => {
    document.getElementById(k + "-v").textContent =
      document.getElementById(k + "-s").value;
  });
  buildForecastBars();
}

/* ── Enforcement list ────────────────────────────────── */
function buildEnfList() {
  const el    = document.getElementById("enf-list");
  const items = [
    { name: "Okhla Industrial Area",    type: "Industrial cluster",      score: 94, icon: "ti-factory", bg: "#FCEBEB", ic: "#A32D2D", badge: "badge-red",   label: "Critical" },
    { name: "Wazirpur Cluster",         type: "Iron & steel foundries",  score: 87, icon: "ti-flame",   bg: "#FAEEDA", ic: "#854F0B", badge: "badge-amber", label: "High"     },
    { name: "Anand Vihar Bus Depot",    type: "Diesel fleet + idling",   score: 81, icon: "ti-bus",     bg: "#FAEEDA", ic: "#854F0B", badge: "badge-amber", label: "High"     },
    { name: "Bhatti Mines",             type: "Construction dust",        score: 74, icon: "ti-crane",   bg: "#E6F1FB", ic: "#185FA5", badge: "badge-blue",  label: "Medium"   },
    { name: "Shahdara Waste Site",      type: "Open burning",            score: 68, icon: "ti-trash",   bg: "#E6F1FB", ic: "#185FA5", badge: "badge-blue",  label: "Medium"   },
  ];
  items.forEach((it) => {
    const row = document.createElement("div");
    row.className = "enf-row";
    row.innerHTML = `
      <div class="enf-icon" style="background:${it.bg}">
        <i class="ti ${it.icon}" style="color:${it.ic}" aria-hidden="true"></i>
      </div>
      <div class="enf-body">
        <div class="enf-title">${it.name}</div>
        <div class="enf-sub">${it.type} &middot; Priority score: <strong>${it.score}/100</strong></div>
      </div>
      <span class="badge ${it.badge}">${it.label}</span>
    `;
    el.appendChild(row);
  });
}

/* ── City comparison ─────────────────────────────────── */
function buildCityRows() {
  const el     = document.getElementById("city-rows");
  const cities = [
    { name: "Delhi",      aqi: 218, change: -8,  int: "Odd-even, GRAP-IV"  },
    { name: "Mumbai",     aqi: 142, change: -14, int: "Construction ban"    },
    { name: "Kolkata",    aqi: 168, change: -5,  int: "EV bus rollout"      },
    { name: "Bengaluru",  aqi:  88, change: -22, int: "Green corridor"      },
    { name: "Chennai",    aqi:  95, change: -18, int: "Industrial limits"   },
    { name: "Pune",       aqi: 112, change: -11, int: "Open burning ban"    },
  ];
  cities.forEach((c) => {
    const row = document.createElement("div");
    row.className = "city-row";
    row.innerHTML = `
      <span class="city-name">${c.name}</span>
      <span class="city-aqi" style="color:${aqiColor(c.aqi)}">${c.aqi}</span>
      <div class="city-bar" style="background:${aqiColor(c.aqi)}"></div>
      <span class="city-trend">
        <i class="ti ti-trending-down" aria-hidden="true"></i>${Math.abs(c.change)}%
      </span>
      <span class="city-int" style="flex:1;text-align:right">${c.int}</span>
    `;
    el.appendChild(row);
  });
}

/* ── Vulnerability panel ─────────────────────────────── */
function buildVulnerability() {
  const el   = document.getElementById("vuln-grid");
  const cats = [
    { label: "Hospitals",       count: 47,    icon: "ti-building-hospital" },
    { label: "Schools",         count: 183,   icon: "ti-school"            },
    { label: "Parks",           count: 92,    icon: "ti-trees"             },
    { label: "Outdoor workers", count: "12K", icon: "ti-helmet"            },
  ];
  cats.forEach((c) => {
    const div = document.createElement("div");
    div.className = "mcard";
    div.innerHTML = `
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
        <i class="ti ${c.icon}" style="font-size:16px" aria-hidden="true"></i>
        <span class="mlabel" style="margin-bottom:0">${c.label}</span>
      </div>
      <div class="mval" style="font-size:18px">${c.count}</div>
    `;
    el.appendChild(div);
  });

  const hb    = document.getElementById("health-bars");
  const wards = [
    { w: "Anand Vihar",  risk: 92 },
    { w: "Wazirpur",     risk: 78 },
    { w: "Okhla Ph-II",  risk: 71 },
    { w: "Rohini Sec-5", risk: 55 },
    { w: "Lodhi Road",   risk: 32 },
  ];
  wards.forEach((x) => {
    const row = document.createElement("div");
    row.className = "forecast-bar";
    row.innerHTML = `
      <span class="fclabel" style="font-size:11px">${x.w}</span>
      <span class="fcval" style="color:${aqiColor(x.risk * 2.5)}">${x.risk}</span>
      <div class="fctrack">
        <div class="fcfill" style="width:${x.risk}%;background:${aqiColor(x.risk * 2.5)}"></div>
      </div>
    `;
    hb.appendChild(row);
  });
}

/* ── Existing alert samples ──────────────────────────── */
function buildExistingAlerts() {
  const el     = document.getElementById("existing-alerts");
  const alerts = [
    {
      lang: "हिन्दी",
      msg:  "आज दिल्ली में वायु गुणवत्ता बहुत खराब है (AQI 287)। बाहर निकलने से बचें। मास्क अनिवार्य है।",
      cat:  "badge-red",
    },
    {
      lang: "தமிழ்",
      msg:  "சென்னையில் இன்று காற்றின் தரம் நடுத்தரமாக உள்ளது (AQI 95). முதியவர்கள் வெளியில் செல்வதை தவிர்க்கவும்.",
      cat:  "badge-amber",
    },
  ];
  alerts.forEach((a) => {
    const div = document.createElement("div");
    div.className = "cit-card";
    div.innerHTML = `
      <div class="cit-lang"><span class="badge ${a.cat}" style="margin-right:6px">${a.lang}</span></div>
      <div class="cit-msg">${a.msg}</div>
    `;
    el.appendChild(div);
  });
}

/* ── Charts ──────────────────────────────────────────── */
function initSourceChart() {
  new Chart(document.getElementById("sourceChart"), {
    type: "doughnut",
    data: {
      labels: ["Vehicles", "Construction", "Industrial", "Crop burning", "Other"],
      datasets: [{
        data: [38, 27, 18, 10, 7],
        backgroundColor: ["#3266ad", "#E24B4A", "#EF9F27", "#63993a", "#888780"],
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
    },
  });
}

function initCityChart() {
  new Chart(document.getElementById("cityChart"), {
    type: "bar",
    data: {
      labels: ["Delhi", "Mumbai", "Kolkata", "Bengaluru", "Chennai", "Pune"],
      datasets: [{
        label: "Annual avg AQI 2024-25",
        data: [218, 142, 168, 88, 95, 112],
        backgroundColor: ["#A32D2D", "#EF9F27", "#D85A30", "#639922", "#639922", "#EF9F27"],
        borderRadius: 4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: "rgba(128,128,128,0.1)" }, ticks: { color: "#888" } },
        x: { grid: { display: false }, ticks: { color: "#888" } },
      },
    },
  });
}

/* ── Anthropic API calls ─────────────────────────────── */
async function callClaude(prompt, targetId) {
  const el = document.getElementById(targetId);

  // Check key is set — if not, open popup and stop
  if (!CONFIG.ANTHROPIC_API_KEY || CONFIG.ANTHROPIC_API_KEY.trim() === "") {
    el.innerHTML = '<span class="thinking">⚠️ No API key entered. Click "Add API Key" in the top-right to add your key.</span>';
    KeyManager.show();
    return;
  }

  el.innerHTML = '<span class="thinking">Generating AI analysis…</span>';

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CONFIG.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: CONFIG.MODEL,
        max_tokens: CONFIG.MAX_TOKENS,
        system:
          "You are an expert air quality analyst for Indian cities. " +
          "Provide concise, actionable intelligence in 3–5 sentences. " +
          "Include specific numbers, confidence scores where relevant, " +
          "and practical recommendations for city administrators. " +
          "Be direct and data-driven.",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const d = await res.json();
    if (d.error) throw new Error(d.error.message);
    el.textContent = d.content.map((c) => c.text || "").join(" ");
  } catch (err) {
    el.innerHTML =
      '<span class="thinking">⚠️ Could not reach the AI. Error: ' + err.message +
      '. Click "Add API Key" (top right) to re-enter your key.</span>';
    KeyManager.show();
  }
}

function runAttribution() {
  const ward = document.getElementById("ward-select").value;
  const time = document.getElementById("time-select").value;
  callClaude(
    `Analyse pollution source attribution for ${ward} ward in Delhi over ${time}. ` +
    `Current AQI: ~${Math.round(180 + Math.random() * 100)}. ` +
    `Nearby sources: diesel vehicles, construction activity, industrial units. ` +
    `Provide attribution percentages by source category with confidence scores.`,
    "attr-result"
  );
}

function runForecast() {
  const wind = document.getElementById("wind-s").value;
  const temp = document.getElementById("temp-s").value;
  const hum  = document.getElementById("hum-s").value;
  const traf = document.getElementById("traf-s").value;
  callClaude(
    `Generate a 72-hour AQI forecast narrative for Anand Vihar, Delhi. ` +
    `Current conditions: wind ${wind} km/h, temperature ${temp}°C, humidity ${hum}%, traffic factor ${traf}/10. ` +
    `Current AQI: 218. Recommend specific intervention scheduling windows for city administrators.`,
    "forecast-result"
  );
}

function runEnforcement() {
  const site = document.getElementById("enf-select").value;
  callClaude(
    `Generate a prioritised enforcement action brief for ${site} in Delhi. ` +
    `Include: evidence summary, recommended inspection approach, estimated AQI impact if compliance achieved, ` +
    `legal provisions applicable under the Environment Protection Act, and required documentation.`,
    "enf-result"
  );
}

function runCityAnalysis() {
  callClaude(
    `Compare pollution control interventions across Delhi (AQI 218, -8%), Mumbai (142, -14%), ` +
    `Kolkata (168, -5%), Bengaluru (88, -22%), Chennai (95, -18%), Pune (112, -11%). ` +
    `Which interventions showed the highest AQI reduction? What can Delhi learn from Bengaluru's success? ` +
    `Provide specific, transferable recommendations.`,
    "city-result"
  );
}

function runCitizenAlert() {
  const lang = document.getElementById("lang-select").value;
  const vuln = document.getElementById("vuln-select").value;
  callClaude(
    `Generate a health advisory in ${lang} language for ${vuln} in an area with AQI 218 (Severe). ` +
    `Include: health risks specific to this group, protective measures, when to seek medical help, ` +
    `and duration of advisory. Keep it simple, compassionate, and actionable. ` +
    `Write the ${lang} text directly.`,
    "citizen-result"
  );
}

/* ── Live metric ticker ──────────────────────────────── */
function startTicker() {
  setInterval(() => {
    const aqi = Math.round(200 + Math.random() * 30);
    const pm  = Math.round(130 + Math.random() * 20);
    document.getElementById("m-aqi").innerHTML =
      aqi + ' <span class="munit">µg/m³</span>';
    document.getElementById("m-pm").innerHTML =
      pm  + ' <span class="munit">µg/m³</span>';
  }, 3000);
}

/* ── Bootstrap ───────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  KeyManager.init();
  buildHeatmap();
  buildStationFeed();
  buildForecastBars();
  buildEnfList();
  buildCityRows();
  buildVulnerability();
  buildExistingAlerts();
  setTimeout(() => {
    initSourceChart();
    initCityChart();
  }, 100);
  startTicker();
});
