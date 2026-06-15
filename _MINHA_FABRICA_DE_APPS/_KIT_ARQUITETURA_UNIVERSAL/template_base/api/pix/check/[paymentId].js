const mercadopagoService = require('../../../_services/mercadopagoService');
const firebaseAdminService = require('../../../_services/firebaseAdminService');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { paymentId } = req.query;
    const paymentInfo = await mercadopagoService.getPaymentStatus(paymentId);
    if (!paymentInfo) return res.status(200).json({ status: 'unknown' });

    const status = paymentInfo.status; // 'pending', 'approved', 'rejected', etc.
    console.log(`[Check Serverless] Payment ${paymentId} status: ${status}`);

    if (status === 'approved') {
      let raffleId = 'baby_shower_01';
      let ref = null;
      if (paymentInfo.external_reference) {
        try {
          ref = JSON.parse(paymentInfo.external_reference);
          if (ref.raffleId) raffleId = ref.raffleId;
        } catch (e) {
          console.error('[Check Serverless] Fallback parse error:', e.message);
        }
      }

      const txid = String(paymentId);
      const updated = await firebaseAdminService.updateNumberStatusByTxid(raffleId, txid, 'PAID');
      
      if (!updated && ref && Array.isArray(ref.numbers)) {
        try {
          const batch = firebaseAdminService.db.batch();
          for (const num of ref.numbers) {
            const docRef = firebaseAdminService.db.collection('raffles').doc(raffleId).collection('numbers').doc(String(num));
            batch.update(docRef, { status: 'PAID', paidAt: new Date().toISOString() });
          }
          await batch.commit();
          console.log(`[Check Serverless] Fallback PAID update for ${ref.numbers.length} numbers`);
        } catch (e) { console.error('[Check Serverless] Fallback error:', e.message); }
      }
      
      await firebaseAdminService.sendPushNotification('💰 Pix Recebido!', 'Pagamento aprovado! Número confirmado.', 'pagamento-confirmado');
    }

    res.status(200).json({ status, approved: status === 'approved' });
  } catch (err) {
    console.error('[Check Serverless] Error:', err.message);
    res.status(500).json({ status: 'error' });
  }
}
