// Cloudflare Pages Function: fuel-prices
// Path: functions/fuel-prices.js

const FALLBACK = {
  benzina: 1.812, diesel: 1.689, gpl: 0.721,
  ibrido: 1.812, ibrido_plug: 1.812, elettrico: 0.25
};

const ALLOWED_ORIGINS = ['https://urss.pages.dev'];
const MIMIT_CSV_URL = 'https://www.mimit.gov.it/images/stories/carburanti/MediaRegionaleStradale.csv';
const MIMIT_TIMEOUT_MS = 5000;

function corsHeaders(request) {
  const origin = request.headers.get('origin');
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': allowOrigin };
}

export async function onRequestGet({ request, env }) {
  try {
    const token = await getFirestoreToken(env);
    const projectId = env.FIREBASE_PROJECT_ID;

    // Check Firestore cache (24h server-side)
    const cacheRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/config/fuel_prices`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    if (cacheRes.ok) {
      const cacheData = await cacheRes.json();
      const updatedAt = cacheData.fields?.updatedAt?.stringValue;
      if (updatedAt) {
        const age = Date.now() - new Date(updatedAt).getTime();
        if (age < 24 * 60 * 60 * 1000) {
          const prices = {};
          const pricesField = cacheData.fields?.prices?.mapValue?.fields || {};
          Object.entries(pricesField).forEach(([k, v]) => { prices[k] = parseFloat(v.doubleValue || v.integerValue || 0); });
          if (Object.keys(prices).length > 0) {
            return new Response(JSON.stringify(prices), { headers: corsHeaders(request) });
          }
        }
      }
    }

    // Try MIMIT with timeout
    let prices = { ...FALLBACK };
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), MIMIT_TIMEOUT_MS);
      const mimitRes = await fetch(MIMIT_CSV_URL, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (mimitRes.ok) {
        const text = await mimitRes.text();
        let benzSum = 0, benzCount = 0, dieselSum = 0, dieselCount = 0;
        text.split('\n').slice(1).forEach(line => {
          const cols = line.split(';');
          if (cols.length < 6) return;
          const tipo = (cols[3] || '').trim().toLowerCase();
          const prezzo = parseFloat((cols[5] || '').replace(',', '.'));
          if (!prezzo || prezzo < 0.5 || prezzo > 5) return;
          if (tipo.includes('benzina')) { benzSum += prezzo; benzCount++; }
          if (tipo.includes('gasolio') || tipo.includes('diesel')) { dieselSum += prezzo; dieselCount++; }
        });
        if (benzCount > 0) prices.benzina = Math.round(benzSum / benzCount * 1000) / 1000;
        if (dieselCount > 0) prices.diesel = Math.round(dieselSum / dieselCount * 1000) / 1000;
        prices.ibrido = prices.benzina;
        prices.ibrido_plug = prices.benzina;
      }
    } catch(e) {
      console.warn('MIMIT fetch failed:', e.name === 'AbortError' ? 'timeout' : e.message);
      /* use fallback */
    }

    // Save to Firestore cache
    const pricesFields = {};
    Object.entries(prices).forEach(([k, v]) => { pricesFields[k] = { doubleValue: v }; });
    await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/config/fuel_prices`,
      {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            prices: { mapValue: { fields: pricesFields } },
            updatedAt: { stringValue: new Date().toISOString() }
          }
        })
      }
    );

    return new Response(JSON.stringify(prices), { headers: corsHeaders(request) });
  } catch (e) {
    console.error('fuel-prices error:', e.message);
    return new Response(JSON.stringify(FALLBACK), { headers: corsHeaders(request) });
  }
}

export async function onRequestOptions({ request }) {
  const origin = request.headers.get('origin');
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

async function getFirestoreToken(env) {
  const now = Math.floor(Date.now() / 1000);
  const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    iss: env.FIREBASE_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600
  }));
  const signingInput = `${header}.${payload}`;
  const signature = await signJWT(signingInput, privateKey);
  const jwt = `${signingInput}.${signature}`;
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });
  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

async function signJWT(input, privateKeyPem) {
  const keyData = privateKeyPem.replace('-----BEGIN PRIVATE KEY-----', '').replace('-----END PRIVATE KEY-----', '').replace(/\s/g, '');
  const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8', binaryKey, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, encoder.encode(input));
  return btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
