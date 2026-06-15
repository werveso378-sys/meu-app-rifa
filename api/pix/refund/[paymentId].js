const mercadopagoService = require('../../../_services/mercadopagoService');
const firebaseAdminService = require('../../../_services/firebaseAdminService');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { paymentId } = req.query;
    const { raffleId, numbers } = req.body;

    // Refund no Mercado Pago
    const refundResult = await mercadopagoService.refundPayment(paymentId);
    if (!refundResult.success) {
      return res.status(500).json({ success: false, error: 'Erro ao estornar no Mercado Pago' });
    }

    // Cancelar reserva no Firebase
    if (raffleId && numbers && Array.isArray(numbers)) {
      const batch = firebaseAdminService.db.batch();
      for (const num of numbers) {
        const docRef = firebaseAdminService.db.collection('raffles').doc(raffleId).collection('numbers').doc(String(num));
        batch.update(docRef, { status: 'CANCELED', isCanceled: true });
      }
      await batch.commit();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro /api/pix/refund:', error.message);
    res.status(500).json({ success: false, error: 'Erro interno' });
  }
}
