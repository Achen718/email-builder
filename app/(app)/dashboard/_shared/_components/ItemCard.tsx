import Link from 'next/link';
import Image from 'next/image';
import { Template } from '@/types/templates';
import { Design } from '@/types/designs';
import { formatDate } from '@/utils/formatDate';

type ItemCardProps = {
  item: Template | Design;
  type: 'templates' | 'designs';
};

export default function ItemCard({ item, type }: ItemCardProps) {
  const href = `/${type}/${item.id}`;

  return (
    <div className='bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow'>
      <div className='relative h-48 w-full'>
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={item.name}
            fill
            className='object-cover'
          />
        ) : (
          <div className='w-full h-full bg-muted flex items-center justify-center'>
            <span className='text-muted-foreground'>No preview</span>
          </div>
        )}
      </div>

      <div className='p-4'>
        <h3 className='font-medium text-lg mb-1'>{item.name}</h3>
        <p className='text-muted-foreground text-sm mb-3 line-clamp-2'>
          {item.description || 'No description'}
        </p>

        <div className='flex justify-between items-center'>
          <span className='text-xs text-muted-foreground'>
            {formatDate(item.createdAt)}
          </span>

          <Link
            href={href}
            className='px-4 py-1.5 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90'
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}
