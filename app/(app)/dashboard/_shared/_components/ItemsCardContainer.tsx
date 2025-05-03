import { Template } from '@/types/templates';
import { Design } from '@/types/designs';
import ItemCard from './ItemCard';

type ItemsCardContainerProps = {
  items: (Template | Design)[];
  type: 'templates' | 'designs';
};

export default function ItemsCardContainer({
  items,
  type,
}: ItemsCardContainerProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} type={type} />
      ))}
    </div>
  );
}
