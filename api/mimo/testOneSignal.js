const oneSignalService = require('../_services/oneSignalService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const result = await oneSignalService.sendNotification("pagamento_aprovado", { customerName: "Teste Mestre", amount: "99,90" });
    return res.status(200).json({ success: true, message: "Push disparado!", result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
