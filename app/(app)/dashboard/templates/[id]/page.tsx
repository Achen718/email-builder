import DisplayEmailEditor from '@/components/EmailEditor/DisplayEmailEditor';

import { fetchMockTemplates } from '@/mocks/apiMocks';
import { Template } from '@/types/templates';
interface Params {
  id: string;
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
