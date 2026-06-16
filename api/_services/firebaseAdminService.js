const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');

let db;

try {
  // Em Serverless, os apps são cacheados e não devem ser reinicializados a cada request
  if (!getApps().length) {
    let serviceAccount = null;
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      initializeApp({
        credential: cert(serviceAccount)
      });
    } else {
      console.warn('Aviso: FIREBASE_SERVICE_ACCOUNT não está definido.');
      initializeApp(); // Inicialização padrão do Firebase
    }
  }
  
  db = getFirestore();
  console.log('Firebase Admin inicializado/reaproveitado com sucesso.');
} catch (error) {
  console.error('Erro crítico ao inicializar Firebase Admin:', error);
}

/**
 * Atualiza o status de um número na Rifa (Usado quando gerar o Pix e quando pagar)
 */
async function updateNumberStatus(raffleId, number, status, transactionId, pixPayload = null, customerName = null, customerPhone = null) {
  try {
    const docRef = db.collection('tickets').doc(String(number));
    
    const updateData = {
      isPaid: status === 'PAID',
      status: status === 'PAID' ? 'pago' : 'pendente',
      paymentType: 'PIX',
      transactionId: transactionId,
      updatedAt: FieldValue.serverTimestamp()
    };
    if (pixPayload) updateData.pixPayload = pixPayload;
    if (customerName) updateData.ownerName = customerName;
    if (customerPhone) updateData.phone = customerPhone;

    await docRef.set(updateData, { merge: true });

    console.log(`Sucesso: Número ${number} atualizado para status ${status}`);
    return true;
  } catch (error) {
    console.error(`Erro ao atualizar número ${number}:`, error);
    return false;
  }
}

/**
 * Atualiza múltiplos números de uma vez com base no TXID do Pix
 * (Usado pelo Webhook do BACEN quando o pagamento é confirmado)
 */
async function updateNumberStatusByTxid(raffleId, txid, newStatus) {
  try {
    const numbersRef = db.collection('tickets');
    const snapshot = await numbersRef.where('transactionId', '==', txid).get();

    if (snapshot.empty) {
      console.log(`Nenhum número encontrado para o TXID ${txid}`);
      return false;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { 
        isPaid: newStatus === 'PAID',
        status: newStatus === 'PAID' ? 'pago' : 'pendente',
        paidAt: FieldValue.serverTimestamp()
      });
    });
    
    await batch.commit();
    console.log(`Pagamento confirmado! ${snapshot.size} número(s) atualizado(s) para PAID pelo TXID ${txid}`);
    return true;

  } catch (error) {
    console.error('Erro ao processar Webhook no Firestore:', error);
    return false;
  }
}

async function sendPushNotification(title, body, soundType = 'default') {
  try {
    const settingsDoc = await db.collection('settings').doc('global').get();
    if (!settingsDoc.exists) return;
    
    const token = settingsDoc.data().fcmToken;
    if (!token) return;

    let channelId = 'rifas_vendas';
    let soundFile = 'default';
    
    if (soundType === 'pagamento-confirmado') {
        channelId = 'venda_confirmada';
        soundFile = 'som_venda_confirmada';
    } else if (soundType === 'pix-gerado') {
        channelId = 'pix_pendente';
        soundFile = 'som_pix_gerado';
    }

    const message = {
      android: {
        priority: 'high'
      },
      data: {
        title: title,
        body: body,
        soundType: soundType
      },
      token: token
    };

    await getMessaging().send(message);
    console.log(`Push notification enviada: ${title}`);
  } catch (error) {
    console.error('Erro ao enviar push notification:', error);
  }
}

module.exports = {
  db,
  updateNumberStatus,
  updateNumberStatusByTxid,
  sendPushNotification
};
