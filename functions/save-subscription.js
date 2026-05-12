// Cloudflare Pages Function: save-subscription
// Path: functions/save-subscription.js

const ALLOWED_ORIGINS = ['https://urss.pages.dev'];
const ALLOWED_USERS = ['Ivan', 'Ilaria', 'Dervis', 'Filippo'];

export async function onRequestPost({ request, env }) {
  // Origin check
  const origin = request.headers.get('origin');
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403, headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { subscription, userId } = await request.json();
    if (!userId || !ALLOWED_USERS.includes(userId)) {
      return new Response(JSON.stringify({ error: 'Invalid userId' }), {
        status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin }
      });
    }
    if (!subscription) {
      return new Response(JSON.stringify({ error: 'Missing subscription' }), {
        status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin }
      });
    }

    // Save to Firestore via REST API
    const url = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/push_subscriptions/${userId}`;
    const token = await getFirestoreToken(env);

    const body = {
      fields: {
        userId: { stringValue: userId },
        subscription: { stringValue: JSON.stringify(subscription) },
        updatedAt: { stringValue: new Date().toISOString() }
      }
    };

    const fsRes = await fetch(url + '?updateMask.fieldPaths=userId&updateMask.fieldPaths=subscription&updateMask.fieldPaths=updatedAt', {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!fsRes.ok) {
      const err = await fsRes.text();
      console.error('Firestore save failed:', fsRes.status, err);
      return new Response(JSON.stringify({ ok: false, error: 'Save failed' }), {
        status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin }
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin }
    });
  } catch (e) {
    console.error('save-subscription error:', e);
    return new Response(JSON.stringify({ ok: false, error: 'Internal error' }), {
      status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin }
    });
  }
}

export async function onRequestOptions({ request }) {
  const origin = request.headers.get('origin');
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

async function getFirestoreToken(env) {
  // Use service account to get access token
  const now = Math.floor(Date.now() / 1000);
  const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
  
  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    iss: env.FIREBASE_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
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
  const keyData = privateKeyPem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'pkcs8', binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, encoder.encode(input));
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
