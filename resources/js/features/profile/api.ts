import { ProfileUpdateData, ProfileUpdateResponse, User } from './types';

export async function updateProfile(data: ProfileUpdateData): Promise<ProfileUpdateResponse> {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update profile');
  }

  return response.json();
}

export function useProfile() {
  return {
    updateProfile
  };
}
