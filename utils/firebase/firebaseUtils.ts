import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { DocumentReference } from 'firebase/firestore';

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

const auth = getAuth(firebaseApp);

// Google Providers
const googleProvider = new GoogleAuthProvider();

// Sign in with google
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

// Sign up with email and password
export const createUserWithEmailAndPasswordHandler = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Firestore start
// create new user document in firestore
export const createUserDoc = async (
  user: User,
  additionalUserData = {}
): Promise<DocumentReference> => {
  // set user document reference
  const userDocRef = doc(db, 'users', user.uid);

  // get user from firestore
  const userDocSnap = await getDoc(userDocRef);

  // if user does not exist, create user document
  if (!userDocSnap.exists()) {
    const { displayName, email } = user;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalUserData,
      });
    } catch (error) {
      console.log('Error creating user', (error as Error).message);
    }
  }

  return userDocRef;
};
