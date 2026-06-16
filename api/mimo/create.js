const firebaseAdminService = require('../_services/firebaseAdminService');
const { FieldValue } = require('firebase-admin/firestore');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { customerName, customerPhone, numbers } = req.body;
    
    const db = firebaseAdminService.db;
    const batch = db.batch();
    
    for (const num of numbers) {
      const docRef = db.collection('tickets').doc(String(num));
      batch.set(docRef, {
        number: num,
        ownerName: customerName,
        phone: customerPhone,
        paymentType: "MIMO",
        isPaid: false,
        status: "sim",
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });
    }

    await batch.commit();

    // Envia Notificação Push ao Admin
    await firebaseAdminService.sendPushNotification(
      '🎁 Reserva de Mimo!', 
      `${customerName} reservou ${numbers.length} número(s) com Fralda + Mimo.`, 
      'pagamento-confirmado' // reusing the nice sound
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro na rota de mimo/create:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
