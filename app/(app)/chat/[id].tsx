import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/libs/supabase';
import { ArrowLeft, Send, Phone, Video, Paperclip, Image as ImageIcon, Mic, MoveVertical as MoreVertical } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

interface Message {
  id: string;
  text: string;
  created_at: string;
  user_id: string;
  is_sent: boolean;
  is_delivered: boolean;
  is_read: boolean;
}

interface ChatData {
  id: string;
  name: string;
  avatar_url: string;
  online: boolean;
  is_group: boolean;
  last_seen?: string;
  typing?: boolean;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  
  const [message, setMessage] = useState('');
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demo purposes
  useEffect(() => {
    setTimeout(() => {
      const mockChat: ChatData = {
        id: id as string,
        name: "Sarah Johnson",
        avatar_url: "https://randomuser.me/api/portraits/women/65.jpg",
        online: true,
        is_group: false,
        typing: false
      };
      
      const mockMessages: Message[] = [
        {
          id: "1",
          text: "Hey there! How's it going?",
          created_at: "10:15 AM",
          user_id: "otherId",
          is_sent: true,
          is_delivered: true,
          is_read: true
        },
        {
          id: "2",
          text: "I'm good, thanks! Just finishing up some work. How about you?",
          created_at: "10:16 AM",
          user_id: "currentId",
          is_sent: true,
          is_delivered: true,
          is_read: true
        },
        {
          id: "3",
          text: "Pretty much the same. Been busy with that new project.",
          created_at: "10:18 AM",
          user_id: "otherId",
          is_sent: true,
          is_delivered: true,
          is_read: true
        },
        {
          id: "4",
          text: "Oh right! How's that going? Making good progress?",
          created_at: "10:20 AM",
          user_id: "currentId",
          is_sent: true,
          is_delivered: true,
          is_read: true
        },
        {
          id: "5",
          text: "It's coming along nicely! Should be done by next week.",
          created_at: "10:22 AM",
          user_id: "otherId",
          is_sent: true,
          is_delivered: true,
          is_read: true
        },
        {
          id: "6",
          text: "That's great to hear! Let me know if you need any help.",
          created_at: "10:23 AM",
          user_id: "currentId",
          is_sent: true,
          is_delivered: true,
          is_read: true
        },
        {
          id: "7",
          text: "Actually, I could use your feedback on something if you have time this week?",
          created_at: "10:25 AM",
          user_id: "otherId",
          is_sent: true,
          is_delivered: true,
          is_read: true
        }
      ];
      
      setChatData(mockChat);
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);
  }, [id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user_id: 'currentId',
      is_sent: true,
      is_delivered: false,
      is_read: false
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Simulate message being delivered and read
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, is_delivered: true } 
            : msg
        )
      );
      
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, is_read: true } 
              : msg
          )
        );
        
        // Simulate response after a short delay
        if (Math.random() > 0.3) {
          setTimeout(() => {
            setChatData(prev => prev ? { ...prev, typing: true } : null);
            
            setTimeout(() => {
              setChatData(prev => prev ? { ...prev, typing: false } : null);
              
              const responseMessages = [
                "That sounds good!",
                "Sure, I'm available tomorrow.",
                "Haha, that's funny!",
                "Let me think about that and get back to you.",
                "Interesting! Tell me more about it."
              ];
              
              const response: Message = {
                id: (Date.now() + 1).toString(),
                text: responseMessages[Math.floor(Math.random() * responseMessages.length)],
                created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                user_id: 'otherId',
                is_sent: true,
                is_delivered: true,
                is_read: true
              };
              
              setMessages(prev => [...prev, response]);
            }, 2000);
          }, 1000);
        }
      }, 1000);
    }, 500);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.user_id === 'currentId';
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isCurrentUser 
            ? { backgroundColor: colors.primary } 
            : { backgroundColor: colors.cardElevated }
        ]}>
          <Text style={[
            styles.messageText,
            { color: isCurrentUser ? '#fff' : colors.text }
          ]}>
            {item.text}
          </Text>
          
          <Text style={[
            styles.messageTime,
            { color: isCurrentUser ? 'rgba(255,255,255,0.7)' : colors.textSecondary }
          ]}>
            {item.created_at}
          </Text>
          
          {isCurrentUser && (
            <View style={styles.messageStatus}>
              {item.is_read ? (
                <View style={styles.readStatus}>
                  <View style={[styles.statusDot, { backgroundColor: '#4FC3F7' }]} />
                  <View style={[styles.statusDot, { backgroundColor: '#4FC3F7' }]} />
                </View>
              ) : item.is_delivered ? (
                <View style={styles.readStatus}>
                  <View style={[styles.statusDot, { backgroundColor: colors.textSecondary }]} />
                  <View style={[styles.statusDot, { backgroundColor: colors.textSecondary }]} />
                </View>
              ) : item.is_sent ? (
                <View style={styles.readStatus}>
                  <View style={[styles.statusDot, { backgroundColor: colors.textSecondary }]} />
                </View>
              ) : null}
            </View>
          )}
        </View>
      </View>
    );
  };

  if (!chatData || loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.text }}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[
        styles.header, 
        { borderBottomColor: colors.border, paddingTop: insets.top }
      ]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.userInfo}
            onPress={() => router.push(`/profile/${chatData.id}`)}
          >
            <View style={styles.avatarContainer}>
              <Image source={{ uri: chatData.avatar_url }} style={styles.avatar} />
              {chatData.online && (
                <View style={[styles.onlineIndicator, { backgroundColor: colors.success }]} />
              )}
            </View>
            
            <View>
              <Text style={[styles.username, { color: colors.text }]}>
                {chatData.name}
              </Text>
              
              {chatData.typing ? (
                <Text style={[styles.statusText, { color: colors.success }]}>
                  typing...
                </Text>
              ) : chatData.online ? (
                <Text style={[styles.statusText, { color: colors.success }]}>
                  Online
                </Text>
              ) : chatData.last_seen ? (
                <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                  Last seen {chatData.last_seen}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: colors.cardElevated }]}
            onPress={() => router.push(`/call/${chatData.id}`)}
          >
            <Phone size={20} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: colors.cardElevated }]}
            onPress={() => router.push(`/call/${chatData.id}?video=true`)}
          >
            <Video size={20} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.cardElevated }]}>
            <MoreVertical size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
        <View style={styles.attachmentButtons}>
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.attachButton}>
            <ImageIcon size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.attachButton}>
            <Mic size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.inputWrapper, { backgroundColor: colors.cardElevated }]}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { color: colors.text }]}
            multiline
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              { backgroundColor: message.trim() ? colors.primary : colors.cardElevated }
            ]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Send size={20} color={message.trim() ? '#fff' : colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  username: {
    fontSize: 16,
    fontFamily: 'SFPro-Medium',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  messagesList: {
    padding: 12,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 12,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    alignSelf: 'flex-end',
  },
  messageStatus: {
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
  readStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  inputContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  attachmentButtons: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  attachButton: {
    marginRight: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});