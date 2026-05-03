const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { credential } = require('firebase-admin');

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

// Default fallback prices (Emilia-Romagna average)
const FALLBACK_PRICES = {
  benzina: 1.812,
  diesel: 1.689,
  gpl: 0.721,
  ibrido: 1.812,
  ibrido_plug: 1.812,
  elettrico: 0.25 // €/kWh domestic average Italy
};

exports.handler = async (event) => {
  // GET: return current prices from Firestore cache
  if (event.httpMethod === 'GET') {
    try {
      const doc = await db.collection('config').doc('fuel_prices').get();
      if (doc.exists) {
        const data = doc.data();
        const age = Date.now() - new Date(data.updatedAt).getTime();
        // Return cached if less than 24h old
        if (age < 24 * 60 * 60 * 1000) {
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data.prices)
          };
        }
      }
    } catch(e) {}

    // Try to fetch from MIMIT
    try {
      const res = await fetch('https://www.mise.gov.it/images/exportCSV/png_nl.csv', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (res.ok) {
        const text = await res.text();
        const lines = text.split('\n').filter(l => l.trim());
        let benzina = 0, diesel = 0, count_b = 0, count_d = 0;
        for (const line of lines.slice(1)) {
          const cols = line.split(';');
          if (cols.length < 6) continue;
          const tipo = cols[3]?.trim().toLowerCase();
          const prezzo = parseFloat(cols[5]?.replace(',', '.'));
          if (!prezzo || prezzo < 0.5 || prezzo > 5) continue;
          if (tipo?.includes('benzina')) { benzina += prezzo; count_b++; }
          if (tipo?.includes('gasolio') || tipo?.includes('diesel')) { diesel += prezzo; count_d++; }
        }
        const prices = {
          benzina: count_b > 0 ? Math.round((benzina / count_b) * 1000) / 1000 : FALLBACK_PRICES.benzina,
          diesel: count_d > 0 ? Math.round((diesel / count_d) * 1000) / 1000 : FALLBACK_PRICES.diesel,
          gpl: FALLBACK_PRICES.gpl,
          ibrido: count_b > 0 ? Math.round((benzina / count_b) * 1000) / 1000 : FALLBACK_PRICES.ibrido,
          ibrido_plug: count_b > 0 ? Math.round((benzina / count_b) * 1000) / 1000 : FALLBACK_PRICES.ibrido_plug,
          elettrico: FALLBACK_PRICES.elettrico,
          updatedAt: new Date().toISOString()
        };
        await db.collection('config').doc('fuel_prices').set({ prices, updatedAt: new Date().toISOString() });
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prices)
        };
      }
    } catch(e) {
      console.warn('MIMIT fetch failed, using fallback:', e.message);
    }

    // Return fallback
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...FALLBACK_PRICES, updatedAt: new Date().toISOString() })
    };
  }

  return { statusCode: 405, body: 'Method not allowed' };
};
