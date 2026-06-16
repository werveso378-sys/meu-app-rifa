const firebaseAdminService = require('../_services/firebaseAdminService');
const oneSignalService = require('../_services/oneSignalService');

module.exports = async (req, res) => {
  // Configuração de CORS para permitir chamadas do frontend
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
    const { customerName, numbers } = req.body;
    
    // Enviar Push via OneSignal
    try {
      await oneSignalService.sendNotification("dia_25", { customerName });
    } catch (e) {
      console.error('Erro push dia 25:', e);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro na rota de mimo/notify:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
