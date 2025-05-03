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
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client-app';
import { Template } from '@/types/templates';

// Create a new template
export const createTemplate = async (
  templateData: Partial<Template>
): Promise<string> => {
  const templatesRef = collection(db, 'templates');
  const newTemplateRef = doc(templatesRef);

  await setDoc(newTemplateRef, {
    ...templateData,
    id: newTemplateRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return newTemplateRef.id;
};

// Save or update a template design
export const saveTemplateDesign = async (
  templateId: string,
  design: any,
  metadata: Partial<Template> = {}
): Promise<void> => {
  const templateRef = doc(db, 'templates', templateId);

  await updateDoc(templateRef, {
    design,
    updatedAt: serverTimestamp(),
    ...metadata,
  });
};

// Get all templates for a user
export const getUserTemplates = async (userId: string): Promise<Template[]> => {
  const templatesQuery = query(
    collection(db, 'templates'),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(templatesQuery);
  return snapshot.docs.map((doc) => ({ ...doc.data() } as Template));
};

// Get a template by id
export const getTemplateById = async (
  templateId: string
): Promise<Template | null> => {
  const templateRef = doc(db, 'templates', templateId);
  const snapshot = await getDoc(templateRef);

  if (!snapshot.exists()) return null;
  return { ...snapshot.data() } as Template;
};
