# Mason's five websites

| Site | What it is | Folder |
|---|---|---|
| **AI Pulse** | Live AI news + guides + glossary | `src/ai-pulse` |
| **Daily Brief** | Headlines, 7-day weather, this day in history | `src/daily-brief` |
| **DailyCalc** | 10 everyday calculators + guides | `src/daily-calc` |
| **DevPocket** | 12 developer tools + HTTP status reference | `src/dev-pocket` |
| **EcoSteps** | Footprint & energy calculators, recycling guide, swap checklist, cleanup planner | `src/eco-steps` |

Plain HTML/CSS/JS (no framework), built by `node build.js` into `dist/<site>/`. Responsive from 320px to 3000px+, dark mode, keyboard friendly,
no tracking. Ads are **off** until you add your AdSense id, and even then nothing loads until the visitor presses "Accept ads".

## Commands (PowerShell, inside `D:\zoo-hq\sites`)
```
node build.js                      build all five into dist\
npm test                           build + unit tests + browser tests + responsive checks (needs: npm i -D playwright)
node tools\fetch-news.js           refresh the headline files (AI Pulse, Daily Brief)
node tools\publish.js              dry run
node tools\publish.js --yes        create GitHub repos, upload, turn on GitHub Pages   (needs GITHUB_TOKEN)
```

## 1. Put them on GitHub (free hosting)
1. GitHub > Settings > Developer settings > Personal access tokens > **Fine-grained token**, owner `Masons-coding`, all repositories, permissions:
   Administration (read/write, to create repos), Contents (read/write), Pages (read/write). Copy it.
2. Add one line to `D:\zoo-hq\.env`:  `GITHUB_TOKEN=github_pat_...`  (never share it; the bots never print it)
3. `node tools\publish.js --yes`. Each site goes live at `https://masons-coding.github.io/<site>/` within a few minutes.
4. The same sites are also inside your portfolio (branch `claude/live-sites-portfolio`, folders `public/<site>/`). Merge that branch on GitHub and Netlify publishes them at `masons-resume-website.netlify.app/<site>/`.

## 2. Earn ad revenue (honest version)
* **Cost:** hosting is $0. AdSense is free. A domain is optional but **required in practice**: Google generally does not approve sites on someone else's
  free subdomain (like `github.io`). Cheapest plan: buy **one** domain (about $12-20/year) and use five sub-domains
  (`ai.yourdomain.com`, `brief.`, `calc.`, `dev.`, `eco.`), which AdSense accepts.
* **Approval:** apply at adsense.google.com once each site has a domain. Google wants original useful content (these have guides, FAQs, privacy policy, about, contact),
  and real visitors. Approval can take days to weeks. Sites without enough content/traffic get a "low value content" notice - keep adding guides.
* **After approval:** put your publisher id in `config.json` (`"adsenseClient": "ca-pub-XXXXXXXXXXXXXXXX"`) and create 3 ad units (top / mid / bottom) for the slot ids.
  Rebuild (`node build.js`), publish again. `ads.txt` is generated automatically - it must be at the root of the domain.
* **Expect:** earnings come from page views. Typical RPM is roughly $1-$10 per 1,000 views, so 100 visitors a day is a few dollars a month; it grows with
  traffic, search ranking (SEO takes months), and more good content. There are no shortcuts: do not click your own ads or buy fake traffic (Google bans accounts for it).
* **Search:** add each site to Google Search Console and submit `sitemap.xml` (already generated).
* Hand the legal pages (privacy, terms) to someone qualified before serious traffic; they are written honestly but are not legal advice.

## 3. Email notices
Bots email `maclarkegdci@gmail.com` when important tasks finish (Postmaster Pigeon bot, `lib\mailer.js`). To switch it on, add to `D:\zoo-hq\.env`:
```
SMTP_USER=youraddress@gmail.com
SMTP_PASS=<Gmail app password - Google Account > Security > 2-Step Verification > App passwords>
```
Test: `node scripts\mail-test.js`. It can only ever send to your allow-listed address, max 20 a day. Until set up, mails wait in `D:\ZooHQ\outbox`.

## 4. Keeping the news fresh
Newsroom Ned (bot) runs `tools\fetch-news.js` every 3 hours. It saves only headline + link + publisher (never article text). To also push fresh headlines to GitHub
automatically, create an empty file `sites\.auto-publish` (needs GITHUB_TOKEN). Delete the file to stop.
Feeds that are unreachable are skipped; the pages also load live headlines straight from Hacker News, Wikipedia and Hugging Face in each visitor's browser.

## Licence & attributions
Wikipedia text (CC BY-SA 4.0) and Open-Meteo data (CC BY 4.0) are attributed on the pages that use them. Headlines belong to their publishers and always link back.
