// Cloudflare Pages Function: send-push-event
// Proxies to the urss-daily-push Worker which has web-push npm

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

    // Get profiles for prefs
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
        // Call the Worker that has web-push
        const workerRes = await fetch('https://urss-daily-push.ivan-lisi-1983.workers.dev/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: JSON.parse(subStr), title, body })
        });
        if (workerRes.ok) {
          await saveNotification(token, projectId, userId, type, title, body);
          results.push({ user: userId, ok: true });
        } else {
          const err = await workerRes.text();
          results.push({ user: userId, ok: false, error: err });
        }
      } catch (e) {
        results.push({ user: userId, ok: false, error: e.message });
      }
    }

    return new Response(JSON.stringify({ sent: results.length, results }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { 'Access-Control-Allow-Origin': '*' }
    });
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
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });
  return (await tokenRes.json()).access_token;
}
