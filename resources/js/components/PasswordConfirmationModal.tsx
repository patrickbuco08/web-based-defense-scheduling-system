import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Lock } from 'lucide-react';

interface PasswordConfirmationModalProps {
  open: boolean;
  onConfirm: (password: string) => Promise<void>;
  onCancel: () => void;
}

export function PasswordConfirmationModal({
  open,
  onConfirm,
  onCancel,
}: PasswordConfirmationModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleConfirm = async () => {
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setError('');
    setIsVerifying(true);

    try {
      await onConfirm(password);
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Invalid password');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancel = () => {
    setPassword('');
    setError('');
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isVerifying) {
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle>Confirm Your Password</DialogTitle>
          </div>
          <DialogDescription>
            For security purposes, please enter your password to continue with
            this action.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                onKeyDown={handleKeyDown}
                className="pl-9"
                disabled={isVerifying}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isVerifying}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isVerifying || !password.trim()}
          >
            {isVerifying ? 'Verifying...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
