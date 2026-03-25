export interface User {
  id: number;
  name: string;
  email: string;
  department?: {
    id: number;
    name: string;
  };
  roles: string[];
  avatar?: string;
}

export interface ProfileUpdateData {
  name: string;
  email: string;
  role?: 'adviser' | 'coordinator';
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  user?: User;
}
