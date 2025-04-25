import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { supabase } from '@/libs/supabase';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CirclePlus as PlusCircle, Camera } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface Story {
  id: string;
  user: {
    id: string;
    username: string;
    avatar_url: string;
  };
  viewed: boolean;
  has_multiple: boolean;
  timestamp: string;
  preview_url: string;
}

const { width } = Dimensions.get('window');
const STORY_SIZE = width * 0.28;

export default function HappeningScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [myStories, setMyStories] = useState<Story[]>([]);
  const [stories, setStories] = useState<Story[]>([]);

  // Mock data for demo purposes
  useEffect(() => {
    // Your story
    const myMockStory: Story[] = [
      {
        id: 'mystory1',
        user: {
          id: 'currentuser',
          username: 'You',
          avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
        },
        viewed: false,
        has_multiple: true,
        timestamp: '2 hours ago',
        preview_url: 'https://picsum.photos/id/237/300'
      }
    ];
    
    // Other users' stories
    const mockStories: Story[] = [
      {
        id: 'story1',
        user: {
          id: 'user1',
          username: 'Sarah',
          avatar_url: 'https://randomuser.me/api/portraits/women/65.jpg',
        },
        viewed: false,
        has_multiple: true,
        timestamp: '1 hour ago',
        preview_url: 'https://picsum.photos/id/10/300'
      },
      {
        id: 'story2',
        user: {
          id: 'user2',
          username: 'Michael',
          avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
        },
        viewed: true,
        has_multiple: false,
        timestamp: '3 hours ago',
        preview_url: 'https://picsum.photos/id/20/300'
      },
      {
        id: 'story3',
        user: {
          id: 'user3',
          username: 'Alex',
          avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
        viewed: false,
        has_multiple: true,
        timestamp: '5 hours ago',
        preview_url: 'https://picsum.photos/id/30/300'
      },
      {
        id: 'story4',
        user: {
          id: 'user4',
          username: 'Jamie',
          avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
        },
        viewed: false,
        has_multiple: false,
        timestamp: '8 hours ago',
        preview_url: 'https://picsum.photos/id/40/300'
      },
      {
        id: 'story5',
        user: {
          id: 'user5',
          username: 'Taylor',
          avatar_url: 'https://randomuser.me/api/portraits/women/22.jpg',
        },
        viewed: true,
        has_multiple: true,
        timestamp: '10 hours ago',
        preview_url: 'https://picsum.photos/id/50/300'
      },
    ];
    
    setMyStories(myMockStory);
    setStories(mockStories);
  }, []);

  const renderStoryItem = (item: Story, isMyStory = false) => (
    <TouchableOpacity
      key={item.id}
      style={styles.storyItem}
      onPress={() => router.push(`/story/${item.id}`)}
    >
      <View style={[
        styles.storyRing, 
        { 
          borderColor: item.viewed ? colors.border : (isMyStory ? '#FF6B6B' : colors.primary)
        }
      ]}>
        <Image source={{ uri: item.user.avatar_url }} style={styles.storyAvatar} />
      </View>
      
      <Text 
        style={[
          styles.storyUsername, 
          { color: colors.text }
        ]}
        numberOfLines={1}
      >
        {item.user.username}
      </Text>
    </TouchableOpacity>
  );

  // Render featured stories with larger preview
  const renderFeaturedStory = (item: Story) => (
    <TouchableOpacity
      key={item.id}
      style={styles.featuredStoryContainer}
      onPress={() => router.push(`/story/${item.id}`)}
    >
      <Image source={{ uri: item.preview_url }} style={styles.featuredImage} />
      
      <BlurView 
        intensity={90} 
        tint={isDark ? 'dark' : 'light'}
        style={styles.featuredOverlay}
      >
        <View style={styles.featuredUserInfo}>
          <Image source={{ uri: item.user.avatar_url }} style={styles.featuredAvatar} />
          <View>
            <Text style={[styles.featuredUsername, { color: colors.text }]}>
              {item.user.username}
            </Text>
            <Text style={[styles.featuredTimestamp, { color: colors.textSecondary }]}>
              {item.timestamp}
            </Text>
          </View>
        </View>
        
        {item.has_multiple && (
          <View style={[styles.multipleIndicator, { backgroundColor: colors.cardElevated }]}>
            <Text style={[styles.multipleIndicatorText, { color: colors.text }]}>+</Text>
          </View>
        )}
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Happening</Text>
        
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.cardElevated }]}>
          <Camera size={22} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stories row */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesContainer}
        >
          {/* Your story (add) */}
          {myStories.length === 0 ? (
            <TouchableOpacity style={styles.storyItem}>
              <View style={[styles.addStoryRing, { borderColor: colors.border }]}>
                <LinearGradient
                  colors={['#FF6B6B', '#FF8E53']}
                  style={styles.addStoryGradient}
                  start={[0, 0]}
                  end={[1, 0]}
                >
                  <PlusCircle size={24} color="#fff" />
                </LinearGradient>
              </View>
              <Text style={[styles.storyUsername, { color: colors.text }]}>Add Story</Text>
            </TouchableOpacity>
          ) : (
            myStories.map(story => renderStoryItem(story, true))
          )}
          
          {/* Other stories */}
          {stories.map(story => renderStoryItem(story))}
        </ScrollView>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Stories</Text>
        
        <View style={styles.featuredStoriesContainer}>
          {stories.map(story => renderFeaturedStory(story))}
        </View>
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
  title: {
    fontSize: 28,
    fontFamily: 'SFPro-Bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storiesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 16,
  },
  storyItem: {
    alignItems: 'center',
    width: STORY_SIZE,
  },
  storyRing: {
    width: STORY_SIZE,
    height: STORY_SIZE,
    borderRadius: STORY_SIZE / 2,
    borderWidth: 2,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addStoryRing: {
    width: STORY_SIZE,
    height: STORY_SIZE,
    borderRadius: STORY_SIZE / 2,
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addStoryGradient: {
    width: '92%',
    height: '92%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  storyUsername: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    width: STORY_SIZE,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'SFPro-Bold',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  featuredStoriesContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 20,
  },
  featuredStoryContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  featuredUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  featuredUsername: {
    fontSize: 14,
    fontFamily: 'SFPro-Bold',
  },
  featuredTimestamp: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  multipleIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  multipleIndicatorText: {
    fontSize: 16,
    fontFamily: 'SFPro-Bold',
  },
});