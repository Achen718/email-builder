'use client';
import DisplayEmailEditor from '@/components/EmailEditor/DisplayEmailEditor';

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
