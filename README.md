# AirIQ India 🌬️
### AI-Powered Urban Air Quality Intelligence Platform

## 🔴 Live Demo
👉 https://github-rama12.github.io/airiq-india/

---

## Features

| Module | What it does |
|---|---|
| **Live Map** | Ward-level AQI heatmap (Delhi 8 wards × 24h), CAAQMS station feed, real-time met data |
| **Source AI** | Claude-powered pollution source attribution with confidence scores |
| **Forecast** | 72-hour hyperlocal AQI forecast with interactive dispersion model sliders |
| **Enforcement** | Priority-ranked enforcement targets with AI-generated evidence briefs |
| **Multi-City** | AQI comparison across Delhi, Mumbai, Kolkata, Bengaluru, Chennai, Pune |
| **Citizen Alerts** | Multilingual health advisories (Hindi, Tamil, Kannada, Bengali, Marathi) |

---

## How to use the live app

1. Open the live link above
2. A popup appears asking for your **Anthropic API key**
3. Get a free key at [console.anthropic.com](https://console.anthropic.com) → API Keys → Create Key
4. Paste the key → click **Save**
5. All 6 AI modules are now live ✅

> 🔒 Your API key is stored in **browser memory only** — never saved to GitHub or any server

---

## Tech Stack

- Vanilla HTML / CSS / JavaScript (no framework, no build step)
- Chart.js 4.4 — source attribution doughnut + city comparison bar chart
- Tabler Icons — icon webfont
- Anthropic Claude API — AI intelligence layer

---

## Architecture

```
Browser
├── index.html        — shell, tabs, panel markup
├── src/
│   ├── style.css     — design system (light/dark, responsive)
│   ├── config.js     — model config (no API key stored)
│   ├── key-popup.js  — secure browser-only key input popup
│   └── app.js        — data builders, charts, Claude API calls
         │
         └──► Anthropic /v1/messages
                  (Attribution · Forecast · Enforcement · City compare · Advisory)
```

---

## Judging Criteria

| Criterion | Weight | How we address it |
|---|---|---|
| Innovation | 25% | First platform combining source attribution AI + enforcement intelligence + multilingual advisories |
| Business Impact | 25% | Reduces signal-to-intervention time 10×; serves city admins, pollution boards, citizens |
| Technical Excellence | 20% | Dispersion model, RMSE tracking, confidence-scored attribution, Claude API |
| Scalability | 15% | Stateless SPA; any city added by updating data constants |
| User Experience | 15% | Dark/light mode, mobile-responsive, real-time AQI ticker |

---

## Team
- Ram — Full Stack & AI Integration

Built for Smart Cities Hackathon 2025

---

## License
MIT — free to use, modify, and deploy.
