'use client';
import { useItems } from '@hooks';
import TemplatesCardContainer from '@/components/templates/TemplatesCardContainer';
import Loading from '@/components/ui/Loading';

const TemplatesPage = () => {
  const { items: templates, loading, error, refetch } = useItems('templates');

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-10'>
        <div className='w-20 h-20 mb-4 text-blue-500'>
          <Loading />
        </div>
        <h3 className='text-lg font-medium mb-4'>Loading Templates</h3>
      </div>
    );
  }

  if (error) return <div>Error loading templates: {error.message}</div>;

  if (templates.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-10'>
        <div className='flex flex-col items-center justify-center py-10'>
          <div className='w-20 h-20 mb-4 text-blue-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium mb-4'>No Templates Found</h3>
          <p className='text-gray-500 mb-6 text-center max-w-md'>
            We're setting up your default templates. This usually takes less
            than a minute.
          </p>
          <button
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
            onClick={() => refetch()}
          >
            Check Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className='templates-home-container'>
      <TemplatesCardContainer templates={templates} />
    </section>
  );
};

export default TemplatesPage;
