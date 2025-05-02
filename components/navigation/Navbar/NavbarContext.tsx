import { createContext, useContext } from 'react';

// Context type definition
export interface NavbarContextType {
  isOpen: boolean;
  onToggle: () => void;
}

// Create the context
export const NavbarContext = createContext<NavbarContextType | null>(null);

// Custom hook to use the context
export function useNavbar() {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
}
