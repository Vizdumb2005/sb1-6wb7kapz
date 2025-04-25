import React, { ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useThemeStore } from '@/stores/themeStore';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // This component doesn't actually render anything special,
  // but it could be extended to provide theme context if needed
  
  return <>{children}</>;
}