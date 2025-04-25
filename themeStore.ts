import { create } from 'zustand';

type ThemeType = 'light' | 'dark' | 'luxe' | 'neon' | 'retro';

interface ThemeState {
  currentTheme: ThemeType | null;
  setCurrentTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: null,
  setCurrentTheme: (theme) => set({ currentTheme: theme }),
}));