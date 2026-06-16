const mercadopagoService = require('../_services/mercadopagoService');
const firebaseAdminService = require('../_services/firebaseAdminService');
const oneSignalService = require('../_services/oneSignalService');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const body = req.body;
    const isPaymentEvent = body.type === 'payment' || (body.action && String(body.action).includes('payment'));
    if (!isPaymentEvent) return res.status(200).send('Event Ignored');

    const paymentId = body.data?.id;
    if (!paymentId) return res.status(200).send('Missing ID');

    const paymentInfo = await mercadopagoService.getPaymentStatus(paymentId);
    console.log('[Webhook MP Serverless] Status:', paymentInfo?.status, '| Payer:', paymentInfo?.payer?.first_name);

    if (paymentInfo && paymentInfo.status === 'approved') {
      let raffleId = 'baby_shower_01';
      let ref = null;
      if (paymentInfo.external_reference) {
        try {
          ref = JSON.parse(paymentInfo.external_reference);
          if (ref.raffleId) raffleId = ref.raffleId;
        } catch (e) {
          console.error('[Webhook MP Serverless] Fallback parse error:', e.message);
        }
      }

      const txid = String(paymentId);
      const updated = await firebaseAdminService.updateNumberStatusByTxid(raffleId, txid, 'PAID');

      if (!updated && ref && Array.isArray(ref.numbers)) {
        try {
          const batch = firebaseAdminService.db.batch();
          for (const num of ref.numbers) {
            const docRef = firebaseAdminService.db.collection('tickets').doc(String(num));
            batch.update(docRef, { isPaid: true, paidAt: new Date().toISOString() });
          }
          await batch.commit();
          console.log(`[Webhook MP Serverless] ✅ Fallback: números marcados como PAID via external_reference`);
        } catch (e) {
          console.error('[Webhook MP Serverless] Fallback write error:', e.message);
        }
      }

      // Notificação Push OneSignal
      const name = paymentInfo.payer?.first_name || 'Cliente';
      const amount = (paymentInfo.transaction_amount || 0).toFixed(2).replace('.', ',');
      try {
        await oneSignalService.sendNotification("pagamento_aprovado", { customerName: name, amount });
        console.log('[Webhook MP] Notificação Push OneSignal enviada com sucesso');
      } catch (e) {
        console.error('[Webhook MP] Erro ao enviar push OneSignal:', e);
      }

      // Automação WhatsApp (Disparo de recibo)
      const phoneRaw = paymentInfo.payer?.email?.split('@')[0] || '';
      if (phoneRaw && phoneRaw.length >= 10) {
        const phoneFormatted = phoneRaw.startsWith('55') ? phoneRaw : `55${phoneRaw}`;
        const whatsappMessage = `Olá ${name}! Seu pagamento de R$ ${amount} foi confirmado e seus números da Chá Rifa Baby estão garantidos! Obrigado pela colaboração 🎉`;
        
        try {
          // TODO: Substitua a URL abaixo pela sua API real de WhatsApp (Ex: Z-API, Evolution, CallMeBot)
          // await fetch('https://sua-api-whatsapp.com/send-message', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ phone: phoneFormatted, message: whatsappMessage })
          // });
          console.log(`[Webhook MP] 🟢 WhatsApp PRONTO para enviar para ${phoneFormatted}: ${whatsappMessage}`);
        } catch (err) {
          console.error('[Webhook MP] Erro ao enviar WhatsApp:', err.message);
        }
      }
    }
    
    // Retorna OK para o MP no final
    return res.status(200).send('OK');
  } catch (error) {
    console.error('[Webhook MP Serverless] Erro:', error.message);
    return res.status(500).send('Internal Server Error');
  }
}
