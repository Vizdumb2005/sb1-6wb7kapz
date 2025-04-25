import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { supabase } from '@/libs/supabase';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreditCard as Edit, Settings, Camera, Link, Instagram, Twitter } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';

interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  links: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  stats: {
    chats: number;
    groups: number;
    stories: number;
  };
  created_at: string;
}

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demo purposes
  useEffect(() => {
    setTimeout(() => {
      const mockProfile: Profile = {
        id: 'current-user-id',
        username: 'alex_morgan',
        display_name: 'Alex Morgan',
        bio: 'Digital creator | Photography enthusiast | Coffee addict ☕ | Exploring the world one photo at a time',
        avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
        links: {
          instagram: 'instagram.com/alex.morgan',
          twitter: 'twitter.com/alexmorgan',
          website: 'alexmorgan.com'
        },
        stats: {
          chats: 28,
          groups: 5,
          stories: 142
        },
        created_at: 'May 2023'
      };
      
      setProfile(mockProfile);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAvatarChange = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    
    if (!result.canceled) {
      // Here would be the code to upload to Supabase storage
      console.log('Image selected:', result.assets[0].uri);
      
      // Update profile with new avatar URL
      if (profile) {
        setProfile({
          ...profile,
          avatar_url: result.assets[0].uri
        });
      }
    }
  };

  if (loading || !profile) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        
        <TouchableOpacity 
          style={[styles.settingsButton, { backgroundColor: colors.cardElevated }]}
          onPress={() => {}}
        >
          <Settings size={22} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
            
            <TouchableOpacity 
              style={[styles.editAvatarButton, { backgroundColor: colors.primary }]}
              onPress={handleAvatarChange}
            >
              <Camera size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.nameContainer}>
            <Text style={[styles.displayName, { color: colors.text }]}>
              {profile.display_name}
            </Text>
            <Text style={[styles.username, { color: colors.textSecondary }]}>
              @{profile.username}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.editProfileButton, { backgroundColor: colors.cardElevated }]}
            onPress={() => {}}
          >
            <Edit size={16} color={colors.text} />
            <Text style={[styles.editProfileText, { color: colors.text }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.bioText, { color: colors.text }]}>
          {profile.bio}
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {profile.stats.chats}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Chats
            </Text>
          </View>
          
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {profile.stats.groups}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Groups
            </Text>
          </View>
          
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {profile.stats.stories}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Stories
            </Text>
          </View>
        </View>
        
        {/* Social links */}
        <View style={styles.linksSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Links
          </Text>
          
          <View style={styles.linksList}>
            {profile.links.instagram && (
              <View style={[styles.linkItem, { backgroundColor: colors.card }]}>
                <Instagram size={18} color="#E1306C" />
                <Text style={[styles.linkText, { color: colors.text }]}>
                  {profile.links.instagram}
                </Text>
              </View>
            )}
            
            {profile.links.twitter && (
              <View style={[styles.linkItem, { backgroundColor: colors.card }]}>
                <Twitter size={18} color="#1DA1F2" />
                <Text style={[styles.linkText, { color: colors.text }]}>
                  {profile.links.twitter}
                </Text>
              </View>
            )}
            
            {profile.links.website && (
              <View style={[styles.linkItem, { backgroundColor: colors.card }]}>
                <Link size={18} color={colors.primary} />
                <Text style={[styles.linkText, { color: colors.text }]}>
                  {profile.links.website}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <Text style={[styles.joinedText, { color: colors.textSecondary }]}>
          Joined {profile.created_at}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'SFPro-Bold',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  displayName: {
    fontSize: 24,
    fontFamily: 'SFPro-Bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  bioText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'SFPro-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  linksSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'SFPro-Bold',
    marginBottom: 16,
  },
  linksList: {
    gap: 12,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  linkText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  joinedText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});