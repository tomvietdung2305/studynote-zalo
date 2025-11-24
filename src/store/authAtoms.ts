import { atom } from 'jotai';

export interface User {
    id: string;
    name: string;
    avatar: string;
}

// Auth state
export const isAuthenticatedAtom = atom<boolean>(false);
export const currentUserAtom = atom<User | null>(null);
export const authTokenAtom = atom<string | null>(null);
