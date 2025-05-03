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

// Save or update a design
export const saveTemplateDesign = async (
  templateId: string,
  design: any,
  metadata: Partial<Design> = {}
): Promise<void> => {
  const templateRef = doc(db, 'designs', templateId);

  await updateDoc(templateRef, {
    design,
    updatedAt: serverTimestamp(),
    ...metadata,
  });
};

// Get all designs for a user
export const getUserDesigns = async (userId: string): Promise<Design[]> => {
  const designsQuery = query(
    collection(db, 'designs'),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(designsQuery);
  return snapshot.docs.map((doc) => ({ ...doc.data() } as Design));
};

// Get a design by id
export const getDesignById = async (
  designId: string
): Promise<Design | null> => {
  const designRef = doc(db, 'desgisn', designId);
  const snapshot = await getDoc(designRef);

  if (!snapshot.exists()) return null;
  return { ...snapshot.data() } as Design;
};
