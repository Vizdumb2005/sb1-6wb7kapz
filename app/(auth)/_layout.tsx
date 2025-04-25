import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '@/libs/supabase';
import { router } from 'expo-router';

export default function AuthLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is logged in, redirect to app
        router.replace('/(app)/(tabs)/chats');
      } else {
        // No session, stay on auth screens
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          router.replace('/(app)/(tabs)/chats');
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <View style={styles.container} />;
  }

  return (
    <Stack screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}>
      <Stack.Screen name="index" options={{ title: 'Sign In' }} />
      <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});