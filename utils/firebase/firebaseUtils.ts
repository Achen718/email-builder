import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { DocumentReference } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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

// Get Currently signed in user
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (userAuth) => {
        console.log(unsubscribe);
        unsubscribe();
        resolve(userAuth);
      },
      reject
    );
  });
};

// Sign up with email and password
export const createUserWithEmailAndPasswordHandler = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};
//  sign in with email and password
export const signInWithEmailAndPasswordHandler = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
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
