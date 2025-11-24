import { api } from './api';
import { Message, Conversation } from '@/types';

export const messageService = {
  // Get all conversations
  getConversations(): Promise<Conversation[]> {
    return api.get<Conversation[]>('/messages/conversations');
  },

  // Get messages for a conversation
  getConversationMessages(conversationId: string): Promise<Message[]> {
    return api.get<Message[]>(`/messages/conversations/${conversationId}`);
  },

  // Send message
  sendMessage(conversationId: string, content: string, type: string = 'text'): Promise<Message> {
    return api.post<Message>(`/messages/conversations/${conversationId}`, {
      content,
      type,
    });
  },

  // Mark message as read
  markAsRead(messageId: string): Promise<void> {
    return api.put<void>(`/messages/${messageId}/read`, {});
  },

  // Mark all messages in conversation as read
  markConversationAsRead(conversationId: string): Promise<void> {
    return api.put<void>(`/messages/conversations/${conversationId}/read`, {});
  },

  // Get unread count
  getUnreadCount(): Promise<{ count: number }> {
    return api.get<{ count: number }>('/messages/unread-count');
  },
};
