const firebaseAdminService = require('../../_services/firebaseAdminService');

module.exports = async function handler(req, res) {
  // Aceita GET ou POST para ser facilmente pingado pelo UptimeRobot
  try {
    const db = firebaseAdminService.db;
    if (!db) return res.status(500).json({ error: 'DB not initialized' });

    const now = new Date().toISOString();
    const snapshot = await db.collectionGroup('numbers')
      .where('status', 'in', ['RESERVED', 'PENDING_PAYMENT'])
      .where('expiresAt', '<', now)
      .get();
      
    if (!snapshot.empty) {
      const batch = db.batch();
      snapshot.forEach(doc => {
        batch.update(doc.ref, {
          status: 'CANCELED',
          isCanceled: true
        });
      });
      await batch.commit();
      console.log(`[Sweeper Serverless] Liberou ${snapshot.size} número(s) expirado(s).`);
      return res.status(200).json({ success: true, released: snapshot.size });
    }

    return res.status(200).json({ success: true, released: 0 });
  } catch(error) {
    console.error('[Sweeper Serverless] Erro ao liberar números:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
