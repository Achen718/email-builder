'use client';
import { useEffect, ReactNode } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  useLazyCheckTemplatesQuery,
  useSyncDefaultTemplatesMutation,
} from '@/features/templates/templates-api';
import { useAuthStateSync } from '@/features/auth/hooks/useAuthStateSync';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser, authLoading } = useAuth();
  const [checkTemplates] = useLazyCheckTemplatesQuery();
  const [syncTemplates] = useSyncDefaultTemplatesMutation();

  useAuthStateSync();

  useEffect(() => {
    const handleTemplateSync = async () => {
      if (!authLoading && currentUser) {
        try {
          // Only triggers API call when executed
          const result = await checkTemplates().unwrap();

          if (result?.needsTemplateSync) {
            await syncTemplates().unwrap();
          }
        } catch (error) {
          console.error('Template sync error:', error);
        }
      }
    };

    // handleTemplateSync();
  }, [currentUser, authLoading, checkTemplates, syncTemplates]);

  return <>{children}</>;
};

export default AuthProvider;
