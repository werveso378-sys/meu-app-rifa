// O fetch global já é nativo no Node.js 18+ da Vercel. Não precisamos de dependência externa.

const APP_ID = process.env.ONESIGNAL_APP_ID || "daf93ecb-9440-49fa-ab0a-f3c74f219f75";
const REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY || "os_v2_app_3l4t5s4uibe7vkyk6pdu6im7ox7zmcqj3xhu2dny3ry2mqgfqe2ex7t2iit7qldmhgar5sv3t7qwo42y4qbi2giydhrlj57mpzgho3y";

/**
 * Envia notificação OneSignal
 * @param {string} templateId - O tipo da notificação (ex: "pix_gerado", "mimo_reservado")
 * @param {object} payloadData - Variáveis extras
 */
async function sendNotification(templateId, payloadData = {}) {
  let heading = "Nova Notificação!";
  let content = "Teste";
  let largeIcon = "https://meu-app-rifa.vercel.app/bear_logo.png";
  let accentColor = "FF3A4B3C"; // Verde Lodo ARGB
  let type = "";
  let androidSound = "notification";
  let androidChannelId = "rifas_vendas";

  const nome = payloadData.customerName || 'Cliente';
  const valor = payloadData.amount ? String(payloadData.amount).replace('.', ',') : '0,00';
  const qtd = payloadData.quantity || 1;

  switch (templateId) {
    case "pix_gerado":
      heading = "⏳ Pix Gerado!";
      content = `R$ ${valor} - ${qtd} número(s) reservados para ${nome}. Pague em 5 min!`;
      type = "Pix Gerado";
      androidSound = "som_pix_gerado";
      androidChannelId = "pix_pendente";
      break;
    case "pagamento_aprovado":
      heading = "✅ CAIU!";
      content = `R$ ${valor} recebido de ${nome}. Comprou ${qtd} número(s)!`;
      type = "Aprovado";
      androidSound = "som_venda_confirmada";
      androidChannelId = "venda_confirmada";
      break;
    case "mimo_reservado":
      heading = "🧸 Mimo Reservado!";
      content = `Reserva de Mimo realizada por ${nome}!`;
      type = "Mimo";
      break;
    case "dia_25":
      heading = "🎁 Reserva Dia 25!";
      content = `Reserva para Dia 25 realizada por ${nome}.`;
      type = "Dia25";
      break;
  }

  try {
    const globalFetch = globalThis.fetch || fetch;
    const response = await globalFetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${REST_API_KEY}`
      },
      body: JSON.stringify({
        app_id: APP_ID,
        included_segments: ["Total Subscriptions", "Subscribed Users", "Active Users"],
        headings: { "en": heading },
        contents: { "en": content },
        data: { type, ...payloadData }, 
        large_icon: largeIcon,
        android_accent_color: accentColor,
        android_sound: androidSound,
        android_channel_id: androidChannelId
      })
    });

    const responseData = await response.json();
    console.log("OneSignal Response:", responseData);
    return responseData;
  } catch (error) {
    console.error("Erro ao enviar notificação OneSignal:", error);
    return { error: error.message };
  }
}

module.exports = {
  sendNotification
};
