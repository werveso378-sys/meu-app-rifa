import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxZCfrGnZftyQdXbr117T_bXcDTBrbPzI",
  projectId: "rifababygo",
  storageBucket: "rifababygo.firebasestorage.app",
  messagingSenderId: "931597096048",
  appId: "1:931597096048:web:1234567890abcdef" // Dummy web app ID since we don't have the explicit web one, usually it just needs project config for simple DB reads
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
