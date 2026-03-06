import React, { useState, useCallback, useRef } from 'react';
import { SecurityContext } from '@/contexts/SecurityContext';
import { PasswordConfirmationModal } from '@/components/PasswordConfirmationModal';

interface SecurityProviderProps {
  children: React.ReactNode;
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const resolverRef = useRef<{
    resolve: () => void;
    reject: (error: Error) => void;
  } | null>(null);

  const requirePassword = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      resolverRef.current = { resolve, reject };
      setIsModalOpen(true);
    });
  }, []);

  const handleConfirm = async (password: string): Promise<void> => {
    try {
      const response = await fetch('/security/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid password');
      }

      setIsModalOpen(false);
      resolverRef.current?.resolve();
      resolverRef.current = null;
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    resolverRef.current?.reject(new Error('Password confirmation cancelled'));
    resolverRef.current = null;
  };

  return (
    <SecurityContext.Provider value={{ requirePassword }}>
      {children}
      <PasswordConfirmationModal
        open={isModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </SecurityContext.Provider>
  );
}
