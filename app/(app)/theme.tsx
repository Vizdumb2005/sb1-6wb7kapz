import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useThemeStore } from '@/stores/themeStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type ThemeOption = {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
  };
};

export default function ThemeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { currentTheme, setCurrentTheme } = useThemeStore();
  
  const themeOptions: ThemeOption[] = [
    {
      id: 'light',
      name: 'Light',
      description: 'Clean and bright theme for daytime use',
      colors: {
        primary: '#FF6B6B',
        secondary: '#4F46E5',
      }
    },
    {
      id: 'dark',
      name: 'Dark',
      description: 'Dark theme for low light environments',
      colors: {
        primary: '#FF6B6B',
        secondary: '#4F46E5',
      }
    },
    {
      id: 'luxe',
      name: 'Luxe',
      description: 'Premium gold and black accents',
      colors: {
        primary: '#F59E0B',
        secondary: '#10B981',
        accent: '#000000',
      }
    },
    {
      id: 'neon',
      name: 'Neon Pop',
      description: 'Vibrant colors with neon accents',
      colors: {
        primary: '#EC4899',
        secondary: '#3B82F6',
        accent: '#10B981',
      }
    },
    {
      id: 'retro',
      name: 'Retro',
      description: '90s inspired color scheme',
      colors: {
        primary: '#8B5CF6',
        secondary: '#F59E0B',
        accent: '#EC4899',
      }
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: colors.cardElevated }]}
        >
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.title, { color: colors.text }]}>Theme</Text>
        
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Choose a theme that matches your style. Changes are applied immediately.
        </Text>
        
        <View style={styles.themesContainer}>
          {themeOptions.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              style={[
                styles.themeOption,
                { 
                  borderColor: currentTheme === theme.id ? colors.primary : colors.border,
                  backgroundColor: colors.card,
                }
              ]}
              onPress={() => setCurrentTheme(theme.id)}
            >
              <View style={styles.themePreview}>
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.secondary]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.themeGradient}
                />
                
                {currentTheme === theme.id && (
                  <View style={[styles.selectedIndicator, { backgroundColor: theme.colors.primary }]}>
                    <Check size={16} color="#fff" />
                  </View>
                )}
              </View>
              
              <View style={styles.themeInfo}>
                <Text style={[styles.themeName, { color: colors.text }]}>
                  {theme.name}
                </Text>
                <Text style={[styles.themeDescription, { color: colors.textSecondary }]}>
                  {theme.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={[styles.note, { color: colors.textSecondary }]}>
          System settings will override your selection if Auto theme is enabled in your device settings.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'SFPro-Bold',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 20,
    marginBottom: 24,
    lineHeight: 24,
  },
  themesContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 24,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  themePreview: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
    position: 'relative',
  },
  themeGradient: {
    width: '100%',
    height: '100%',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderBottomLeftRadius: 8,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 18,
    fontFamily: 'SFPro-Bold',
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  note: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
});