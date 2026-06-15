import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from './firebaseClientConfig'; // Substitua pelo arquivo de init do seu app novo

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const loginAdmin = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
         throw new Error(error.message);
    }
};

export const logoutAdmin = async () => {
    await signOut(auth);
};

export const listenToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
};
