import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
  query,
  where,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client-app';
import { Design } from '@/types/designs';
import { EmailDesign } from '@/types/templates';
import { isEmailDesign } from '@/utils/validateEmailDesign';

export const createDesign = async (
  designData: Partial<Design>
): Promise<string> => {
  const designsRef = collection(db, 'designs');
  const newDesignRef = doc(designsRef);

  await setDoc(newDesignRef, {
    ...designData,
    id: newDesignRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return newDesignRef.id;
};

export const saveDesignContent = async (
  designId: string,
  design: EmailDesign,
  metadata: Partial<Design> = {}
): Promise<void> => {
  if (!isEmailDesign(design)) {
    throw new Error('Invalid email design structure');
  }

  const designRef = doc(db, 'designs', designId);
  await updateDoc(designRef, {
    design,
    updatedAt: serverTimestamp(),
    ...metadata,
  });
};

export const getUserDesigns = async (userId: string): Promise<Design[]> => {
  const designsQuery = query(
    collection(db, 'designs'),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(designsQuery);
  return snapshot.docs.map((doc) => ({ ...doc.data() } as Design));
};

export const getDesignById = async (
  designId: string
): Promise<Design | null> => {
  const designRef = doc(db, 'designs', designId);
  const snapshot = await getDoc(designRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  if (!isEmailDesign(data.design)) {
    console.error('Invalid design structure from Firestore');
    return null;
  }

  return { ...data } as Design;
};
