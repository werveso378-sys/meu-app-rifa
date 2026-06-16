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
  try {
    const response = await fetch('https://meu-app-rifa.vercel.app/api/mimo/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName, customerPhone, numbers })
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    console.log(`Reserva MIMO salva com sucesso via Vercel: ${customerName} - Números: ${numbers.join(', ')}`);
  } catch (error) {
    console.error("Erro ao salvar MIMO via Vercel:", error);
  }
};
