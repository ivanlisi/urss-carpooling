// Cloudflare Pages Function: send-push-event
// Path: functions/send-push-event.js

export async function onRequestPost({ request, env }) {
  try {
    const { type, title, body } = await request.json();
    const token = await getFirestoreToken(env);
    const projectId = env.FIREBASE_PROJECT_ID;

    // Get all subscriptions
    const subsRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/push_subscriptions`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const subsData = await subsRes.json();
    const subscriptions = subsData.documents || [];

    // Get all profiles for notification prefs
    const profilesRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/profiles`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const profilesData = await profilesRes.json();
    const profiles = {};
    (profilesData.documents || []).forEach(doc => {
      const name = doc.name.split('/').pop();
      profiles[name] = doc.fields;
    });

    const results = [];
    for (const doc of subscriptions) {
      const userId = doc.name.split('/').pop();
      const subStr = doc.fields?.subscription?.stringValue;
      if (!subStr) continue;

      // Check notification pref
      const prefs = profiles[userId]?.notifPrefs?.mapValue?.fields;
      if (prefs?.serale?.booleanValue === false) continue;

      try {
        const subscription = JSON.parse(subStr);
        await sendWebPush(subscription, { title, body }, env);
        await saveNotification(token, projectId, userId, type, title, body);
        results.push({ user: userId, ok: true });
      } catch (e) {
        results.push({ user: userId, ok: false, error: e.message });
      }
    }

    return new Response(JSON.stringify({ sent: results.length, results }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    console.error('send-push-event error:', e);
    return new Response('Error', { status: 500 });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

async function importVapidKey(vapidPrivate) {
  // VAPID private key is raw EC key in base64url format (32 bytes)
  const raw = vapidPrivate.replace(/-/g, '+').replace(/_/g, '/');
  const padding = (4 - raw.length % 4) % 4;
  const padded = raw + '='.repeat(padding);
  const rawBytes = Uint8Array.from(atob(padded), c => c.charCodeAt(0));

  // Wrap raw EC key into PKCS8 format for P-256
  const pkcs8Prefix = new Uint8Array([
    0x30, 0x41, 0x02, 0x01, 0x00, 0x30, 0x13,
    0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01,
    0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07,
    0x04, 0x27, 0x30, 0x25, 0x02, 0x01, 0x01, 0x04, 0x20
  ]);
  const pkcs8 = new Uint8Array(pkcs8Prefix.length + rawBytes.length);
  pkcs8.set(pkcs8Prefix);
  pkcs8.set(rawBytes, pkcs8Prefix.length);

  return crypto.subtle.importKey(
    'pkcs8', pkcs8,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false, ['sign']
  );
}

async function sendWebPush(subscription, payload, env) {
  const vapidPublic = env.VAPID_PUBLIC_KEY;
  const endpoint = subscription.endpoint;
  const audience = new URL(endpoint).origin;
  const now = Math.floor(Date.now() / 1000);

  const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'ES256' })).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
  const claims = btoa(JSON.stringify({ aud: audience, exp: now + 12*3600, sub: 'mailto:admin@urss-carpooling.app' })).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
  const sigInput = `${header}.${claims}`;

  const privateKey = await importVapidKey(env.VAPID_PRIVATE_KEY);
  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    privateKey,
    new TextEncoder().encode(sigInput)
  );
  const signature = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
  const jwt = `${sigInput}.${signature}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `vapid t=${jwt},k=${vapidPublic}`,
      'Content-Type': 'application/json',
      'TTL': '86400'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok && res.status !== 201 && res.status !== 410) {
    throw new Error(`Push failed: ${res.status}`);
  }
  return res.status;
}

async function saveNotification(token, projectId, userId, type, title, body) {
  const ts = new Date().toISOString();
  const id = userId + '_' + ts.replace(/[:.]/g, '-') + '_' + Math.random().toString(36).slice(2, 5);
  await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/notifications/${id}`,
    {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          userId: { stringValue: userId },
          type: { stringValue: type || 'default' },
          title: { stringValue: title },
          body: { stringValue: body },
          ts: { stringValue: ts },
          read: { booleanValue: false }
        }
      })
    }
  );
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
