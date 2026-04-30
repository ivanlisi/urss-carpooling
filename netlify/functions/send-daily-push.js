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

const DRIVERS = ['Filippo', 'Dervis', 'Ivan', 'Ilaria'];
const ANCHOR = new Date('2026-04-20T00:00:00Z');
const ANCHOR_IDX = 0;

const HOLIDAYS = new Set([
  '2026-01-01','2026-01-06','2026-04-03','2026-04-05','2026-04-06',
  '2026-04-25','2026-05-01','2026-06-02','2026-06-24',
  '2026-08-15','2026-11-01','2026-12-08','2026-12-25','2026-12-26',
  '2027-01-01','2027-01-06','2027-04-25','2027-05-01','2027-06-02','2027-06-24',
  '2027-08-15','2027-11-01','2027-12-08','2027-12-25','2027-12-26',
]);

function toDateStr(d) { return d.toISOString().slice(0, 10); }
function isWeekend(d) { const day = d.getUTCDay(); return day === 0 || day === 6; }
function isHoliday(d) { return HOLIDAYS.has(toDateStr(d)); }
function isWorkDay(d) { return !isWeekend(d) && !isHoliday(d); }

function countWorkingDays(from, to) {
  let count = 0;
  const d = new Date(from);
  const t = new Date(to);
  if (t > d) {
    d.setUTCDate(d.getUTCDate() + 1);
    while (d <= t) { if (isWorkDay(d)) count++; d.setUTCDate(d.getUTCDate() + 1); }
  }
  return count;
}

function getBaseDriver(date) {
  const d = new Date(date); d.setUTCHours(0,0,0,0);
  const wd = countWorkingDays(ANCHOR, d);
  if (d >= ANCHOR) return DRIVERS[(ANCHOR_IDX + wd) % 4];
  return DRIVERS[((ANCHOR_IDX - wd) % 4 + 4) % 4];
}

const MONTHS = ['gennaio','febbraio','marzo','aprile','maggio','giugno',
                'luglio','agosto','settembre','ottobre','novembre','dicembre'];
const DAYS = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];

const WEEKEND_PHRASES = [
  "Il proletariato del carpooling ha completato un'altra settimana di onorevole servizio. Riposate, compagni.",
  "La Quinta Marcia verso Cesena è conclusa. Il Partito è soddisfatto della vostra produttività.",
  "Cinque giorni di gloriosa mobilità collettiva. L'automobile ringrazia, il pianeta pure.",
  "Il Comitato Centrale del Carpooling decreta: meritato riposo per tutti i membri del collettivo.",
  "Un'altra settimana di turni equamente distribuiti secondo i principi marxisti-automobilistici.",
  "Il motore tace, i compagni riposano. Così recita il Grande Libro dei Turni.",
  "La via Tarkowskij è stata percorsa con onore. Ora è tempo di riposo rivoluzionario.",
  "Cinque giorni, quattro guidatori, zero disorganizzazione. La collettivizzazione funziona.",
  "Viserba-Cesena, andata e ritorno, per cinque giorni. L'eroismo quotidiano non fa rumore.",
  "Il carpooling è la forma più alta di comunismo applicato. Buon weekend, camarade.",
  "Nessun compagno è stato lasciato a piedi questa settimana. La missione è compiuta.",
  "La settimana si chiude. L'URSS del carpooling non dorme mai — ma nel weekend ci prova.",
  "Ogni lunedì è una rivoluzione, ogni venerdì una vittoria. Buon weekend, compagni!",
  "Il collettivo ha navigato la settimana con la grazia di un Lada su strada asfaltata.",
];

exports.handler = async () => {
  const now = new Date();

  // Saturday morning: send weekend message
  if (now.getUTCDay() === 6) {
    const weekNumber = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
    const phrase = WEEKEND_PHRASES[weekNumber % WEEKEND_PHRASES.length]
      .replace(/[Bb]uon weekend[^.!]*[.!]?\s*/g, '').trim();

    const subsSnap = await db.collection('push_subscriptions').get();
    const profilesSnap = await db.collection('profiles').get();
    const profiles = {};
    profilesSnap.forEach(d => { profiles[d.id] = d.data(); });

    for (const doc of subsSnap.docs) {
      const { subscription } = doc.data();
      if (!subscription) continue;
      const prefs = profiles[doc.id]?.notifPrefs || { serale: true };
      if (prefs.serale === false) continue;
      try {
        await webpush.sendNotification(subscription, JSON.stringify({
          title: '☭ Buon weekend, compagni!',
          body: phrase
        }));
      } catch(e) {
        if (e.statusCode === 410) await doc.ref.delete();
      }
    }
    return { statusCode: 200, body: 'Weekend message sent' };
  }

  // Find next working day
  const target = new Date(toDateStr(now) + 'T00:00:00Z');
  target.setUTCDate(target.getUTCDate() + 1);
  while (!isWorkDay(target)) target.setUTCDate(target.getUTCDate() + 1);
  const targetStr = toDateStr(target);

  // Get driver (check exceptions)
  let driver = getBaseDriver(target);
  try {
    const doc = await db.collection('exceptions').doc(targetStr).get();
    if (doc.exists && doc.data().driver) driver = doc.data().driver;
  } catch(e) {}

  const dayName = DAYS[target.getUTCDay()];
  const dateLabel = `${target.getUTCDate()} ${MONTHS[target.getUTCMonth()]}`;
  const title = `🚗 ${dayName} ${dateLabel}`;
  const body = `Domani guida: ${driver} · Via Tarkowskij 07:45`;

  // Send to all subscribers
  const snap = await db.collection('push_subscriptions').get();
  const results = [];
  for (const doc of snap.docs) {
    const { subscription } = doc.data();
    try {
      await webpush.sendNotification(subscription, JSON.stringify({ title, body }));
      results.push({ user: doc.id, ok: true });
    } catch(e) {
      console.error(`Failed for ${doc.id}:`, e.message);
      // Remove invalid subscriptions
      if (e.statusCode === 410) await doc.ref.delete();
      results.push({ user: doc.id, ok: false });
    }
  }

  console.log('Push results:', results);
  return { statusCode: 200, body: JSON.stringify({ sent: results.length }) };
};
