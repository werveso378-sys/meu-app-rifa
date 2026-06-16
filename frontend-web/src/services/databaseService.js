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
      callback(docSnap.data());
    } else {
      callback({
        totalNumbers: 100,
        pixPrice: 40.0
      });
    }
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
  });
};
