import { useState, useEffect } from 'react';
import { fetchMockTemplates, fetchMockDesignsList } from '@/mocks/apiMocks';
import { getUserTemplates } from '@/services/firestore/templates-db';
import { getUserDesigns } from '@/services/firestore/designs-db';
import { Template } from '@/types/templates';
import { Design } from '@/types/designs';
import { useAuth } from '@/features/auth/hooks/useAuth';

// Set to true to use mock data for development/testing
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export function useItems(type: 'templates' | 'designs') {
  const [items, setItems] = useState<Template[] | Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser, authLoading } = useAuth();

  useEffect(() => {
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
          // Use mock data for testing/development
          const data =
            type === 'templates'
              ? await fetchMockTemplates()
              : await fetchMockDesignsList(); // You need to import this from apiMocks
          setItems(data);
        } else {
          // Use real Firestore data
          if (!currentUser) {
            throw new Error('User not authenticated');
          }

          const data =
            type === 'templates'
              ? await getUserTemplates(currentUser)
              : await getUserDesigns(currentUser);
          setItems(data);
        }
      } catch (err) {
        console.error(`Error fetching ${type}:`, err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [type, currentUser, authLoading]);

  return { items, loading, error };
}
