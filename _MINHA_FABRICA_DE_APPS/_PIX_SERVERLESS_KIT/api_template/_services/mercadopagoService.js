const { MercadoPagoConfig, Payment, PaymentRefund } = require('mercadopago');

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || 'APP_USR-6992101378676109-061112-64aff7c38952c08df0e4e2c4daa8c24d-3171516763' 
});

const paymentClient = new Payment(client);
const refundClient = new PaymentRefund(client);

const createPixPayment = async (amount, customerName, customerWhatsApp, raffleId, numbers) => {
  try {
    const body = {
      transaction_amount: Number(amount),
      description: `Rifa Baby - Números: ${numbers.join(', ')}`,
      payment_method_id: 'pix',
      payer: {
        email: `${customerWhatsApp.replace(/\D/g, '')}@rifababy.com`,
        first_name: customerName,
      },
      external_reference: JSON.stringify({ raffleId, numbers }),
    };

    const result = await paymentClient.create({ body });
    
    return {
      success: true,
      id: result.id,
      qr_code: result.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: result.point_of_interaction.transaction_data.qr_code_base64
    };
  } catch (error) {
    console.error("Erro ao gerar Pix MP:", error);
    return { success: false, error };
  }
};

const getPaymentStatus = async (paymentId) => {
  try {
    const result = await paymentClient.get({ id: paymentId });
    return result;
  } catch (error) {
    console.error("Erro ao buscar pagamento MP:", error);
    return null;
  }
};

const refundPayment = async (paymentId) => {
  try {
    const result = await refundClient.create({ payment_id: paymentId });
    return { success: true, result };
  } catch (error) {
    console.error("Erro ao estornar pagamento MP:", error);
    return { success: false, error };
  }
};

module.exports = {
  createPixPayment,
  getPaymentStatus,
  refundPayment
};
