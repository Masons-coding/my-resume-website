# Mason Clarke — Interactive Resume

Live: https://masons-resume-website.netlify.app

A React portfolio with no UI libraries: hand-built components and SCSS.

## Features

- **Particle-network hero** with typewriter roles, animated stat counters and a live Ottawa clock
- **Command palette** — press `Ctrl/⌘ + K` to jump anywhere or open links
- **Interactive terminal** — try `help`, `neofetch`, `weather Tokyo` or `sudo hire-mason`
- **Experience timeline**, filterable **skills** and 3D-tilt **project cards** with detail modals
- **Hosted Python app** at [`/weather/`](https://masons-resume-website.netlify.app/weather/) (see below)
- **Five live websites** (ad-supported, responsive 320-3000px), each its own GitHub repo with automated tests and hosted under this site:
  [AI Pulse](/ai-pulse/) (AI news) ·
  [Daily Brief](/daily-brief/) (news, weather, history) ·
  [DailyCalc](/daily-calc/) (everyday calculators) ·
  [DevPocket](/dev-pocket/) (developer tools) ·
  [EcoSteps](/eco-steps/) (eco tools & guides)
- Easter eggs: the Konami code (↑↑↓↓←→←→BA) and a clickable hackathon trophy 🎉
- Respects `prefers-reduced-motion`; keyboard accessible

## The Python weather app (`public/weather/`)

My original [Python/Tkinter weather app](https://github.com/Masons-coding/WeatherAPI-APP), ported to the web.
The real Python (`weather_app.py`) runs **in the visitor's browser** on [Pyodide](https://pyodide.org) (CPython compiled to WebAssembly):

- **Free**: static files only, no server or serverless functions to pay for
- **Safe**: no API keys; weather comes from the keyless [Open-Meteo](https://open-meteo.com) API, and the page ships a strict Content-Security-Policy that only allows this site, the Pyodide CDN and Open-Meteo

## Editing content

All resume content lives in [`src/data/resume.js`](src/data/resume.js); edit it there and the whole site updates.

## Scripts

```bash
npm start       # dev server on http://localhost:3000
npm run build   # production build into /build (what Netlify deploys)
```

Netlify settings are in [`netlify.toml`](netlify.toml): build command, publish dir and security headers.
