const firebaseAdminService = require('../_services/firebaseAdminService');

module.exports = async (req, res) => {
  // CORS setup
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
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token is required' });
    
    // Save token using Admin SDK bypassing security rules
    const db = firebaseAdminService.db;
    await db.collection('settings').doc('global').set({ fcmToken: token }, { merge: true });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar token no Vercel:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
