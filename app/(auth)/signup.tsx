import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/libs/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { UserPlus, Mail, Key, User, CircleAlert as AlertCircle, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors, isDark } = useTheme();

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Check if username is taken first
      const { data: existingUsers, error: userCheckError } = await supabase
        .from('profiles')
        .select()
        .eq('username', username);
      
      if (userCheckError) throw userCheckError;
      
      if (existingUsers && existingUsers.length > 0) {
        setError('Username is already taken');
        setLoading(false);
        return;
      }
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });
      
      if (error) throw error;
      
      // Create profile in the profiles table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              username,
              email,
              created_at: new Date(),
            }
          ]);
        
        if (profileError) throw profileError;
      }
      
      // Success - navigation handled by auth listener
    } catch (error: any) {
      setError(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}
    >
      <LinearGradient
        colors={isDark ? ['#121212', '#1E1E1E'] : ['#f9f9f9', '#ffffff']}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Create Account</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Join the ViraChat community
            </Text>
          </View>

          <View style={styles.formContainer}>
            {error && (
              <View style={[styles.errorContainer, { backgroundColor: colors.errorLight }]}>
                <AlertCircle size={18} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            )}

            <View style={[styles.inputContainer, { borderColor: colors.border }]}>
              <User size={20} color={colors.textSecondary} />
              <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={[styles.input, { color: colors.text }]}
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.inputContainer, { borderColor: colors.border }]}>
              <Mail size={20} color={colors.textSecondary} />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={[styles.input, { color: colors.text }]}
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={[styles.inputContainer, { borderColor: colors.border }]}>
              <Key size={20} color={colors.textSecondary} />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={[styles.input, { color: colors.text }]}
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              onPress={handleSignUp} 
              disabled={loading}
              style={[styles.signUpButton, { opacity: loading ? 0.7 : 1 }]}
            >
              <LinearGradient
                colors={['#4F46E5', '#7E22CE']}
                start={[0, 0]}
                end={[1, 0]}
                style={styles.gradientButton}
              >
                <UserPlus size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    marginTop: 40,
    marginBottom: 20,
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'SFPro-Bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  formContainer: {
    marginBottom: 30,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    fontFamily: 'Poppins-Regular',
  },
  signUpButton: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SFPro-Medium',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    marginRight: 4,
    fontFamily: 'Poppins-Regular',
  },
  signInText: {
    fontSize: 14,
    color: '#4F46E5',
    fontFamily: 'Poppins-Medium',
  },
});