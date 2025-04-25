import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/libs/supabase';
import { X, MessageCircle, Heart, Smile } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface StoryData {
  id: string;
  user: {
    id: string;
    username: string;
    avatar_url: string;
  };
  content: StoryContent[];
  created_at: string;
}

interface StoryContent {
  id: string;
  type: 'image' | 'video' | 'text';
  url?: string;
  text?: string;
  background_color?: string;
}

const { width, height } = Dimensions.get('window');
const PROGRESS_BAR_WIDTH = width - 40;

export default function StoryScreen() {
  const { id } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef<Animated.CompositeAnimation | null>(null);

  // Mock data for demo purposes
  useEffect(() => {
    const mockStory: StoryData = {
      id: id as string,
      user: {
        id: "user1",
        username: "Sarah Johnson",
        avatar_url: "https://randomuser.me/api/portraits/women/65.jpg"
      },
      content: [
        {
          id: "1",
          type: "image",
          url: "https://picsum.photos/id/10/600/800"
        },
        {
          id: "2",
          type: "text",
          text: "Having an amazing time exploring the city! ✨",
          background_color: "#4F46E5"
        },
        {
          id: "3",
          type: "image",
          url: "https://picsum.photos/id/20/600/800"
        }
      ],
      created_at: "2 hours ago"
    };
    
    setStoryData(mockStory);
  }, [id]);

  // Setup progress animation
  useEffect(() => {
    if (storyData && !isPaused) {
      progressAnim.setValue(0);
      progressAnimation.current = Animated.timing(progressAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false
      });
      
      progressAnimation.current.start(({ finished }) => {
        if (finished) {
          // Move to next story content or close if at the end
          if (currentIndex < (storyData.content.length - 1)) {
            setCurrentIndex(currentIndex + 1);
          } else {
            router.back();
          }
        }
      });
      
      return () => {
        progressAnimation.current?.stop();
      };
    }
  }, [currentIndex, storyData, isPaused]);

  const pauseStory = () => {
    setIsPaused(true);
    progressAnimation.current?.stop();
  };

  const resumeStory = () => {
    setIsPaused(false);
  };

  const navigateStory = (direction: 'prev' | 'next') => {
    if (!storyData) return;
    
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'next' && currentIndex < storyData.content.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'next') {
      router.back();
    }
  };

  if (!storyData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  const currentContent = storyData.content[currentIndex];

  return (
    <View style={styles.container}>
      {/* Story content */}
      {currentContent.type === 'image' && (
        <Image
          source={{ uri: currentContent.url }}
          style={styles.fullscreenImage}
        />
      )}
      
      {currentContent.type === 'text' && (
        <LinearGradient
          colors={[currentContent.background_color || '#4F46E5', '#7E22CE']}
          style={styles.textContainer}
        >
          <Text style={styles.storyText}>{currentContent.text}</Text>
        </LinearGradient>
      )}
      
      {/* Touch areas for navigation */}
      <TouchableOpacity
        style={styles.prevTouchArea}
        onPress={() => navigateStory('prev')}
        onLongPress={pauseStory}
        onPressOut={resumeStory}
      />
      
      <TouchableOpacity
        style={styles.nextTouchArea}
        onPress={() => navigateStory('next')}
        onLongPress={pauseStory}
        onPressOut={resumeStory}
      />
      
      {/* Progress bars */}
      <View style={[styles.progressContainer, { paddingTop: insets.top }]}>
        {storyData.content.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.progressBar, 
              { 
                width: PROGRESS_BAR_WIDTH / storyData.content.length - 5,
                backgroundColor: `${colors.border}80`
              }
            ]}
          >
            {index === currentIndex ? (
              <Animated.View 
                style={[
                  styles.progressIndicator,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    }),
                    backgroundColor: '#fff'
                  }
                ]}
              />
            ) : index < currentIndex ? (
              <View style={[styles.progressIndicator, { width: '100%', backgroundColor: '#fff' }]} />
            ) : null}
          </View>
        ))}
      </View>
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.userInfo}>
          <Image source={{ uri: storyData.user.avatar_url }} style={styles.avatar} />
          <View>
            <Text style={styles.username}>{storyData.user.username}</Text>
            <Text style={styles.timeAgo}>{storyData.created_at}</Text>
          </View>
        </View>
        
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Footer */}
      <BlurView
        intensity={50}
        tint="dark"
        style={[styles.footer, { paddingBottom: insets.bottom || 20 }]}
      >
        <View style={styles.replyInput}>
          <Text style={styles.replyPlaceholder}>Send a message</Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Heart size={24} color="#fff" fill="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Smile size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  storyText: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'SFPro-Bold',
    textAlign: 'center',
    lineHeight: 40,
  },
  prevTouchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width / 3,
    height: height,
    zIndex: 1,
  },
  nextTouchArea: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: (width / 3) * 2,
    height: height,
    zIndex: 1,
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
    zIndex: 10,
  },
  progressBar: {
    height: 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressIndicator: {
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#fff',
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SFPro-Bold',
  },
  timeAgo: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    zIndex: 10,
  },
  replyInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  replyPlaceholder: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 16,
  },
});