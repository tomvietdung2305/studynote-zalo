import { atom } from 'jotai';
import type { User, Student, Message, Conversation, Notification } from '@/types';

// Auth atoms
export const currentUserAtom = atom<User | null>(null);

// Student atoms
export const studentsAtom = atom<Student[]>([]);
export const selectedStudentAtom = atom<Student | null>(null);

// Message atoms
export const conversationsAtom = atom<Conversation[]>([]);
export const selectedConversationAtom = atom<Conversation | null>(null);
export const messagesAtom = atom<Message[]>([]);

// Notification atoms
export const notificationsAtom = atom<Notification[]>([]);

// Loading/Error atoms
export const loadingAtom = atom(false);
export const errorAtom = atom<Error | null>(null);
