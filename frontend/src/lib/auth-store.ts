import { create } from 'zustand';
import { api, setUnauthorizedHandler, STORAGE_TOKEN_KEY } from './api';
import type { User } from '@/types/api';

const USER_KEY = 'kilo.user';

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  register: (input: {
    email: string;
    password: string;
    displayName: string;
  }) => Promise<User>;
  logout: () => void;
  setUser: (u: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  status: 'idle',

  hydrate: async () => {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);
    if (!token) {
      set({ status: 'unauthenticated', token: null, user: null });
      return;
    }
    if (userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        set({ user, token, status: 'authenticated' });
      } catch {
        /* ignore */
      }
    }
    try {
      const me = await api.auth.me();
      localStorage.setItem(USER_KEY, JSON.stringify(me));
      set({ user: me, token, status: 'authenticated' });
    } catch {
      get().logout();
    }
  },

  login: async (email, password) => {
    set({ status: 'loading' });
    const { token, user } = await api.auth.login(email, password);
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user, status: 'authenticated' });
    return user;
  },

  register: async (input) => {
    set({ status: 'loading' });
    const { token, user } = await api.auth.register(input);
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user, status: 'authenticated' });
    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ token: null, user: null, status: 'unauthenticated' });
  },

  setUser: (u) => {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    set({ user: u });
  },
}));

setUnauthorizedHandler(() => {
  useAuthStore.getState().logout();
});

export function hasRole(
  user: User | null,
  roles: Array<User['role']>,
): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}
