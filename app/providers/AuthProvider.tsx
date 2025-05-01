'use client';
import { ReactNode } from 'react';
import { useAuthStateSync } from '@/hooks/useAuthStateSync';

export function AuthProvider({ children }: { children: ReactNode }) {
  useAuthStateSync(); // Sets up the auth state listener

  return <>{children}</>;
}
