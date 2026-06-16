
const mercadopagoService = require('../_services/mercadopagoService');
const firebaseAdminService = require('../_services/firebaseAdminService');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { customerName, customerPhone, numbers, value, raffleId } = req.body;
    
    // Gera o Pix
    const pixData = await mercadopagoService.createPixPayment(value, customerName, customerPhone, raffleId, numbers);
    if (!pixData.success) return res.status(500).json({ success: false, error: 'Erro no Mercado Pago' });
    
    // Gera QR Code
    const qrCodeImage = `data:image/jpeg;base64,${pixData.qr_code_base64}`;
    const txid = String(pixData.id);
    
    // Atualiza Firebase para PENDING_PAYMENT
    for (const num of numbers) {
      await firebaseAdminService.updateNumberStatus(raffleId, num, 'PENDING_PAYMENT', txid, pixData.qr_code);
    }

    // Envia Notificação Push ao Admin (se tiver FcmToken configurado)
    await firebaseAdminService.sendPushNotification(
      '🚨 Nova Reserva!', 
      `${customerName} gerou um Pix para ${numbers.length} número(s).`, 
      'pix-gerado'
    );

    res.status(200).json({ success: true, chargeId: txid, qrCode: qrCodeImage, payload: pixData.qr_code });
  } catch (error) {
    console.error('Erro em /api/pix/create-mp:', error);
    res.status(500).json({ success: false, error: 'Erro interno' });
  }
}
