import { useState, useEffect } from 'react';
import { fetchMockTemplates, fetchMockDesignsList } from '@/mocks/apiMocks';
import { getUserTemplates } from '@/services/firestore/templates-db';
import { getUserDesigns } from '@/services/firestore/designs-db';
import { Template } from '@/types/templates';
import { Design } from '@/types/designs';
import { useAuth } from '@/features/auth/hooks/useAuth';

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

type ItemsType<T> = T extends 'templates'
  ? Template[]
  : T extends 'designs'
  ? Design[]
  : never;

export function useItems<T extends 'templates' | 'designs'>(type: T) {
  const [items, setItems] = useState<unknown>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser, authLoading } = useAuth();

  const fetchItems = async () => {
    if (authLoading) return;

    if (!currentUser) {
      setError(new Error('User not authenticated'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      if (USE_MOCKS) {
        if (type === 'templates') {
          const templates = await fetchMockTemplates();
          setItems(templates as unknown);
        } else {
          const designs = await fetchMockDesignsList();
          setItems(designs as unknown);
        }
      } else {
        if (!currentUser) {
          throw new Error('User not authenticated');
        }
        if (type === 'templates') {
          const templates = await getUserTemplates(currentUser.uid);
          setItems(templates as unknown);
        } else {
          const designs = await getUserDesigns(currentUser.uid);
          setItems(designs as unknown);
        }
      }
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchItems();
  }, [type, currentUser, authLoading]);

  const refetch = () => {
    fetchItems();
  };

  const typedReturn = {
    items: items as ItemsType<T>,
    loading,
    error,
    refetch,
  };

  return typedReturn;
}
