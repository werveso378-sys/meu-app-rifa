import { collection, doc, onSnapshot } from "firebase/firestore";
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
        pixPrice: Number(data.pixPrice) || 40.0
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
