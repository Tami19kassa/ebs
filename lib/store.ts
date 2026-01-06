import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MediaItem } from '@/data/cms';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (user: UserProfile) => void;
  logout: () => void;
  
  // Watchlist
  watchlist: MediaItem[];
  addToWatchlist: (item: MediaItem) => void;
  removeFromWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;

  // UI Overlays
  isAuthModalOpen: boolean;
  isSearchOpen: boolean;
  toggleAuthModal: (open: boolean) => void;
  toggleSearch: (open: boolean) => void;

  // --- NEW: THEME LOGIC (This was missing) ---
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user, isAuthModalOpen: false }),
      logout: () => set({ isAuthenticated: false, user: null }),

      watchlist: [],
      addToWatchlist: (item) => set((state) => ({ watchlist: [...state.watchlist, item] })),
      removeFromWatchlist: (id) => set((state) => ({ watchlist: state.watchlist.filter(i => i.id !== id) })),
      isInWatchlist: (id) => get().watchlist.some(i => i.id === id),

      isAuthModalOpen: false,
      isSearchOpen: false,
      toggleAuthModal: (open) => set({ isAuthModalOpen: open }),
      toggleSearch: (open) => set({ isSearchOpen: open }),

      // --- NEW: THEME IMPLEMENTATION ---
      theme: 'dark', // Default is dark
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),
    }),
    {
      name: 'ebs-storage',
      // We save 'watchlist' AND 'theme' so they are remembered on refresh
      partialize: (state) => ({ watchlist: state.watchlist, theme: state.theme }),
    }
  )
);