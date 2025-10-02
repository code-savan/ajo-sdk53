import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';

// Get environment variables - hardcoded temporarily if not available
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://cpvgznbnczuqzmyvaxdo.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdmd6bmJuY3p1cXpteXZheGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2NTk2OTIsImV4cCI6MjA0MjIzNTY5Mn0.sb_publishable_Iif5JThVBSdooIAb_FoBug_IKBdGf1O';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using fallback values.');
}

// Create Supabase client with enhanced auth configuration
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
      debug: __DEV__, // Enable debug mode in development
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-react-native',
      },
    },
  }
);

// Helper function to get current session with error handling
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session retrieval error:', error);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Session retrieval failed:', error);
    return null;
  }
};

// Helper function to get current user with error handling
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('User retrieval error:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('User retrieval failed:', error);
    return null;
  }
};

// Helper function to safely refresh session
export const refreshSessionSafely = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Session refresh error:', error);
      // If refresh fails, try to get the current session instead
      return await getCurrentSession();
    }
    return data.session;
  } catch (error) {
    console.error('Session refresh failed:', error);
    return null;
  }
};

// Helper function to clear invalid sessions
export const clearInvalidSession = async () => {
  try {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem('sb-cpvgznbnczuqzmyvaxdo-auth-token');
    console.log('Invalid session cleared');
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

export default supabase;
