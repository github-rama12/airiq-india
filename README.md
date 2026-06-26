# AirIQ India 🌬️
### AI-Powered Urban Air Quality Intelligence Platform

A hackathon prototype addressing India's urban air quality crisis — built for the *Smart Cities / Environmental Intelligence* challenge.

---

## Features

| Module | What it does |
|---|---|
| **Live Map** | Ward-level AQI heatmap (Delhi 8 wards × 24h), CAAQMS station feed, real-time met data |
| **Source AI** | Claude-powered pollution source attribution with confidence scores (vehicle/construction/industrial/crop burning) |
| **Forecast** | 72-hour hyperlocal AQI forecast with interactive dispersion model sliders |
| **Enforcement** | Priority-ranked enforcement targets with AI-generated evidence briefs citing the Environment Protection Act |
| **Multi-City** | AQI comparison across Delhi, Mumbai, Kolkata, Bengaluru, Chennai, Pune with intervention effectiveness tracking |
| **Citizen Alerts** | Multilingual health advisories (Hindi, Tamil, Kannada, Bengali, Marathi) for vulnerable populations |

---

## Quick start

### 1. Clone the repo
```bash
https://github.com/github-rama12/airiq-india.git
```

### 2. Add your Anthropic API key
Open `src/config.js` and replace the placeholder:
```js
const CONFIG = {
  ANTHROPIC_API_KEY: "sk-ant-YOUR_KEY_HERE",   // ← paste here
  MODEL: "claude-sonnet-4-6",
  MAX_TOKENS: 1000,
};
```
Get a key at [console.anthropic.com](https://console.anthropic.com/).

### 3. Serve locally
No build step needed — it's plain HTML/CSS/JS.

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .

# VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

Open [http://localhost:8080](http://localhost:8080).

---

## Deploy to GitHub Pages (free hosting)

1. Push the repo to GitHub.
2. Go to **Settings → Pages → Source → Deploy from branch**.
3. Select `main` branch, `/ (root)` folder → **Save**.
4. Your app will be live at `https://YOUR_USERNAME.github.io/airiq-india/` in ~1 minute.

> ⚠️ **Security note:** Putting an API key in client-side JS exposes it to anyone who views source.
> This is fine for a hackathon demo. For production, proxy the Anthropic call through a backend (see below).

---

## Production-safe API key handling

Create a tiny backend proxy (Node/Express example):

```js
// proxy/server.js
const express = require("express");
const app = express();
app.use(express.json());
app.use(require("cors")());

app.post("/api/chat", async (req, res) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,   // env var, never in code
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(req.body),
  });
  res.json(await response.json());
});

app.listen(3001);
```

Then in `src/config.js` change the fetch URL to `http://localhost:3001/api/chat`.

---

## Tech stack

- Vanilla HTML / CSS / JavaScript (no framework, no build step)
- [Chart.js 4.4](https://www.chartjs.org/) — source attribution doughnut + city comparison bar chart
- [Tabler Icons](https://tabler-icons.io/) — icon webfont
- [Anthropic Claude API](https://docs.anthropic.com/) — AI intelligence layer
- Simulated real-time data (CAAQMS feed, heatmap) — replace with live CPCB API in production

---

## Data sources (production integration)

| Source | API / Dataset |
|---|---|
| CPCB CAAQMS live data | [cpcb.nic.in/real-time-data](https://cpcb.nic.in/real-time-data/) |
| Sentinel-2 satellite | [Copernicus Browser](https://browser.dataspace.copernicus.eu/) |
| IMD meteorological forecasts | [mausam.imd.gov.in](https://mausam.imd.gov.in/) |
| OpenAQ (historical) | [openaq.org/api](https://docs.openaq.org/) |
| OSM land use (ward boundaries) | [overpass-api.de](https://overpass-api.de/) |

---

## Architecture

```
Browser
├── index.html          — shell, tabs, panel markup
├── src/style.css       — design system (light/dark, responsive)
├── src/config.js       — API key + model config
└── src/app.js          — data builders, chart init, Claude API calls
         │
         └──► Anthropic /v1/messages
                  (Source attribution / Forecast / Enforcement / City compare / Citizen alert)
```

---

## Judging criteria alignment

| Criterion | How this addresses it |
|---|---|
| **Innovation (25%)** | Multi-modal AI attribution fusing sensor + satellite + land-use; multilingual regional advisories |
| **Business Impact (25%)** | Moves from reactive dashboards to proactive enforcement; directly reduces response time to signal |
| **Technical Excellence (20%)** | Live dispersion model, RMSE tracking, confidence-scored attribution |
| **Scalability (15%)** | Stateless single-page app; any city can be added by updating data constants |
| **User Experience (15%)** | Dark/light mode, mobile-responsive, tab-based navigation, real-time ticker |

---

## License
MIT — free to use, modify, and deploy.
