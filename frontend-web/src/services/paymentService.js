/**
 * Chama a API da Vercel para gerar o pagamento via Mercado Pago e reservar os números.
 * @param {Object} data - Objeto contendo { raffleId, customerName, customerPhone, value, numbers }
 * @returns {Promise<Object>} Resposta da API com qrCode e payload
 */
export const createPixPayment = async (data) => {
  try {
    // Como a API e o frontend estão hospedados no mesmo domínio Vercel, usamos caminho relativo.
    // Durante o dev (localhost), precisaremos apontar para a Vercel real ou configurar proxy.
    const baseUrl = window.location.hostname === "localhost" 
      ? "https://meu-app-rifa.vercel.app" 
      : "";
      
    const response = await fetch(`${baseUrl}/api/pix/create-mp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erro na rede ou servidor");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    return { success: false, error: error.message };
  }
};
