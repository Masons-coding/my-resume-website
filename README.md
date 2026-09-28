# Mason Clarke — Interactive Resume

Live: https://masons-resume-website.netlify.app

A React portfolio with no UI libraries: hand-built components and SCSS.

## Features

- **Particle-network hero** with typewriter roles, animated stat counters and a live Ottawa clock
- **Command palette** — press `Ctrl/⌘ + K` to jump anywhere or open links
- **Interactive terminal** — try `help`, `neofetch`, `weather Tokyo` or `sudo hire-mason`
- **Experience timeline**, filterable **skills** and 3D-tilt **project cards** with detail modals
- **Hosted Python app** at [`/weather/`](https://masons-resume-website.netlify.app/weather/) (see below)
- **Computer Science Lab**: seven live projects, one per core CS area, each its own repo with unit tests and CI:
  [Algorithm Visualizer](https://github.com/Masons-coding/algorithm-visualizer) ·
  [SQL Query Lab](https://github.com/Masons-coding/sql-query-lab) ·
  [OS Scheduler Simulator](https://github.com/Masons-coding/os-scheduler-sim) ·
  [Neural Net From Scratch](https://github.com/Masons-coding/neural-net-from-scratch) ·
  [Security Lab](https://github.com/Masons-coding/security-lab) ·
  [Maple Language](https://github.com/Masons-coding/mini-lang-interpreter) ·
  [Network Toolkit](https://github.com/Masons-coding/network-toolkit)
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
