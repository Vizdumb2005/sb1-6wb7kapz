import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { supabase } from '@/libs/supabase';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Sun, Moon, PaintBucket, Bell, ShieldCheck, HardDrive, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { useThemeStore } from '@/stores/themeStore';

export default function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { setCurrentTheme } = useThemeStore();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activityStatus, setActivityStatus] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Navigation will happen via auth listener in _layout.tsx
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    subtitle?: string,
    rightElement?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIcon}>
        {icon}
      </View>
      
      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightElement ? (
        rightElement
      ) : onPress ? (
        <ChevronRight size={20} color={colors.textSecondary} />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Appearance
          </Text>
          
          {renderSettingItem(
            <PaintBucket size={22} color={colors.primary} />,
            'Theme',
            isDark ? 'Dark' : 'Light',
            <ChevronRight size={20} color={colors.textSecondary} />,
            () => router.push('/theme')
          )}
          
          {renderSettingItem(
            isDark ? <Moon size={22} color="#9c59b6" /> : <Sun size={22} color="#f39c12" />,
            'Dark Mode',
            undefined,
            <Switch
              value={isDark}
              onValueChange={(value) => setCurrentTheme(value ? 'dark' : 'light')}
              thumbColor={isDark ? colors.primary : '#fff'}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
            />
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Notifications & Privacy
          </Text>
          
          {renderSettingItem(
            <Bell size={22} color="#e74c3c" />,
            'Notifications',
            'Manage push notifications',
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor={notificationsEnabled ? colors.primary : '#fff'}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
            />
          )}
          
          {renderSettingItem(
            <ShieldCheck size={22} color="#27ae60" />,
            'Privacy',
            undefined,
            <ChevronRight size={20} color={colors.textSecondary} />,
            () => {}
          )}
          
          {renderSettingItem(
            <HardDrive size={22} color="#3498db" />,
            'Data & Storage',
            'Manage cache and storage usage',
            <ChevronRight size={20} color={colors.textSecondary} />,
            () => {}
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Chat Settings
          </Text>
          
          {renderSettingItem(
            <ShieldCheck size={22} color="#27ae60" />,
            'Activity Status',
            'Show when you\'re online',
            <Switch
              value={activityStatus}
              onValueChange={setActivityStatus}
              thumbColor={activityStatus ? colors.primary : '#fff'}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
            />
          )}
          
          {renderSettingItem(
            <CheckCheck size={22} color="#3498db" />,
            'Read Receipts',
            'Show when you\'ve read messages',
            <Switch
              value={readReceipts}
              onValueChange={setReadReceipts}
              thumbColor={readReceipts ? colors.primary : '#fff'}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
            />
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Support
          </Text>
          
          {renderSettingItem(
            <HelpCircle size={22} color="#f39c12" />,
            'Help & Support',
            'Contact us and FAQ',
            <ChevronRight size={20} color={colors.textSecondary} />,
            () => {}
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.signOutButton, { backgroundColor: colors.errorLight }]}
          onPress={handleSignOut}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={[styles.signOutText, { color: colors.error }]}>
            Sign Out
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.versionText, { color: colors.textSecondary }]}>
          ViraChat v1.0.0
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'SFPro-Bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'SFPro-Medium',
    marginLeft: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'SFPro-Medium',
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  signOutText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'SFPro-Medium',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 30,
  },
});