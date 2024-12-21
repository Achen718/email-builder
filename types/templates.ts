export interface Template {
  id: string;
  name: string;
  displayMode: string;
  updatedAt: string;
  design?: any; // Remove after adding database
}

export interface TemplatesCardContainerProps {
  templates: Template[];
}
