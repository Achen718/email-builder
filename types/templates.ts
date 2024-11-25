export interface Template {
  id: string;
  name: string;
  displayMode: string;
  updatedAt: string;
}

export interface TemplatesCardContainerProps {
  templates: Template[];
}
