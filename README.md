# 辽宁留学服务有限公司 (Liaoning Overseas Study Service) — Local Website Clone

This directory contains a complete static local clone of `http://lnlxdemo.024cloud.com/`.

## Running Locally

Use the included Python 3 server (which sets explicit `UTF-8` headers on `.html`, `.css`, `.js`, and `.svg` files):

```bash
python3 serve.py
```

Or specify a custom port:

```bash
python3 serve.py 8080
```

Then open [http://127.0.0.1:8080/](http://127.0.0.1:8080/) in your browser.

You can also host this directory with any static web server (Nginx, Caddy, `npx serve`, or `python3 -m http.server 8080`).

## Structure

- `index.html` — Chinese homepage (`lang="zh-CN"`)
- `destinations.html` — All 16 study destinations overview
- `usa.html` & `country-*.html` — Dedicated guides for 16 countries/regions
- `news.html` — Filterable news, policies, admissions, and camp programs
- `about.html` — Company profile, qualifications, and contact details with one-click copy
- `archive.html` — Complete 242-article archive grouped by category
- `articles/` — Full article pages and media
- `en/` — English mirror (`en/index.html`, subpages, and bilingual articles with English/中文 tab switching)
- `style.css` & `main.js` — Pure CSS3 design system and vanilla JS interactions (zero build step)
- `assets/` — Icons, WebP visuals, and fallback images
- `serve.py` — Local Python 3 static web server with UTF-8 headers
