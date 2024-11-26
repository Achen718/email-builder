'use client';
import { useEffect, useState } from 'react';
import DisplayEmailEditor from '@/components/EmailEditor/DisplayEmailEditor';

interface Params {
  id: string;
}

const TemplatesIdPage = ({ params }: { params: Params }) => {
  const templateId = params.id;

  return (
    <section>
      <DisplayEmailEditor templateId={templateId} />
    </section>
  );
};

export default TemplatesIdPage;
