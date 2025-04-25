import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/libs/supabase';
import { ArrowLeft, MessageCircle, Video, Shield, Ban, MoveHorizontal as MoreHorizontal, Link, Instagram, Twitter } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
  is_current_user: boolean;
}

export default function ProfileDetailScreen() {
  const { id } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demo purposes
  useEffect(() => {
    setTimeout(() => {
      const isCurrentUser = id === 'current-user-id';
      
      const mockProfile: Profile = {
        id: id as string,
        username: "sarah_j",
        display_name: "Sarah Johnson",
        bio: "Travel enthusiast | Amateur photographer | Coffee lover ☕ | Always looking for the next adventure",
        avatar_url: "https://randomuser.me/api/portraits/women/65.jpg",
        links: {
          instagram: "instagram.com/sarah.j",
          twitter: "twitter.com/sarahj",
          website: "sarahjohnson.com"
        },
        stats: {
          chats: 42,
          groups: 8,
          stories: 216
        },
        created_at: "April 2023",
        is_current_user: isCurrentUser
      };
      
      setProfile(mockProfile);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading || !profile) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.text }}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: colors.cardElevated }]}
        >
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        
        {!profile.is_current_user && (
          <TouchableOpacity 
            style={[styles.moreButton, { backgroundColor: colors.cardElevated }]}
          >
            <MoreHorizontal size={22} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.profileHeader}>
          <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          
          <View style={styles.nameContainer}>
            <Text style={[styles.displayName, { color: colors.text }]}>
              {profile.display_name}
            </Text>
            <Text style={[styles.username, { color: colors.textSecondary }]}>
              @{profile.username}
            </Text>
          </View>
        </View>
        
        {!profile.is_current_user && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push(`/chat/${profile.id}`)}
            >
              <MessageCircle size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.cardElevated }]}
              onPress={() => router.push(`/call/${profile.id}?video=true`)}
            >
              <Video size={20} color={colors.text} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>Video Call</Text>
            </TouchableOpacity>
          </View>
        )}
        
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
        
        {!profile.is_current_user && (
          <View style={styles.privacyActions}>
            <TouchableOpacity style={[styles.privacyButton, { backgroundColor: colors.cardElevated }]}>
              <Shield size={18} color={colors.text} />
              <Text style={[styles.privacyButtonText, { color: colors.text }]}>
                Block
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.privacyButton, { backgroundColor: colors.cardElevated }]}>
              <Ban size={18} color={colors.error} />
              <Text style={[styles.privacyButtonText, { color: colors.error }]}>
                Report
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreButton: {
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
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  nameContainer: {
    alignItems: 'center',
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'SFPro-Medium',
    color: '#fff',
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
  privacyActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 16,
  },
  privacyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  privacyButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'SFPro-Medium',
  },
  joinedText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});