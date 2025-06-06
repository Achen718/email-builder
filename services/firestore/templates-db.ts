import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
  query,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client-app';
import { Template, EmailDesign } from '@/types/templates';
import { isEmailDesign } from '@/utils/validateEmailDesign';
import { sanitizeDataForFirestore } from '@/utils/sanitizeData';

export const createTemplate = async (
  userId: string,
  templateData: Partial<Template>
): Promise<string> => {
  const templatesRef = collection(db, 'users', userId, 'templates');
  const newTemplateRef = doc(templatesRef);

  await setDoc(newTemplateRef, {
    ...templateData,
    id: newTemplateRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return newTemplateRef.id;
};

export const saveTemplateDesign = async (
  userId: string,
  templateId: string,
  design: EmailDesign,
  metadata: Partial<Template> = {}
): Promise<void> => {
  const templateRef = doc(db, 'users', userId, 'templates', templateId);

  const sanitizedDesign = sanitizeDataForFirestore(design);
  const sanitizedMetadata = sanitizeDataForFirestore(metadata);

  await updateDoc(templateRef, {
    design: sanitizedDesign,
    updatedAt: serverTimestamp(),
    ...sanitizedMetadata,
  });
};

export const getUserTemplates = async (userId: string): Promise<Template[]> => {
  const templatesQuery = query(collection(db, 'users', userId, 'templates'));

  const snapshot = await getDocs(templatesQuery);
  return snapshot.docs.map((doc) => ({ ...doc.data() } as Template));
};

export const getTemplateById = async (
  templateId: string,
  userId: string
): Promise<Template | null> => {
  const templateRef = doc(db, 'users', userId, 'templates', templateId);
  const snapshot = await getDoc(templateRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();

  if (!isEmailDesign(data.design)) {
    console.error('Invalid design structure from Firestore');
    return null;
  }

  return { ...data } as Template;
};

export const deleteTemplate = async (
  userId: string,
  templateId: string
): Promise<void> => {
  const templateRef = doc(db, 'users', userId, 'templates', templateId);
  await deleteDoc(templateRef);
};
