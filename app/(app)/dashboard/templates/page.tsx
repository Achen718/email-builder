'use client';
import { useItems } from '@hooks';
import { ItemsCardContainer } from '@shared/_components';

const TemplatesPage = () => {
  const { items: templates, loading, error } = useItems('templates');

  if (loading) return <div>Loading templates...</div>;
  if (error) return <div>Error loading templates: {error.message}</div>;

  return (
    <section className='templates-home-container'>
      <ItemsCardContainer items={templates} type='templates' />
    </section>
  );
};

export default TemplatesPage;
