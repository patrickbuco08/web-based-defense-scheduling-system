import { createContext, useContext } from 'react';

interface SecurityContextType {
  requirePassword: () => Promise<void>;
  isVerifyingPassword: boolean;
}

export const SecurityContext = createContext<SecurityContextType | undefined>(
  undefined
);

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}
