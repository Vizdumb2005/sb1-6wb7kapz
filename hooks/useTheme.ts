import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/stores/themeStore';

// Light theme colors
const lightColors = {
  primary: '#FF6B6B',
  secondary: '#4F46E5',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.1)',
  background: '#F9FAFB',
  card: '#FFFFFF',
  cardElevated: '#F3F4F6',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
};

// Dark theme colors
const darkColors = {
  primary: '#FF6B6B',
  secondary: '#4F46E5',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.15)',
  background: '#121212',
  card: '#1E1E1E',
  cardElevated: '#2D2D2D',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
};

// Luxe theme colors (premium gold and black)
const luxeColors = {
  primary: '#F59E0B',
  secondary: '#10B981',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.15)',
  background: '#0F172A',
  card: '#1E293B',
  cardElevated: '#334155',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#475569',
};

// Neon theme colors (vibrant)
const neonColors = {
  primary: '#EC4899',
  secondary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.15)',
  background: '#18181B',
  card: '#27272A',
  cardElevated: '#3F3F46',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#52525B',
};

// Retro theme colors (90s inspired)
const retroColors = {
  primary: '#8B5CF6',
  secondary: '#F59E0B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.15)',
  background: '#FEFCE8',
  card: '#FFFFFF',
  cardElevated: '#F5F5F4',
  text: '#1C1917',
  textSecondary: '#78716C',
  border: '#E7E5E4',
};

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const { currentTheme } = useThemeStore();
  
  // Determine theme based on user preference or system
  const activeTheme = currentTheme || (systemColorScheme === 'dark' ? 'dark' : 'light');
  
  // Determine if using dark mode (for components that need simple boolean)
  const isDark = ['dark', 'luxe', 'neon'].includes(activeTheme);
  
  // Select the appropriate color scheme
  let colors;
  switch (activeTheme) {
    case 'dark':
      colors = darkColors;
      break;
    case 'luxe':
      colors = luxeColors;
      break;
    case 'neon':
      colors = neonColors;
      break;
    case 'retro':
      colors = retroColors;
      break;
    default:
      colors = lightColors;
  }
  
  return { colors, isDark };
}