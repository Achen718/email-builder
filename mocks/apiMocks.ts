interface Template {
  id: string;
  name: string;
  displayMode: string;
  updatedAt: string;
}

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
  // Add more mock templates as needed
];

export const fetchMockTemplates = (): Promise<Template[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTemplates);
    }, 500);
  });
};
