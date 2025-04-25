import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { supabase } from '@/libs/supabase';
import { useThemeStore } from '@/stores/themeStore';
import { ThemeProvider } from '@/components/ThemeProvider';
import {
  Poppins_400Regular as PoppinsRegular,
  Poppins_500Medium as PoppinsMedium,
  Poppins_700Bold as PoppinsBold,
} from '@expo-google-fonts/poppins';
import {
  Roboto_400Regular as RobotoRegular,
  Roboto_500Medium as RobotoMedium,
  Roboto_700Bold as RobotoBold,
} from '@expo-google-fonts/roboto';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const [appIsReady, setAppIsReady] = useState(false);
  const { currentTheme, setCurrentTheme } = useThemeStore();

  // Load custom fonts
  const [fontsLoaded, fontError] = useFonts({
    'Roboto-Regular': RobotoRegular,
    'Roboto-Medium': RobotoMedium,
    'Roboto-Bold': RobotoBold,
    'Poppins-Regular': PoppinsRegular,
    'Poppins-Medium': PoppinsMedium,
    'Poppins-Bold': PoppinsBold,
  });

  // Setup the app and check user session
  useEffect(() => {
    async function prepare() {
      try {
        // Check for existing session
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error checking auth session:', error);
        }
        
        // Set system theme preference
        if (!currentTheme) {
          setCurrentTheme('light');
        }
      } catch (e) {
        console.warn('Error preparing app:', e);
      } finally {
        setAppIsReady(true);
      }
    }
    
    prepare();
  }, []);

  // Hide splash screen once resources are loaded
  useEffect(() => {
    if ((fontsLoaded || fontError) && appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, appIsReady]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(app)" options={{ animation: 'fade' }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}