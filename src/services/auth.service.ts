import { api } from './api';
import { User } from '@/types';

export const authService = {
  // Get current user profile
  getCurrentUser(): Promise<User> {
    return api.get<User>('/auth/profile');
  },

  // Logout
  logout(): Promise<void> {
    return api.post<void>('/auth/logout', {});
  },

  // Verify token
  verifyToken(): Promise<boolean> {
    return api.get<boolean>('/auth/verify');
  },
};
