/**
 * Standalone test script — run this BEFORE debugging the full app.
 * It isolates whether the problem is your API key/model, or your app code.
 *
 * Usage:
 *   node test-gemini.js
 */
require('dotenv').config();
const axios = require('axios');

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

async function main() {
  console.log('--- Gemini API connectivity test ---');
  console.log('Model:', GEMINI_MODEL);
  console.log('API key present:', GEMINI_API_KEY ? `yes (${GEMINI_API_KEY.slice(0, 6)}...)` : 'NO — missing!');

  if (!GEMINI_API_KEY) {
    console.error('\n❌ GOOGLE_API_KEY is not set in backend/.env. Fix that first.');
    process.exit(1);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const res = await axios.post(url, {
      contents: [{ role: 'user', parts: [{ text: 'Say hello in one short sentence.' }] }]
    });
    const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('\n✅ SUCCESS. Gemini responded:');
    console.log(text || JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('\n❌ FAILED.');
    console.error('Status:', err.response?.status);
    console.error('Body:', JSON.stringify(err.response?.data, null, 2) || err.message);
    console.error('\nCommon fixes:');
    console.error('- 400/API key not valid: your GOOGLE_API_KEY is wrong or has extra spaces/quotes');
    console.error('- 403: Generative Language API not enabled on your Google Cloud project, or key restricted');
    console.error('- 404: model name is wrong/deprecated — check https://ai.google.dev/gemini-api/docs/models');
    console.error('- 429: quota/rate limit exceeded — wait and retry');
  }
}

main();
