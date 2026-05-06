// Cloudflare Pages Function: send-push-event
// Path: functions/send-push-event.js

export async function onRequestPost({ request, env }) {
  try {
    const { type, title, body } = await request.json();
    const token = await getFirestoreToken(env);
    const projectId = env.FIREBASE_PROJECT_ID;

    const subsRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/push_subscriptions`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const subsData = await subsRes.json();
    const subscriptions = subsData.documents || [];

    const profilesRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/profiles`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const profilesData = await profilesRes.json();
    const profiles = {};
    (profilesData.documents || []).forEach(doc => {
      profiles[doc.name.split('/').pop()] = doc.fields;
    });

    const results = [];
    for (const doc of subscriptions) {
      const userId = doc.name.split('/').pop();
      const subStr = doc.fields?.subscription?.stringValue;
      if (!subStr) continue;
      const prefs = profiles[userId]?.notifPrefs?.mapValue?.fields;
      if (prefs?.serale?.booleanValue === false) continue;

      try {
        const subscription = JSON.parse(subStr);
        await sendWebPush(subscription, { title, body }, env);
        await saveNotification(token, projectId, userId, type, title, body);
        results.push({ user: userId, ok: true });
      } catch (e) {
        console.error('Push error for', userId, e.message);
        results.push({ user: userId, ok: false, error: e.message });
      }
    }

    return new Response(JSON.stringify({ sent: results.length, results }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
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

// ── WEB PUSH WITH ENCRYPTION ──────────────────────────────────────────────────
async function sendWebPush(subscription, payload, env) {
  const endpoint = subscription.endpoint;
  const p256dh = subscription.keys?.p256dh;
  const auth = subscription.keys?.auth;

  const vapidJwt = await buildVapidJwt(endpoint, env);
  const vapidPublic = env.VAPID_PUBLIC_KEY;

  let bodyBytes;
  let contentEncoding;
  let extraHeaders = {};

  if (p256dh && auth) {
    // Encrypt payload using RFC 8291 (aes128gcm)
    const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));
    bodyBytes = await encryptPayload(payloadBytes, p256dh, auth);
    contentEncoding = 'aes128gcm';
  } else {
    bodyBytes = new TextEncoder().encode(JSON.stringify(payload));
    contentEncoding = 'aesgcm';
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `vapid t=${vapidJwt},k=${vapidPublic}`,
      'Content-Encoding': contentEncoding,
      'Content-Type': 'application/octet-stream',
      'TTL': '86400',
      ...extraHeaders
    },
    body: bodyBytes
  });

  if (res.status === 410 || res.status === 404) {
    throw new Error(`Subscription expired: ${res.status}`);
  }
  if (!res.ok && res.status !== 201) {
    const txt = await res.text();
    throw new Error(`Push failed: ${res.status} ${txt}`);
  }
  return res.status;
}

async function buildVapidJwt(endpoint, env) {
  const audience = new URL(endpoint).origin;
  const now = Math.floor(Date.now() / 1000);

  const header = b64url(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  const claims = b64url(JSON.stringify({ aud: audience, exp: now + 12*3600, sub: 'mailto:admin@urss-carpooling.app' }));
  const sigInput = `${header}.${claims}`;

  const privateKey = await importVapidKey(env.VAPID_PRIVATE_KEY);
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, privateKey, new TextEncoder().encode(sigInput));
  const signature = b64url(new Uint8Array(sig));
  return `${sigInput}.${signature}`;
}

async function importVapidKey(vapidPrivate) {
  const raw = vapidPrivate.replace(/-/g, '+').replace(/_/g, '/');
  const padding = (4 - raw.length % 4) % 4;
  const rawBytes = Uint8Array.from(atob(raw + '='.repeat(padding)), c => c.charCodeAt(0));
  const pkcs8Prefix = new Uint8Array([
    0x30,0x41,0x02,0x01,0x00,0x30,0x13,
    0x06,0x07,0x2a,0x86,0x48,0xce,0x3d,0x02,0x01,
    0x06,0x08,0x2a,0x86,0x48,0xce,0x3d,0x03,0x01,0x07,
    0x04,0x27,0x30,0x25,0x02,0x01,0x01,0x04,0x20
  ]);
  const pkcs8 = new Uint8Array(pkcs8Prefix.length + rawBytes.length);
  pkcs8.set(pkcs8Prefix);
  pkcs8.set(rawBytes, pkcs8Prefix.length);
  return crypto.subtle.importKey('pkcs8', pkcs8, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
}

// RFC 8291 aes128gcm encryption
async function encryptPayload(plaintext, p256dhB64, authB64) {
  // Decode recipient public key and auth
  const p256dh = b64decode(p256dhB64);
  const authBytes = b64decode(authB64);

  // Generate ephemeral ECDH key pair
  const ephemeral = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey', 'deriveBits']);

  // Import recipient public key
  const recipientKey = await crypto.subtle.importKey('raw', p256dh, { name: 'ECDH', namedCurve: 'P-256' }, false, []);

  // Derive shared secret
  const sharedBits = await crypto.subtle.deriveBits({ name: 'ECDH', public: recipientKey }, ephemeral.privateKey, 256);

  // Export ephemeral public key
  const ephemeralPublicRaw = await crypto.subtle.exportKey('raw', ephemeral.publicKey);

  // Generate salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // HKDF to derive content encryption key and nonce
  const ikm = await hkdf(new Uint8Array(sharedBits), authBytes,
    concat(new TextEncoder().encode('WebPush: info\x00'), p256dh, new Uint8Array(ephemeralPublicRaw)), 32);

  const prk = await hkdf(salt, ikm, new TextEncoder().encode('Content-Encoding: aes128gcm\x00'), 16 + 12);
  const cek = prk.slice(0, 16);
  const nonce = prk.slice(16, 28);

  // Import CEK for AES-GCM
  const cekKey = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);

  // Add padding (2 bytes delimiter)
  const paddedPlaintext = concat(plaintext, new Uint8Array([0x02]));

  // Encrypt
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, cekKey, paddedPlaintext);

  // Build header: salt(16) + rs(4) + idlen(1) + keyid(65)
  const rs = new Uint8Array(4);
  new DataView(rs.buffer).setUint32(0, 4096, false);
  const ephPubBytes = new Uint8Array(ephemeralPublicRaw);
  const header = concat(salt, rs, new Uint8Array([ephPubBytes.length]), ephPubBytes);

  return concat(header, new Uint8Array(ciphertext));
}

async function hkdf(salt, ikm, info, length) {
  const key = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info }, key, length * 8);
  return new Uint8Array(bits);
}

function concat(...arrays) {
  const total = arrays.reduce((s, a) => s + a.byteLength, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const a of arrays) { result.set(new Uint8Array(a instanceof ArrayBuffer ? a : a.buffer, a.byteOffset, a.byteLength), offset); offset += a.byteLength; }
  return result;
}

function b64url(data) {
  if (typeof data === 'string') data = new TextEncoder().encode(data);
  return btoa(String.fromCharCode(...(data instanceof Uint8Array ? data : new Uint8Array(data)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
}

function b64decode(str) {
  const s = str.replace(/-/g,'+').replace(/_/g,'/');
  const padded = s + '='.repeat((4 - s.length % 4) % 4);
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}

// ── FIRESTORE HELPERS ─────────────────────────────────────────────────────────
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
  const payload = btoa(JSON.stringify({ iss: env.FIREBASE_CLIENT_EMAIL, scope: 'https://www.googleapis.com/auth/datastore', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const signingInput = `${header}.${payload}`;
  const keyData = privateKey.replace('-----BEGIN PRIVATE KEY-----','').replace('-----END PRIVATE KEY-----','').replace(/\s/g,'');
  const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8', binaryKey, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(signingInput));
  const signature = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
  const jwt = `${signingInput}.${signature}`;
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}` });
  return (await tokenRes.json()).access_token;
}
