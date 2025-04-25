import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '@/libs/supabase';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { Search, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Group {
  id: string;
  name: string;
  description: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  members_count: number;
  avatar_url: string;
}

export default function GroupsScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demo purposes
  useEffect(() => {
    setTimeout(() => {
      const mockGroups: Group[] = [
        {
          id: '1',
          name: 'Project Alpha',
          description: 'Discussing project details and deadlines',
          last_message: 'Let\'s meet tomorrow at 3pm',
          last_message_time: '11:45 AM',
          unread_count: 3,
          members_count: 8,
          avatar_url: 'https://picsum.photos/id/26/200'
        },
        {
          id: '2',
          name: 'Weekend Plans',
          description: 'Planning for weekend activities',
          last_message: 'I vote for hiking on Saturday!',
          last_message_time: 'Yesterday',
          unread_count: 0,
          members_count: 5,
          avatar_url: 'https://picsum.photos/id/42/200'
        },
        {
          id: '3',
          name: 'Gaming Squad',
          description: 'For all gaming related discussions',
          last_message: 'Anyone up for some Valorant tonight?',
          last_message_time: 'Yesterday',
          unread_count: 7,
          members_count: 12,
          avatar_url: 'https://picsum.photos/id/64/200'
        },
        {
          id: '4',
          name: 'Foodies',
          description: 'Sharing recipes and restaurant recommendations',
          last_message: 'Check out this new pizza place downtown!',
          last_message_time: 'Monday',
          unread_count: 0,
          members_count: 20,
          avatar_url: 'https://picsum.photos/id/102/200'
        }
      ];
      
      setGroups(mockGroups);
      setLoading(false);
    }, 1000);
  }, []);

  const renderGroupItem = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={[styles.groupItem, { backgroundColor: colors.card, shadowColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)' }]}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <Image source={{ uri: item.avatar_url }} style={styles.groupAvatar} />
      
      <View style={styles.groupInfo}>
        <View style={styles.topRow}>
          <Text style={[styles.groupName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {item.last_message_time}
          </Text>
        </View>
        
        <Text 
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {item.description}
        </Text>
        
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
          
          {item.unread_count > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.unreadText}>{item.unread_count}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.membersRow}>
          <Text style={[styles.membersText, { color: colors.textSecondary }]}>
            {item.members_count} members
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Groups</Text>
        
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
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={renderGroupItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      <TouchableOpacity 
        style={styles.newGroupButton}
        onPress={() => {}}
      >
        <LinearGradient
          colors={['#4F46E5', '#7E22CE']}
          style={styles.gradientButton}
          start={[0, 0]}
          end={[1, 0]}
        >
          <Plus size={24} color="#fff" />
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
    padding: 20,
    gap: 16,
  },
  groupItem: {
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  groupAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  groupInfo: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 18,
    fontFamily: 'SFPro-Bold',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'SFPro-Medium',
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  newGroupButton: {
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