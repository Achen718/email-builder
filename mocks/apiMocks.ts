import { Template } from '../types/templates';

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Template 1',
    displayMode: 'Mode 1',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Template 2',
    displayMode: 'Mode 2',
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
