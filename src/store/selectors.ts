import { atom } from 'jotai';
import { messagesAtom, conversationsAtom, notificationsAtom } from './atoms';

// Derived atoms - selectors
export const unreadMessagesCountAtom = atom((get) => {
  const conversations = get(conversationsAtom);
  return conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
});

export const unreadNotificationsCountAtom = atom((get) => {
  const notifications = get(notificationsAtom);
  return notifications.filter((n) => !n.read).length;
});

export const sortedConversationsAtom = atom((get) => {
  const conversations = get(conversationsAtom);
  return [...conversations].sort((a, b) => {
    const aTime = a.lastMessageTime || 0;
    const bTime = b.lastMessageTime || 0;
    return bTime - aTime;
  });
});

export const sortedNotificationsAtom = atom((get) => {
  const notifications = get(notificationsAtom);
  return [...notifications].sort((a, b) => b.timestamp - a.timestamp);
});
