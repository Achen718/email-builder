import { Template } from '../types/templates';
import emailDesignMock from './designs/emailDesignMock.json'; // Import your large JSON object
import mockDesign from './designs/mockDesign.json'; // Import your large JSON object

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Sample Template 1',
    design: mockDesign,
    displayMode: 'Mode 1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    design: emailDesignMock,
    name: 'Template 2',
    displayMode: 'Mode 2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Template 3',
    displayMode: 'Mode 3',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Template 4 Template 4',
    displayMode: 'Mode 4',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Template 5',
    displayMode: 'Mode 5',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Template 6',
    displayMode: 'Mode 6',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Template 7',
    displayMode: 'Mode 7',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Template 8',
    displayMode: 'Mode 8',
    updatedAt: new Date().toISOString(),
  },
  // Add more mock templates as needed
];

export const fetchMockTemplates = (): Promise<Template[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTemplates);
    }, 500);
  });
};

export const fetchMockDesign = async (templateId: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const template = mockTemplates.find((t) => t.id === templateId);
      resolve(template ? template.design : null);
    }, 500);
  });
};

export const saveMockDesign = async (
  templateId: string,
  design: any
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
