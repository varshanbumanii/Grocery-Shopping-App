import { createContext, useContext, ReactNode, Dispatch, SetStateAction } from 'react';
import { User } from '../types';

interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ 
  children, 
  value 
}: { 
  children: ReactNode;
  value: UserContextType;
}) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}