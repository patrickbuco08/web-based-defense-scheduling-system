import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../api';
import { ProfileUpdateData, ProfileUpdateResponse } from '../types';
import { toast } from 'sonner';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<ProfileUpdateResponse, Error, ProfileUpdateData>({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success('Profile updated successfully!');
      // Invalidate user data queries to refetch updated user info
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}
