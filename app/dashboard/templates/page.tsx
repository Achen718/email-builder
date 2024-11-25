'use client';
import { useEffect, useState } from 'react';
import TemplatesCardContainer from 'components/templates/TemplatesCardContainer';
import { fetchMockTemplates } from '@/mocks/apiMocks';

interface Template {
  id: string;
  name: string;
  displayMode: string;
  updatedAt: string;
}

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
    <section className='dashboard-home-container'>
      {/* wrap protected routes */}
      <TemplatesCardContainer templates={templates} />
    </section>
  );
};

export default TemplatesPage;
