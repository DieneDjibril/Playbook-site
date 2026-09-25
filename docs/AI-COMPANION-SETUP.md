# AI Companion setup

The Companion sends the complete browser conversation to
`/.netlify/functions/companion-chat`. The API key is read only on the server by
`server/companion-engine.js`; it must never be placed in HTML or browser JavaScript.

## Netlify

1. Create a free account and API key at [console.groq.com](https://console.groq.com/).
2. Open **Site settings → Environment variables** in Netlify.
3. Add `GROQ_API_KEY` with the secret key value.
4. Optionally add `GROQ_MODEL` to override the default
   `openai/gpt-oss-120b`.
5. Redeploy the site. The root `netlify.toml` points Netlify to
   `netlify/functions`.

The engine uses Groq's OpenAI-compatible chat-completions endpoint. Missing keys,
quota errors, upstream failures, invalid requests, and timeouts are returned as
clean HTTP errors; the frontend displays a temporary-unavailable message instead
of breaking the page.

## Changer d’hébergeur

Pour migrer vers Vercel, Cloudflare Workers ou un serveur Node autonome, ne
réécrire que `netlify/functions/companion-chat.js` dans le format de fonctions du
nouvel hébergeur. Toute la logique métier — prompt, appel Groq, validation,
gestion des erreurs et liens — reste dans `server/companion-engine.js`, qui n'a
aucune dépendance à Netlify. Le nouvel adaptateur doit recevoir `{ messages }`,
appeler `handleCompanionRequest(messages)` et renvoyer `{ reply, links }`.

## Local testing

With Node 18+ and a temporary environment variable:

```powershell
$env:GROQ_API_KEY = "your-key"
npx netlify dev
```

Do not commit the key or save it in a project file.
