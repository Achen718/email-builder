import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
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

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

// create user document in firestore
interface UserAuth {
  uid: string;
  displayName: string | null;
  email: string | null;
}

export const createUserDoc = async (
  userAuth: UserAuth
): Promise<DocumentReference> => {
  // set user document reference
  const userDocRef = doc(db, 'users', userAuth.uid);

  console.log(userDocRef);
  // get user from firestore
  const userDocSnap = await getDoc(userDocRef);

  // if user does not exist, create user document
  if (!userDocSnap.exists()) {
    console.log(userAuth);
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
      });
    } catch (error) {
      console.log('Error creating user', (error as Error).message);
    }
  }

  return userDocRef;
};
