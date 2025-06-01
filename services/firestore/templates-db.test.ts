import {
  createTemplate,
  saveTemplateDesign,
  getUserTemplates,
  getTemplateById,
  deleteTemplate,
} from '@/services/firestore/templates-db';
import { db } from '@/lib/firebase/client-app';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  deleteDoc,
} from 'firebase/firestore';
import { EmailDesign } from '@/types/templates';

jest.mock('@/utils/validateEmailDesign', () => ({
  isEmailDesign: jest.fn().mockReturnValue(true),
}));

jest.mock('@/lib/firebase/client-app', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => {
  const mockDocSnapshot = {
    exists: jest.fn().mockReturnValue(true),
    data: jest.fn().mockReturnValue({
      id: 'test-template-456',
      name: 'Test Template',
      design: { body: { rows: [] } },
    }),
  };

  const mockQuerySnapshot = {
    docs: [
      { data: () => ({ id: 'template1', name: 'Template 1' }) },
      { data: () => ({ id: 'template2', name: 'Template 2' }) },
    ],
  };

  return {
    collection: jest.fn(),
    doc: jest.fn().mockReturnValue({ id: 'mocked-document-id' }),
    setDoc: jest.fn().mockResolvedValue({}),
    updateDoc: jest.fn().mockResolvedValue({}),
    getDoc: jest.fn().mockResolvedValue(mockDocSnapshot),
    getDocs: jest.fn().mockResolvedValue(mockQuerySnapshot),
    query: jest.fn().mockImplementation((collectionRef) => collectionRef),
    serverTimestamp: jest.fn().mockReturnValue('timestamp'),
    deleteDoc: jest.fn().mockResolvedValue({}),
  };
});

describe('Template Database Operations', () => {
  const userId = 'test-user-123';
  const templateId = 'test-template-456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createTemplate should create a new template document', async () => {
    const templateData = { name: 'New Template' };
    const result = await createTemplate(userId, templateData);

    expect(collection).toHaveBeenCalledWith(db, 'users', userId, 'templates');
    expect(doc).toHaveBeenCalled();
    expect(setDoc).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  test('getUserTemplates should return all user templates', async () => {
    const templates = await getUserTemplates(userId);

    expect(collection).toHaveBeenCalledWith(db, 'users', userId, 'templates');
    expect(query).toHaveBeenCalled();
    expect(getDocs).toHaveBeenCalled();
    expect(templates).toHaveLength(2);
    expect(templates[0].name).toBe('Template 1');
  });

  test('getTemplateById should return a specific template', async () => {
    const template = await getTemplateById(templateId, userId);
    console.log(template);
    expect(doc).toHaveBeenCalledWith(
      db,
      'users',
      userId,
      'templates',
      templateId
    );
    expect(getDoc).toHaveBeenCalled();
    expect(template).toHaveProperty('name', 'Test Template');
  });

  test('saveTemplateDesign should update template design', async () => {
    const design = {
      body: {
        id: 'mock-body-id',
        headers: [],
        footers: [],
        rows: [
          {
            id: 'mock-row-id',
            columns: [],
            cells: [1],
            values: {},
          },
        ],
        values: {},
      },
      counters: {
        u_row: 1,
        u_column: 1,
      },
      schemaVersion: 1,
    } as EmailDesign;

    await saveTemplateDesign(userId, templateId, design);

    expect(doc).toHaveBeenCalledWith(
      db,
      'users',
      userId,
      'templates',
      templateId
    );
    expect(updateDoc).toHaveBeenCalled();
    expect(updateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        design,
        updatedAt: 'timestamp',
      })
    );
  });

  test('deleteTemplate should remove a template', async () => {
    await deleteTemplate(userId, templateId);

    expect(doc).toHaveBeenCalledWith(
      db,
      'users',
      userId,
      'templates',
      templateId
    );
    expect(deleteDoc).toHaveBeenCalled();
  });
});
