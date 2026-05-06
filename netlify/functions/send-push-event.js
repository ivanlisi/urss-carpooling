const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { credential } = require('firebase-admin');
const webpush = require('web-push');

if (!getApps().length) {
  initializeApp({
    credential: credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

webpush.setVapidDetails(
  'mailto:admin@urss-carpooling.app',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function saveNotification(db, userId, type, title, body) {
  try {
    const ts = new Date().toISOString();
    const id = userId + '_' + ts.replace(/[:.]/g, '-') + '_' + Math.random().toString(36).slice(2,5);
    await db.collection('notifications').doc(id).set({ userId, type, title, body, ts, read: false });
  } catch(e) { console.warn('saveNotification error', e); }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  try {
    const { title, body } = JSON.parse(event.body);

    const subsSnap = await db.collection('push_subscriptions').get();
    const profilesSnap = await db.collection('profiles').get();
    const profiles = {};
    profilesSnap.forEach(d => { profiles[d.id] = d.data(); });

    const results = [];
    for (const doc of subsSnap.docs) {
      const userId = doc.id;
      const { subscription } = doc.data();
      if (!subscription) continue;

      // Check generic notification pref
      const prefs = profiles[userId]?.notifPrefs || { serale: true };
      if (prefs.serale === false) continue;

      try {
        await webpush.sendNotification(subscription, JSON.stringify({ title, body }));
        await saveNotification(db, userId, type, title, body);
        results.push({ user: userId, ok: true });
      } catch(e) {
        if (e.statusCode === 410) await doc.ref.delete();
        results.push({ user: userId, ok: false });
      }
    }

    return { statusCode: 200, body: JSON.stringify({ sent: results.length }) };
  } catch(e) {
    console.error('send-push-event error:', e);
    return { statusCode: 500, body: 'Error' };
  }
};
