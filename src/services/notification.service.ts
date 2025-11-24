import { api } from './api';
import { Notification } from '@/types';

export const notificationService = {
  // Get all notifications
  getNotifications(): Promise<Notification[]> {
    return api.get<Notification[]>('/notifications');
  },

  // Mark notification as read
  markAsRead(id: string): Promise<void> {
    return api.put<void>(`/notifications/${id}/read`, {});
  },

  // Mark all notifications as read
  markAllAsRead(): Promise<void> {
    return api.put<void>('/notifications/mark-all-read', {});
  },

  // Delete notification
  deleteNotification(id: string): Promise<void> {
    return api.delete<void>(`/notifications/${id}`);
  },
};
