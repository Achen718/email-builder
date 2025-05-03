'use client';
import { useItems } from '@hooks';
import { ItemsCardContainer } from '@shared/_components';

const DesignsPage = () => {
  const { items: designs, loading, error } = useItems('designs');

  if (loading) return <div>Loading designs...</div>;
  if (error) return <div>Error loading designs: {error.message}</div>;

  return (
    <section className='designs-home-container'>
      <ItemsCardContainer items={designs} type='designs' />
    </section>
  );
};

export default DesignsPage;
