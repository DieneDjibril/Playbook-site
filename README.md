# Advancing Partnerships Playbook

The Advancing Partnerships Playbook is a practical, Africa-focused knowledge hub for turning social-impact activity into deployable, investable, and repeatable partnership pathways.

## What is included

- **The Framework** — deployability, the translation gap, constraint-led diagnosis, and capital sequencing.
- **Partnership Models** — aggregation and warehouse platforms, project preparation and guarantees, and predictable delivery networks.
- **Case Studies** — Babban Gona, KCB Clean Cooking, local RUTF production, and Lake Turkana Wind Power.
- **Resources** — practical tools and supporting materials.
- **AI Companion** — a conversational assistant that helps visitors explore constraints and relevant case evidence.
- **PDF Reader** — an in-browser reader for the Playbook and case-study PDFs.

## Technology

This is a static HTML, CSS, and JavaScript site with a small serverless API layer:

- HTML pages and shared CSS/JavaScript components
- Local PDF.js assets for the reader
- Netlify Functions for the AI Companion endpoint
- Groq's OpenAI-compatible API, accessed only server-side

The Companion logic is deliberately portable. The business logic lives in [`server/companion-engine.js`](server/companion-engine.js), while [`netlify/functions/companion-chat.js`](netlify/functions/companion-chat.js) only adapts the request and response to Netlify Functions.

## Run locally

For the static pages, open `index.html` directly or serve the project over HTTP:

```powershell
python -m http.server 8080
```

Then open <http://localhost:8080>.

To test the Netlify Function locally, use Netlify CLI with Node.js 18 or newer:

```powershell
$env:GROQ_API_KEY = "your-key"
npx netlify dev
```

Never commit an API key. Configure `GROQ_API_KEY` as an environment variable in Netlify. See [`docs/AI-COMPANION-SETUP.md`](docs/AI-COMPANION-SETUP.md) and [`DEPLOYMENT.md`](DEPLOYMENT.md) for deployment details.

## Deployment

The site is ready to deploy on Netlify:

1. Import this repository from GitHub.
2. Leave the build command empty.
3. Use `.` as the publish directory.
4. Add `GROQ_API_KEY` in **Site configuration → Environment variables**.
5. Deploy the site.

The [`netlify.toml`](netlify.toml) file configures the Functions directory automatically.

## Project structure

```text
.
├── assets/                 Shared styles, scripts, images, and PDF.js
├── downloads/              Source PDFs
├── netlify/functions/      Netlify HTTP adapters
├── pathways/               Audience-specific pathway pages
├── read/                   Reading pages and PDF viewer
├── server/                 Portable Companion engine
├── cases.html
├── companion.html
├── framework.html
├── index.html
├── models.html
├── resources.html
└── netlify.toml
```

## License

This repository is maintained for the Advancing Partnerships Playbook project. Contact the repository owner for usage and contribution questions.
