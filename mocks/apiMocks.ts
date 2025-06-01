import { Template, EmailDesign } from '../types/templates';
import { Design } from '@/types/designs';
import mockDesign from './designs/mockDesign.json' assert { type: 'json' };
import emailDesignMock from './designs/emailDesignMock.json' assert { type: 'json' };

const typedMockDesign = mockDesign as unknown as EmailDesign;
const typedEmailDesignMock = emailDesignMock as unknown as EmailDesign;

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Sample Template 1',
    design: typedMockDesign,
    displayMode: 'Mode 1',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    design: typedEmailDesignMock,
    name: 'Template 2',
    displayMode: 'Mode 2',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export const fetchMockTemplates = (): Promise<Template[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTemplates);
    }, 500);
  });
};

export const fetchMockDesignsList = async (): Promise<Design[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockDesigns = mockTemplates.map((template) => ({
        id: `design_${template.id}`,
        name: `Design from ${template.name}`,
        description: `Design created from ${template.name}`,
        thumbnail: '',
        templateId: template.id,
        userId: 'mock-user-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        design: template.design,
        status: 'draft' as const,
      }));

      resolve(mockDesigns);
    }, 500);
  });
};

export const fetchMockDesigns = async (templateId: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const template = mockTemplates.find((t) => t.id === templateId);
      resolve(template ? template.design : null);
    }, 500);
  });
};

export const saveMockDesign = async (
  templateId: string,
  design: EmailDesign
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const template = mockTemplates.find((t) => t.id === templateId);
      if (template) {
        template.design = design;
        template.updatedAt = new Date().toISOString();
      }
      resolve();
    }, 500);
  });
};
