import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCr6z-NKhfkeLGvpU2cYMndxMntBgeaZKQ',
  authDomain: 'email-builder-db-d4d78.firebaseapp.com',
  projectId: 'email-builder-db-d4d78',
  storageBucket: 'email-builder-db-d4d78.firebasestorage.app',
  messagingSenderId: '870827994059',
  appId: '1:870827994059:web:10c3a650a0b31f6a46e44e',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
