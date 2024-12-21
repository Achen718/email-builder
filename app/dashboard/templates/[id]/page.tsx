'use client';
import DisplayEmailEditor from '@/components/EmailEditor/DisplayEmailEditor';

import { fetchMockTemplates } from '@/mocks/apiMocks';
import { Template } from '@/types/templates';
interface Params {
  id: string;
}

export async function generateStaticParams() {
  const templates: Template[] = await fetchMockTemplates();
  return templates.map((template) => ({
    id: template.id,
  }));
}

const TemplatesIdPage = ({ params }: { params: Params }) => {
  const templateId = params.id;

  return (
    <>
      <DisplayEmailEditor templateId={templateId} />
    </>
  );
};

export default TemplatesIdPage;
