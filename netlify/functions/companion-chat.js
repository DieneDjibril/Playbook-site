'use strict';

// Pour migrer vers un autre hébergeur (Vercel, Cloudflare Workers, serveur Node autonome), ne réécrire que ce fichier — toute la logique est dans server/companion-engine.js, qui n'a aucune dépendance à Netlify.

const { handleCompanionRequest, CompanionEngineError } = require('../../server/companion-engine');

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { Allow: 'POST', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed.' })
    };
  }
  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (error) {
    return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Invalid JSON body.' }) };
  }
  try {
    const result = await handleCompanionRequest(payload.messages);
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result) };
  } catch (error) {
    const statusCode = error instanceof CompanionEngineError ? error.status : 500;
    return {
      statusCode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error instanceof CompanionEngineError ? error.message : 'The Companion is temporarily unavailable — try again in a moment.' })
    };
  }
};
