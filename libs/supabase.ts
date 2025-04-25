import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Use a custom storage implementation for secure storage on native platforms
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return Platform.OS !== 'web'
      ? SecureStore.getItemAsync(key)
      : localStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    return Platform.OS !== 'web'
      ? SecureStore.setItemAsync(key, value)
      : localStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    return Platform.OS !== 'web'
      ? SecureStore.deleteItemAsync(key)
      : localStorage.removeItem(key);
  },
};

// Replace with your Supabase URL and anon key
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});