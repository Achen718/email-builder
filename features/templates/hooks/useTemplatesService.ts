import { useAppSelector } from '@/lib/hooks/hooks';
import {
  createTemplate as dbCreateTemplate,
  deleteTemplate as dbDeleteTemplate,
  getUserTemplates as dbGetUserTemplates,
  getTemplateById as dbGetTemplateById,
  saveTemplateDesign as dbSaveTemplateDesign,
} from '@/services/firestore/templates-db';
import { Template, EmailDesign } from '@/types/templates';

export const useTemplatesService = () => {
  const { currentUser } = useAppSelector((state) => state.auth);

  const ensureAuthenticated = (): string => {
    if (!currentUser?.uid) {
      // Todo: throw a more specific error or handle it differently.
      throw new Error(
        'User is not authenticated. Cannot perform template operation.'
      );
    }
    return currentUser.uid;
  };

  const createTemplate = (templateData: Partial<Template>): Promise<string> => {
    const userId = ensureAuthenticated();
    return dbCreateTemplate(userId, templateData);
  };

  const deleteTemplate = (templateId: string): Promise<void> => {
    const userId = ensureAuthenticated();
    return dbDeleteTemplate(userId, templateId);
  };

  const getUserTemplates = (): Promise<Template[]> => {
    const userId = ensureAuthenticated();
    return dbGetUserTemplates(userId);
  };

  const getTemplateById = (templateId: string): Promise<Template | null> => {
    const userId = ensureAuthenticated();
    return dbGetTemplateById(templateId, userId);
  };

  const saveTemplateDesign = (
    templateId: string,
    design: EmailDesign,
    metadata: Partial<Template> = {}
  ): Promise<void> => {
    const userId = ensureAuthenticated();
    return dbSaveTemplateDesign(userId, templateId, design, metadata);
  };

  return {
    createTemplate,
    deleteTemplate,
    getUserTemplates,
    getTemplateById,
    saveTemplateDesign,
    // ...
    isUserAuthenticated: !!currentUser?.uid,
  };
};
