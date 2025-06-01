import { createContext, useContext } from 'react';

export interface NavbarContextType {
  isOpen: boolean;
  onToggle: () => void;
}

export const NavbarContext = createContext<NavbarContextType | null>(null);

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
}
