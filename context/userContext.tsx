'use client';
import { createContext, useState, ReactNode } from 'react';

interface UserContextType {
  currentUser: null;
  setCurrentUser: React.Dispatch<React.SetStateAction<null>>;
}

export const UserContext = createContext<UserContextType>({
  setCurrentUser: () => null,
  currentUser: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const value = { currentUser, setCurrentUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
