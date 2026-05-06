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

async function sendWebPush(subscription, payload, env) {
  const vapidPublic = env.VAPID_PUBLIC_KEY;
  const vapidPrivate = env.VAPID_PRIVATE_KEY;
  const endpoint = subscription.endpoint;
  const audience = new URL(endpoint).origin;

  const now = Math.floor(Date.now() / 1000);
  const vapidHeader = btoa(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  const vapidPayload = btoa(JSON.stringify({ aud: audience, exp: now + 12 * 3600, sub: 'mailto:admin@urss-carpooling.app' }));
  const signingInput = `${vapidHeader}.${vapidPayload}`;

  // Import VAPID private key
  const rawKey = vapidPrivate.replace(/-/g, '+').replace(/_/g, '/');
  const keyBytes = Uint8Array.from(atob(rawKey), c => c.charCodeAt(0));
  const privateKey = await crypto.subtle.importKey(
    'raw', keyBytes, { name: 'ECDH', namedCurve: 'P-256' }, true, []
  ).catch(async () => {
    return crypto.subtle.importKey(
      'pkcs8', keyBytes, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']
    );
  });

  const encoder = new TextEncoder();
  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    privateKey,
    encoder.encode(signingInput)
  );
  const signature = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const jwt = `${signingInput}.${signature}`;

  // Encrypt payload
  const payloadStr = JSON.stringify(payload);
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `vapid t=${jwt},k=${vapidPublic}`,
      'Content-Type': 'application/json',
      'TTL': '86400'
    },
    body: payloadStr
  });
  if (!res.ok && res.status !== 201) throw new Error(`Push failed: ${res.status}`);
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
