# Advancing Partnerships Playbook — Deployment & Setup

A static, multi-page knowledge hub. No build step required.

## 1. Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, deployability, three logics, models, cases teaser |
| `framework.html` | Deployability, translation gap, diagnosis, capital continuum |
| `models.html` | The three partnership models in detail |
| `cases.html` | Four case studies (Babban Gona, KCB, RUTF, Lake Turkana) |
| `resources.html` | The four companion resources + request-access form |
| `companion.html` | The AI Companion (chat) |
| `assets/styles.css` | Shared styling |
| `assets/components.js` | Shared nav + footer + animations |
| `assets/companion.js` | Chat UI and serverless API client |
| `server/companion-engine.js` | Portable Companion prompt and Groq engine |
| `netlify/functions/companion-chat.js` | Minimal Netlify Functions adapter |

## 2. Preview locally

Just open `index.html` in a browser. Everything works over `file://`, including the built-in AI Companion.

For a cleaner local server (recommended):
```bash
cd site
python3 -m http.server 8080
# open http://localhost:8080
```

## 3. Publish for free

Any static host works. Easiest options:

- **Netlify** — drag the `site` folder onto app.netlify.com/drop.
- **Vercel** — `vercel` in the `site` folder, or import from Git.
- **GitHub Pages** — push `site/` to a repo, enable Pages.
- **Cloudflare Pages** — connect the repo, no build command, output dir `site`.

## 4. Legacy proxy example (superseded)

The current Netlify/Groq setup is documented in
[`docs/AI-COMPANION-SETUP.md`](docs/AI-COMPANION-SETUP.md). The historical proxy
example below is retained only as migration context and is not used by this site.

### Mode A — built-in (default, zero setup)
The Companion answers from a curated knowledge base in `assets/companion.js`
(the `KB` array). No API key, works offline. Edit/extend `KB` to add answers.

### Mode B — connect a real LLM (full conversational answers)
**Never put an API key in the website** — anything in the browser is public.
Instead deploy a tiny backend "proxy" that holds the key, and point the site to it.

**Example proxy (Vercel serverless, Claude).** Create `api/chat.js` in a new project:

```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { messages } = req.body;

  const system =
    "You are the Playbook Companion for the Advancing Partnerships Playbook. " +
    "Help users diagnose their binding constraint, choose among the three partnership " +
    "models (Aggregation & Warehouse Platforms; Integrated Project Preparation & " +
    "Guarantee Platform; Predictable Delivery Networks), and apply the Impact Capital " +
    "Continuum. Be concise, practical, and grounded in deployability.";

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,   // set in Vercel env vars
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 700,
      system,
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    })
  });
  const data = await r.json();
  const reply = (data.content && data.content[0] && data.content[0].text) || '';
  res.status(200).json({ reply });
}
```

Steps:
1. Deploy that project to Vercel. Add env var `ANTHROPIC_API_KEY` (your key).
2. Note the URL, e.g. `https://your-app.vercel.app/api/chat`.
3. On the Companion page, click the gear icon and paste that URL — **or** set
   `BACKEND_ENDPOINT` at the top of `assets/companion.js`.
4. Add CORS if the site is on a different domain (in the proxy, set
   `Access-Control-Allow-Origin` to your site's domain).

The site auto-detects: if an endpoint is set it uses the live model; otherwise it
falls back to the built-in guide. If the endpoint errors, it gracefully falls back too.

> An OpenAI version is identical — swap the URL, header (`Authorization: Bearer ...`),
> and response parsing.

## 5. Make the request-access form real

`resources.html` has a working front-end form that currently just confirms locally.
To receive submissions by email, point it at a form service:

- **Formspree:** set the `<form>` `action="https://formspree.io/f/XXXX"` and `method="POST"`, then remove the `onsubmit` handler.
- **Google Forms / Airtable / your own endpoint:** same idea.

## 6b. Reading experience (Read the Playbook + Case Studies + Downloads)

### Pages added
- `read/playbook.html` — "Read the Playbook" landing (chapter list, reading times, Download full PDF).
- `read/playbook/*.html` — 17 chapter pages (Parts I–XV, plus How-to-use and Annexes). Full text, tables, figures, persistent TOC, breadcrumbs, prev/next, reading-progress bar, section anchor links, in-Playbook search, related links, sticky Download-PDF.
- `read/case-babban-gona.html`, `read/case-kcb.html`, `read/case-ltwp.html`, `read/case-rutf.html` — full-text case pages with section TOC, figures/tables, references, related concepts, prev/next across cases, "Download PDF" and "Ask the Companion about this case".
- `read/executive-summary.html` — full-text executive summary.
- `downloads.html` — Downloads hub (each doc: Read online + Download PDF + reading time + type + publication info).

### Files/assets added
- `assets/reader.css` — reading layout & typography.
- `assets/reader.js` — progress bar, anchor links, mobile TOC, in-Playbook search.
- `assets/playbook-search.js` — generated search index (`window.PLAYBOOK_INDEX`). Loaded as a JS file (not fetched) so search works over `file://` too.
- `read/playbook/img/` and `read/img/` — figures extracted from the source documents (EMF/WMF auto-converted to PNG).

### Files modified
- `assets/components.js` — added the **Read** dropdown (Full Playbook · Case Studies · Downloads) and made nav/footer links path-aware via `<body data-root="…">`.
- `assets/styles.css` — dropdown styles.
- `assets/companion.js` — supports `companion.html?ask=…` deep links (used by the case-study "Ask the Companion" button).

### PDF folder & filenames (stable URLs)
```
downloads/capital-mobilization-playbook.pdf
downloads/case-study-babban-gona.pdf
downloads/case-study-kcb.pdf
downloads/case-study-ltwp.pdf
downloads/case-study-rutf.pdf
downloads/executive-summary.pdf
```
These were generated from the Word originals with LibreOffice. To use official PDFs instead, just overwrite the file keeping the **same filename** — every link keeps working.

### Replacing or updating a PDF later
1. Put the new PDF in `site/downloads/`.
2. Give it the **exact same filename** as the one it replaces (see list above).
3. Redeploy (below). No HTML changes needed — the Read/Download links are stable.
   (If you add a brand-new document, copy an existing card in `downloads.html` and add a matching `read/…` page.)

### Regenerating the reading pages from updated Word files
If the source `.docx` change, the pages can be re-generated. The extraction scripts used were `gen.py` (Playbook), `gen2.py` (cases + exec summary) and the landing/downloads builder. They require `python-docx`, `mammoth`, `beautifulsoup4`, and LibreOffice (`soffice`) for figure conversion. Ask your developer (or this assistant) to re-run them against the new files.

## 7b. Redeploying to Netlify
- **Drag-and-drop:** open app.netlify.com → your site → *Deploys* → drag the `site` folder onto the deploy area. (Deploy the `site` folder itself, which now contains `read/` and `downloads/`.)
- **Git-based:** commit and push; Netlify redeploys automatically. No build command; publish directory = `site`.
- After deploy, the stable URLs are e.g. `https://your-site.netlify.app/read/playbook.html` and `https://your-site.netlify.app/downloads/capital-mobilization-playbook.pdf`.
- PDFs download correctly on Netlify out of the box (the links use the `download` attribute). No config needed. Optional: add a `_headers` file if you want to force `Content-Disposition: attachment`.

## 8. Do NOT deploy stray build folders
A `node_modules` folder is not part of the site. If one ever appears inside `site/`, delete it before deploying (it only bloats the upload).

## 6. Customise

- **Branding / owner:** edit the brand name and footer in `assets/components.js`, and the contact email in `resources.html`.
- **Colours & fonts:** all tokens are at the top of `assets/styles.css` (`:root`).
- **Content:** each page is plain HTML — edit text directly.
