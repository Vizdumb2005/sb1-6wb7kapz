import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/libs/supabase';
import { router } from 'expo-router';

export default function AppLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Not logged in, redirect to auth
        router.replace('/');
        return;
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.replace('/');
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      <Stack.Screen name="chat/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="story/[id]" options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
      <Stack.Screen name="call/[id]" options={{ animation: 'fade', presentation: 'modal' }} />
      <Stack.Screen name="profile/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="theme" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}