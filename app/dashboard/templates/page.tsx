'use client';
import { useEffect, useState } from 'react';
import TemplatesCardContainer from 'components/templates/TemplatesCardContainer';
import { fetchMockTemplates } from '@/mocks/apiMocks';
import { Template } from '@/types/templates';

const TemplatesPage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const data = await fetchMockTemplates();
      setTemplates(data);
    };

    fetchTemplates();
  }, []);

  return (
    <section className='templates-home-container'>
      {/* wrap protected routes */}
      <TemplatesCardContainer templates={templates} />
    </section>
  );
};

export default TemplatesPage;
