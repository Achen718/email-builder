'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

const DisplayEmailEditor = dynamic(
  () => import('@/components/EmailEditor/DisplayEmailEditor'),
  { ssr: false }
);

const TemplatesIdPage = () => {
  const params = useParams();
  const templateId = params.id as string;

  return <DisplayEmailEditor templateId={templateId} />;
};

export default TemplatesIdPage;
