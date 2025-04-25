import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/libs/supabase';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2, RotateCcw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface CallData {
  id: string;
  name: string;
  avatar_url: string;
}

export default function CallScreen() {
  const { id } = useLocalSearchParams();
  const { video } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [callData, setCallData] = useState<CallData | null>(null);
  const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'ongoing'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(video === 'true');
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  
  // Mock data for demo purposes
  useEffect(() => {
    const mockCall: CallData = {
      id: id as string,
      name: "Sarah Johnson",
      avatar_url: "https://randomuser.me/api/portraits/women/65.jpg",
    };
    
    setCallData(mockCall);
    
    // Simulate call connecting and then ringing
    setTimeout(() => {
      setCallStatus('ringing');
      
      // Simulate call being answered
      setTimeout(() => {
        setCallStatus('ongoing');
        
        // Start call duration timer
        const timer = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
        
        return () => clearInterval(timer);
      }, 2000);
    }, 1000);
  }, [id]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const endCall = () => {
    router.back();
  };

  if (!callData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={isDark ? ['#121212', '#1E1E1E'] : ['#f9f9f9', '#ffffff']}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      {videoEnabled ? (
        <>
          {/* Video call UI */}
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/women/65.jpg' }} 
            style={styles.fullscreenVideo}
          />
          
          <View style={styles.selfVideoContainer}>
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
              style={styles.selfVideo}
            />
          </View>
          
          <BlurView
            intensity={80}
            tint={isDark ? 'dark' : 'light'}
            style={styles.videoCallTopBar}
          >
            <Text style={[styles.callerName, { color: colors.text }]}>
              {callData.name}
            </Text>
            <Text style={[styles.callStatus, { color: colors.textSecondary }]}>
              {callStatus === 'ongoing' 
                ? formatDuration(callDuration) 
                : callStatus === 'ringing' 
                  ? 'Ringing...' 
                  : 'Connecting...'}
            </Text>
          </BlurView>
        </>
      ) : (
        // Audio call UI
        <View style={styles.audioCallContainer}>
          <View style={styles.callerInfoContainer}>
            <Image source={{ uri: callData.avatar_url }} style={styles.callerAvatar} />
            
            <Text style={[styles.callerName, { color: colors.text }]}>
              {callData.name}
            </Text>
            
            <Text style={[styles.callStatus, { color: colors.textSecondary }]}>
              {callStatus === 'ongoing' 
                ? formatDuration(callDuration) 
                : callStatus === 'ringing' 
                  ? 'Ringing...' 
                  : 'Connecting...'}
            </Text>
          </View>
          
          {callStatus === 'ongoing' && (
            <View style={styles.waveform}>
              {Array.from({ length: 9 }).map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.waveformBar, 
                    { 
                      height: Math.random() * 40 + 10, 
                      backgroundColor: colors.primary,
                      opacity: Math.random() * 0.5 + 0.5
                    }
                  ]} 
                />
              ))}
            </View>
          )}
        </View>
      )}
      
      <BlurView
        intensity={80}
        tint={isDark ? 'dark' : 'light'}
        style={styles.callControls}
      >
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: micEnabled ? colors.cardElevated : colors.error }]}
          onPress={() => setMicEnabled(!micEnabled)}
        >
          {micEnabled ? (
            <Mic size={24} color={colors.text} />
          ) : (
            <MicOff size={24} color="#fff" />
          )}
        </TouchableOpacity>
        
        {video === 'true' && (
          <TouchableOpacity 
            style={[styles.controlButton, { backgroundColor: videoEnabled ? colors.cardElevated : colors.error }]}
            onPress={() => setVideoEnabled(!videoEnabled)}
          >
            {videoEnabled ? (
              <Video size={24} color={colors.text} />
            ) : (
              <VideoOff size={24} color="#fff" />
            )}
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: speakerEnabled ? colors.cardElevated : colors.cardElevated }]}
          onPress={() => setSpeakerEnabled(!speakerEnabled)}
        >
          <Volume2 size={24} color={speakerEnabled ? colors.text : colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: colors.cardElevated }]}
          onPress={() => {}}
        >
          <RotateCcw size={24} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.endCallButton, { backgroundColor: colors.error }]}
          onPress={endCall}
        >
          <PhoneOff size={24} color="#fff" />
        </TouchableOpacity>
      </BlurView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullscreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  selfVideoContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 100,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  selfVideo: {
    width: '100%',
    height: '100%',
  },
  videoCallTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  audioCallContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callerInfoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  callerAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  callerName: {
    fontSize: 24,
    fontFamily: 'SFPro-Bold',
    marginBottom: 8,
  },
  callStatus: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 50,
    width: 200,
    marginTop: 30,
  },
  waveformBar: {
    width: 4,
    borderRadius: 2,
    marginHorizontal: 4,
  },
  callControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 24,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});