import { collection, doc, onSnapshot, writeBatch } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Escuta as configurações globais da rifa em tempo real.
 * @param {function} callback - Função chamada com as novas configurações.
 * @returns {function} unsubscribe - Função para parar de ouvir.
 */
export const listenToSettings = (callback) => {
  const docRef = doc(db, "settings", "global");
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      callback({
        totalNumbers: Number(data.totalNumbers) || 100,
        pixPrice: Number(data.pixPrice) || 40.0,
        soundsEnabled: data.soundsEnabled,
        popupActive: data.popupActive,
        popupMessage: data.popupMessage || ''
      });
    } else {
      callback({
        totalNumbers: 100,
        pixPrice: 40.0
      });
    }
  }, (error) => {
    console.error("Error fetching settings:", error);
  });
};

/**
 * Escuta os tickets/números da rifa em tempo real.
 * @param {function} callback - Função chamada com a lista de tickets.
 * @returns {function} unsubscribe - Função para parar de ouvir.
 */
export const listenToTickets = (callback) => {
  const colRef = collection(db, "tickets");
  return onSnapshot(colRef, (snapshot) => {
    const tickets = [];
    snapshot.forEach((docSnap) => {
      tickets.push({ id: docSnap.id, ...docSnap.data() });
    });
    callback(tickets);
  }, (error) => {
    console.error("Error fetching tickets:", error);
  });
};

/**
 * Reserva números como MIMO (Fralda + Mimo) diretamente no Firestore.
 * @param {number[]} numbers - Lista de números selecionados.
 * @param {string} customerName - Nome do comprador.
 * @param {string} customerPhone - WhatsApp do comprador.
 */
export const reserveNumbersAsMimo = async (numbers, customerName, customerPhone) => {
  const batch = writeBatch(db);
  
  for (const num of numbers) {
    const docRef = doc(db, "tickets", String(num));
    batch.set(docRef, {
      number: num,
      ownerName: customerName,
      phone: customerPhone,
      paymentType: "MIMO",
      isPaid: false,
    }, { merge: true });
  }

  await batch.commit();
  console.log(`Reserva MIMO salva: ${customerName} - Números: ${numbers.join(', ')}`);

  try {
    // Chama a API da Vercel para disparar a notificação Push
    await fetch('/api/mimo/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName, numbers })
    });
  } catch (error) {
    console.error("Erro ao notificar MIMO:", error);
  }
};
