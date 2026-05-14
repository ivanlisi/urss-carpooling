// Cloudflare Pages Function: delete-notifications
// Path: functions/delete-notifications.js
// Deletes ALL notifications for a given user

const ALLOWED_ORIGINS = ['https://urss.pages.dev'];
const ALLOWED_USERS = ['Ivan', 'Ilaria', 'Dervis', 'Filippo'];

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('origin');
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403, headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { userId } = await request.json();
    if (!userId || !ALLOWED_USERS.includes(userId)) {
      return new Response(JSON.stringify({ error: 'Invalid userId' }), {
        status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin }
      });
    }

    const projectId = env.FIREBASE_PROJECT_ID;
    const token = await getFirestoreToken(env);

    // Query all notifications for this user
    const queryRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: 'notifications' }],
            where: {
              fieldFilter: {
                field: { fieldPath: 'userId' },
                op: 'EQUAL',
                value: { stringValue: userId }
              }
            }
          }
        })
      }
    );

    if (!queryRes.ok) {
      const err = await queryRes.text();
      console.error('Query failed:', queryRes.status, err);
      return new Response(JSON.stringify({ ok: false, error: 'Query failed' }), {
        status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin }
      });
    }

    const results = await queryRes.json();
    const docs = (results || []).filter(r => r.document).map(r => r.document.name);

    if (!docs.length) {
      return new Response(JSON.stringify({ ok: true, deleted: 0 }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin }
      });
    }

    // Use batchWrite to delete all in one call (up to 500 per batch)
    const writes = docs.map(name => ({ delete: name }));
    const batchRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:batchWrite`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ writes })
      }
    );

    if (!batchRes.ok) {
      const err = await batchRes.text();
      console.error('Batch delete failed:', batchRes.status, err);
      return new Response(JSON.stringify({ ok: false, error: 'Delete failed' }), {
        status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin }
      });
    }

    return new Response(JSON.stringify({ ok: true, deleted: docs.length }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin }
    });
  } catch (e) {
    console.error('delete-notifications error:', e);
    return new Response(JSON.stringify({ ok: false, error: 'Internal error' }), {
      status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin || ALLOWED_ORIGINS[0] }
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
  const keyData = privateKey.replace('-----BEGIN PRIVATE KEY-----','').replace('-----END PRIVATE KEY-----','').replace(/\s/g,'');
  const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8', binaryKey, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(signingInput));
  const signature = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
  const jwt = `${signingInput}.${signature}`;
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });
  return (await tokenRes.json()).access_token;
}
