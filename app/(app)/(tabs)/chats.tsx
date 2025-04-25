import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '@/libs/supabase';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { Search, CreditCard as Edit, CheckCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Chat {
  id: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  user: {
    id: string;
    username: string;
    avatar_url: string;
    online: boolean;
  };
}

export default function ChatsScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demo purposes
  useEffect(() => {
    setTimeout(() => {
      const mockChats: Chat[] = [
        {
          id: '1',
          last_message: 'Hey, how are you doing?',
          last_message_time: '10:30 AM',
          unread_count: 2,
          user: {
            id: 'user1',
            username: 'Sarah Johnson',
            avatar_url: 'https://randomuser.me/api/portraits/women/65.jpg',
            online: true
          }
        },
        {
          id: '2',
          last_message: 'Did you see that new movie?',
          last_message_time: 'Yesterday',
          unread_count: 0,
          user: {
            id: 'user2',
            username: 'Michael Chen',
            avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
            online: false
          }
        },
        {
          id: '3',
          last_message: 'The project is due tomorrow!',
          last_message_time: 'Yesterday',
          unread_count: 5,
          user: {
            id: 'user3',
            username: 'Alex Morgan',
            avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
            online: true
          }
        },
        {
          id: '4',
          last_message: 'Let\'s catch up this weekend',
          last_message_time: 'Monday',
          unread_count: 0,
          user: {
            id: 'user4',
            username: 'Jamie Rivera',
            avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
            online: false
          }
        },
        {
          id: '5',
          last_message: 'Check out this cool photo!',
          last_message_time: 'Monday',
          unread_count: 1,
          user: {
            id: 'user5',
            username: 'Taylor Kim',
            avatar_url: 'https://randomuser.me/api/portraits/women/22.jpg',
            online: true
          }
        }
      ];
      
      setChats(mockChats);
      setLoading(false);
    }, 1000);
  }, []);

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={[styles.chatItem, { borderBottomColor: colors.border }]}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.user.avatar_url }} style={styles.avatar} />
        {item.user.online && (
          <View style={[styles.onlineIndicator, { backgroundColor: colors.success }]} />
        )}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.topRow}>
          <Text style={[styles.username, { color: colors.text }]}>
            {item.user.username}
          </Text>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {item.last_message_time}
          </Text>
        </View>
        
        <View style={styles.bottomRow}>
          <Text 
            style={[
              styles.messageText, 
              { color: item.unread_count > 0 ? colors.text : colors.textSecondary }
            ]}
            numberOfLines={1}
          >
            {item.last_message}
          </Text>
          
          {item.unread_count > 0 ? (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.unreadText}>{item.unread_count}</Text>
            </View>
          ) : (
            <CheckCheck size={16} color={colors.success} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Chats</Text>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.cardElevated }]}>
            <Search size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      <TouchableOpacity 
        style={styles.newChatButton}
        onPress={() => {}}
      >
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          style={styles.gradientButton}
          start={[0, 0]}
          end={[1, 0]}
        >
          <Edit size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
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
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontFamily: 'SFPro-Medium',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'SFPro-Medium',
  },
  newChatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});