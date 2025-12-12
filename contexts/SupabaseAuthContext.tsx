import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { AppState, AppStateStatus } from 'react-native';
import { supabase } from '../lib/supabase';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGet } from '../lib/api';
import { apiPost } from '../lib/api';

// Session timeout in milliseconds (30 seconds for testing, can increase to 60 seconds)
const SESSION_TIMEOUT_MS = 30 * 1000; // 30 seconds

interface ExtendedUser extends User {
  hasPin?: boolean;
  biometricEnabled?: boolean;
  pinHash?: string;
}

interface AuthContextType {
  // Auth state
  user: ExtendedUser | null;
  session: Session | null;
  isLoading: boolean;

  // Auth methods
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, metadata?: { full_name?: string; phone?: string }) => Promise<void>;
  initiateSignup: (email: string, password: string, fullName: string) => Promise<void>;
  verifySignupOTP: (email: string, token: string) => Promise<void>;
  signInWithOTP: (email: string) => Promise<void>;
  verifyOTP: (emailOrPhone: string, token: string, type: 'signup' | 'magiclink' | 'sms') => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyPhoneOTP: (phone: string, token: string) => Promise<void>;
  signOut: (clearLocalData?: boolean) => Promise<void>;
  checkUserExists: (emailOrPhone: string) => Promise<{ exists: boolean; hasPin: boolean }>;

  // PIN & Biometric methods
  setupPin: (pin: string, enableBiometric?: boolean, password?: string, fullName?: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  updatePin: (oldPin: string, newPin: string) => Promise<void>;
  authenticateWithBiometric: () => Promise<boolean>;
  enableBiometric: (password: string) => Promise<void>;
  disableBiometric: () => Promise<void>;
  checkPinAttempts: () => Promise<{ attempts: number; blocked: boolean }>;
  resetPinAttempts: () => Promise<void>;
  authenticateWithPassword: (password: string) => Promise<boolean>;

  // Session methods
  refreshSession: () => Promise<void>;

  // State properties
  hasPin: boolean;
  biometricEnabled: boolean;
  biometricType: string | null;
  pinAttemptsRemaining: number;
  isPinBlocked: boolean;
  isInSignupFlow: boolean;
  requiresReauth: boolean; // True when session timed out and needs re-authentication

  // Signup flow control
  setSignupFlowComplete: () => void;

  // Session timeout control
  clearReauthRequired: () => void;

  // Error state
  error: AuthError | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Storage keys
const STORAGE_KEYS = {
  PIN_HASH: 'user_pin_hash',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  USER_PASSWORD: 'user_password', // For biometric unlock
  PIN_ATTEMPTS: 'pin_attempts',
  LAST_PIN_ATTEMPT: 'last_pin_attempt',
  PIN_BLOCKED_UNTIL: 'pin_blocked_until',
  // Add signup data storage keys
  SIGNUP_EMAIL: 'signup_email',
  SIGNUP_PASSWORD: 'signup_password',
  SIGNUP_FULLNAME: 'signup_fullname',
  SIGNUP_METADATA: 'signup_metadata',
};

const MAX_PIN_ATTEMPTS = 3;
const SUPABASE_TOKEN_STORAGE_KEY = 'sb-cpvgznbnczuqzmyvaxdo-auth-token';

export const SupabaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [hasPin, setHasPin] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<string | null>(null);
  const [pinAttemptsRemaining, setPinAttemptsRemaining] = useState(MAX_PIN_ATTEMPTS);
  const [isPinBlocked, setIsPinBlocked] = useState(false);
  const [isInSignupFlow, setIsInSignupFlow] = useState(false);
  const [requiresReauth, setRequiresReauth] = useState(false);

  // Session timeout tracking
  const backgroundTimeRef = useRef<number | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // AppState listener for session timeout
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // App going to background
      if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
        backgroundTimeRef.current = Date.now();
        console.log('App went to background at:', new Date().toISOString());
      }

      // App coming to foreground
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        if (backgroundTimeRef.current && session) {
          const timeInBackground = Date.now() - backgroundTimeRef.current;
          console.log('App returned to foreground after:', timeInBackground, 'ms');

          // If user was in background longer than timeout, require re-authentication
          if (timeInBackground >= SESSION_TIMEOUT_MS) {
            console.log('Session timeout - requiring re-authentication');
            setRequiresReauth(true);
          }
        }
        backgroundTimeRef.current = null;
      }

      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [session]);

  // Clear reauth requirement after successful login
  const clearReauthRequired = () => {
    setRequiresReauth(false);
  };

  useEffect(() => {
    // Complete any pending auth sessions (iOS)
    WebBrowser.maybeCompleteAuthSession();

    // Check for existing session on mount
    checkSession();

    // Check biometric availability
    checkBiometricAvailability();

    // Deep link handler for OAuth redirects
    const deepLinkSub = Linking.addEventListener('url', async ({ url }) => {
      try {
        console.log('Deep link received:', url);

        // Only process OAuth-related URLs (containing 'code=' or 'access_token=')
        if (!url.includes('code=') && !url.includes('access_token=') && !url.includes('auth/callback')) {
          console.log('Skipping non-OAuth deep link:', url);
          return;
        }

        const { data, error } = await supabase.auth.exchangeCodeForSession(url);
        if (error) {
          console.error('OAuth exchange error:', error);
          // Don't throw here, just log the error
        } else if (data?.session) {
          console.log('OAuth session established');
          setSession(data.session);
          setUser(data.session.user as ExtendedUser);
        }
      } catch (e) {
        console.error('Deep link handling error:', e);
        // Don't throw here, just log the error
      }
    });

    // Also handle initial URL on app launch
    const handleInitialURL = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl && (initialUrl.includes('code=') || initialUrl.includes('access_token=') || initialUrl.includes('auth/callback'))) {
          console.log('Processing initial OAuth URL:', initialUrl);
          const { data, error } = await supabase.auth.exchangeCodeForSession(initialUrl);
          if (error) {
            console.error('Initial OAuth exchange error:', error);
          } else if (data?.session) {
            console.log('Initial OAuth session established');
            setSession(data.session);
            setUser(data.session.user as ExtendedUser);
          }
        }
      } catch (error) {
        console.error('Error handling initial URL:', error);
      }
    };

    // Process initial URL
    handleInitialURL();

    // Listen for auth state changes with better error handling
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      try {
        setSession(session);

        if (session?.user) {
          // Load user PIN/biometric state from database
          await loadUserPinState(session.user.id);
          setUser(session.user as ExtendedUser);

          // Ensure backend profile is created/synced (stripe_customer_id, avatar, is_verified gate)
          try {
            await apiGet('/api/users/profile');
          } catch (e) {
            console.warn('Profile sync failed:', e);
          }
        } else {
          setUser(null);
          setHasPin(false);
          setBiometricEnabled(false);
        }

        // Handle session events
        if (event === 'SIGNED_IN') {
          if (__DEV__) console.log('Auth listener (primary): SIGNED_IN, attempting push registration');
          // Store session token in SecureStore for extra security if needed
          if (session?.access_token) {
            await SecureStore.setItemAsync('supabase_access_token', session.access_token);
          }
          // Attempt to register for push notifications (best-effort)
          try {
            if ((Device as any).isDevice) {
              const { status: existingStatus } = await Notifications.getPermissionsAsync();
              console.log('Push permission existingStatus', existingStatus);
              let finalStatus = existingStatus;
              if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                console.log('Push permission requested ->', status);
                finalStatus = status;
              }
              if (finalStatus === 'granted') {
                // Get project ID from EAS config - critical for production builds
                const projectId = (Constants as any)?.expoConfig?.extra?.eas?.projectId
                  || (Constants as any)?.easConfig?.projectId
                  || '3ff39fca-24d1-4af6-9c0f-970a8d5a6335'; // Fallback to known project ID
                console.log('Using projectId for push token:', projectId);

                try {
                  const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
                  console.log('Expo push token response:', JSON.stringify(tokenResponse));
                  const expoToken = (tokenResponse as any)?.data;
                  if (expoToken) {
                    const device_id = (Device as any).osBuildId || (Constants as any)?.deviceId || expoToken;
                    const platform = (Device as any).osName?.toLowerCase() || 'ios';
                    console.log('Registering device for push', { projectId, expoToken, platform, device_id });
                    try {
                      const resp = await apiPost('/api/notifications/register-device', { expo_push_token: expoToken, platform, device_id });
                      console.log('Device registration response', resp);
                    } catch (e) {
                      console.warn('Device registration API failed', e);
                    }
                  } else {
                    console.warn('No push token received from Expo');
                  }
                } catch (tokenError) {
                  console.error('Failed to get Expo push token:', tokenError);
                }
              } else {
                console.log('Push notification permission not granted');
              }
            } else {
              console.log('Not a physical device, skipping push registration');
            }
          } catch (e) { console.warn('Push registration error (SIGNED_IN)', e); }
        } else if (event === 'INITIAL_SESSION' && !session) {
          // Stale/invalid stored tokens on cold start: clear and stop
          try {
            await AsyncStorage.removeItem(SUPABASE_TOKEN_STORAGE_KEY).catch(()=>{});
            await AsyncStorage.multiRemove(['backend_jwt','backend_jwt_expires_at']).catch(()=>{});
          } catch {}
          setSession(null);
          setUser(null);
        } else if ((event as any) === 'TOKEN_REFRESHED') {
          if (__DEV__) console.log('Auth listener (primary): TOKEN_REFRESHED, attempting push registration');
          // Also try to register after token refresh to catch cold-start sessions
          try {
            if ((Device as any).isDevice) {
              const { status: existingStatus } = await Notifications.getPermissionsAsync();
              if (__DEV__) console.log('Push permission existingStatus (refresh)', existingStatus);
              let finalStatus = existingStatus;
              if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                if (__DEV__) console.log('Push permission requested (refresh) ->', status);
                finalStatus = status;
              }
              if (finalStatus === 'granted') {
                const projectId = (Constants as any)?.expoConfig?.extra?.eas?.projectId || (Constants as any)?.easConfig?.projectId;
                const tokenResponse = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
                const expoToken = (tokenResponse as any)?.data;
                if (expoToken) {
                  const device_id = (Device as any).osBuildId || (Constants as any)?.deviceId || expoToken;
                  const platform = (Device as any).platform || 'unknown';
                  if (__DEV__) console.log('Registering device for push (refresh)', { projectId, expoToken, platform, device_id });
                  try {
                    const resp = await apiPost('/api/notifications/register-device', { expo_push_token: expoToken, platform, device_id });
                    if (__DEV__) console.log('Device registration response (refresh)', resp);
                  } catch (e) { if (__DEV__) console.warn('Device registration failed (refresh)', e); }
                }
              }
            }
          } catch (e) { if (__DEV__) console.warn('Push registration error (TOKEN_REFRESHED)', e); }
        } else if (event === 'SIGNED_OUT') {
          // Clear stored tokens but preserve PIN/biometric settings unless explicitly cleared
          await SecureStore.deleteItemAsync('supabase_access_token');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
          try {
            await apiGet('/api/users/profile');
          } catch (e) {
            console.warn('Profile sync on refresh failed:', e);
          }
        }

        // Clear any auth errors on successful state changes
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || (event === 'INITIAL_SESSION' && !!session)) {
          setError(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        // Don't set error state for token refresh failures
        if (event !== 'TOKEN_REFRESHED') {
          setError(err as AuthError);
        }
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
      deepLinkSub.remove();
    };
  }, []);

  // Auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);

        setSession(session);
        setUser(session?.user || null);

        // Don't auto-redirect during signup flow
        if (isInSignupFlow) {
          console.log('In signup flow, not auto-redirecting');
          return;
        }

        if (event === 'SIGNED_IN') {
          console.log('User signed in');
          // Check if user has PIN
          if (session?.user?.id) {
            await loadUserPinState(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setHasPin(false);
          setBiometricEnabled(false);
          setBiometricType(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [isInSignupFlow]);

  const checkSession = async () => {
    try {
      setIsLoading(true);

      // Clear any problematic auth state first
      await clearProblematicAuthState();

      // Get current session with improved error handling
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Session check error:', error);
        // For refresh token errors, don't throw - just clear the session
        const msg = (error.message || '').toLowerCase();
        if (msg.includes('refresh token')) {
          console.log('Refresh token invalid/expired, clearing stored session');
          try {
            await supabase.auth.signOut();
          } catch {}
          try {
            await AsyncStorage.removeItem(SUPABASE_TOKEN_STORAGE_KEY).catch(()=>{});
            await AsyncStorage.multiRemove(['backend_jwt','backend_jwt_expires_at']).catch(()=>{});
          } catch {}
          setSession(null);
          setUser(null);
          return;
        }
        throw error;
      }

      setSession(session);

      if (session?.user) {
        await loadUserPinState(session.user.id);
        setUser(session.user as ExtendedUser);
      } else {
        setUser(null);
      }

    } catch (err) {
      console.error('Session check error:', err);
      // Don't set error state for token-related issues
      const errorMessage = (err as Error).message?.toLowerCase() || '';
      if (!errorMessage.includes('refresh token') && !errorMessage.includes('token')) {
        setError(err as AuthError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to clear problematic auth state
  const clearProblematicAuthState = async () => {
    try {
      // Check if there's any partial or corrupted auth state
      const storedData = await AsyncStorage.getItem('sb-cpvgznbnczuqzmyvaxdo-auth-token');
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          // If session exists but is expired or malformed, clear it
          if (parsed && (!parsed.access_token || !parsed.refresh_token)) {
            console.log('Clearing malformed auth state');
            await AsyncStorage.removeItem('sb-cpvgznbnczuqzmyvaxdo-auth-token');
          }
        } catch (parseError) {
          console.log('Clearing unparseable auth state');
          await AsyncStorage.removeItem('sb-cpvgznbnczuqzmyvaxdo-auth-token');
        }
      }
    } catch (error) {
      console.error('Error clearing problematic auth state:', error);
    }
  };

  const checkBiometricAvailability = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      if (hasHardware && supportedTypes.length > 0) {
        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('face_id');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('fingerprint');
        } else {
          setBiometricType('biometric');
        }
      }
    } catch (error) {
      console.error('Biometric check error:', error);
    }
  };

  const loadUserPinState = async (userId: string) => {
    try {
      // Check database for PIN and biometric state
      const { data: userData } = await supabase
        .from('users')
        .select('pin_hash, biometric_enabled')
        .eq('id', userId)
        .single();

      if (userData) {
        setHasPin(!!userData.pin_hash);
        setBiometricEnabled(userData.biometric_enabled || false);

        // Also check local storage
        const localBiometric = await SecureStore.getItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED);
        if (localBiometric === 'true' && !userData.biometric_enabled) {
          // Sync local state to database
          setBiometricEnabled(true);
        }
      }

      // Check PIN attempts
      await checkPinAttemptsInternal();
    } catch (error) {
      console.error('Error loading PIN state:', error);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) throw error;

      // Session will be handled by auth state listener
      console.log('Sign in successful:', data.user?.id);

    } catch (err) {
      setError(err as AuthError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, metadata?: { full_name?: string; phone?: string }) => {
    try {
      setError(null);
      setIsLoading(true);
      setIsInSignupFlow(true); // Start signup flow

      console.log('signUpWithEmail: Starting signup with metadata:', metadata);

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: metadata,
          emailRedirectTo: undefined, // This ensures we get OTP instead of magic link
        }
      });

      if (error) throw error;

      console.log('signUpWithEmail: Signup successful, user metadata:', data.user?.user_metadata);
      console.log('signUpWithEmail: User ID:', data.user?.id);
      console.log('signUpWithEmail: Confirmation sent via:', data.user?.confirmation_sent_at ? 'email' : 'unknown');

      // Store password temporarily for biometric setup later
      if (password) {
        await SecureStore.setItemAsync(STORAGE_KEYS.USER_PASSWORD, password);
      }

      // Store full name for later use
      if (metadata?.full_name) {
        await SecureStore.setItemAsync(STORAGE_KEYS.SIGNUP_FULLNAME, metadata.full_name);
      }

      // Supabase will send OTP automatically
      console.log('Sign up initiated, OTP sent:', data.user?.id);

    } catch (err) {
      setError(err as AuthError);
      setIsInSignupFlow(false); // Reset on error
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithOTP = async (email: string) => {
    try {
      setError(null);
      setIsLoading(true);

      // Send OTP - the actual format (magic link vs OTP code) depends on
      // the email template configuration in Supabase dashboard
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
      });

      if (error) throw error;

      // OTP sent successfully - check your email template configuration
      // to ensure it sends codes instead of magic links
      console.log('OTP sent to:', email);

    } catch (err) {
      setError(err as AuthError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (emailOrPhone: string, token: string, type: 'signup' | 'magiclink' | 'sms' = 'signup') => {
    try {
      setError(null);
      setIsLoading(true);

      const isPhone = /^\+?[1-9]\d{1,14}$/.test(emailOrPhone);

      const verifyParams: any = {
        token,
        type: isPhone ? 'sms' : type,
      };

      if (isPhone) {
        verifyParams.phone = emailOrPhone;
      } else {
        verifyParams.email = emailOrPhone.toLowerCase().trim();
      }

      const { data, error } = await supabase.auth.verifyOtp(verifyParams);

      if (error) throw error;

      console.log('OTP verification successful:', data.user?.id);

      // If this is a signup flow and we have user data, create user record in database
      if (data.user && isInSignupFlow) {
        console.log('verifyOTP: In signup flow, creating user record');
        console.log('verifyOTP: User object:', data.user);
        console.log('verifyOTP: User metadata:', data.user.user_metadata);

        try {
          // Get metadata from the user object (passed during signup)
          const metadata = data.user.user_metadata || {};
          let fullName = metadata.full_name || '';

          // If full_name not in metadata, try to get it from SecureStore
          if (!fullName) {
            fullName = await SecureStore.getItemAsync(STORAGE_KEYS.SIGNUP_FULLNAME) || '';
            console.log('verifyOTP: Retrieved fullName from SecureStore:', fullName);
          }

          console.log('verifyOTP: Extracted metadata:', metadata);
          console.log('verifyOTP: Extracted fullName:', fullName);

          // Create user record in database
          const userRecord = {
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            is_verified: true,
            failed_pin_attempts: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          console.log('verifyOTP: Creating user record:', userRecord);

          const { error: dbError } = await supabase
            .from('users')
            .upsert(userRecord);

          if (dbError) {
            console.error('Error creating user record:', dbError);
            // Don't throw here - user can still continue even if DB record fails
          } else {
            console.log('User record created successfully in database with full name:', fullName);
          }

          // Clear the stored full name
          await SecureStore.deleteItemAsync(STORAGE_KEYS.SIGNUP_FULLNAME);
        } catch (dbError) {
          console.error('Error creating user record:', dbError);
          // Don't throw here - user can still continue
        }
      }

      // Session will be handled by auth state listener

    } catch (err) {
      setError(err as AuthError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const redirectUri = makeRedirectUri({ scheme: 'ajo', path: 'auth/callback' });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          skipBrowserRedirect: true,
          redirectTo: redirectUri,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
        if (result.type === 'success' && result.url) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(result.url);
          if (exchangeError) throw exchangeError;
        } else if (result.type === 'cancel') {
          throw new Error('Google sign-in cancelled');
        }
      } else {
        throw new Error('Failed to start Google sign-in');
      }
    } catch (err) {
      setError(err as AuthError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setError(null);
      // Don't set global loading - handled by component level state
      // setIsLoading(true);

      // Import Apple Authentication dynamically
      const AppleAuthentication = await import('expo-apple-authentication');

      // Check if Apple Sign In is available
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Sign in with Apple is not available on this device');
      }

      // Request Apple credential
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('No identity token received from Apple');
      }

      // Sign in with Supabase using the Apple ID token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (error) throw error;

      // If we got the user's name from Apple (only provided on first sign-in),
      // save it to the user's profile
      if (data?.user && credential.fullName) {
        const fullName = [credential.fullName.givenName, credential.fullName.familyName]
          .filter(Boolean)
          .join(' ');

        if (fullName) {
          try {
            await supabase
              .from('users')
              .upsert({
                id: data.user.id,
                email: data.user.email,
                full_name: fullName,
                updated_at: new Date().toISOString(),
              });
          } catch (e) {
            console.warn('Failed to save Apple user name:', e);
          }
        }
      }

      console.log('Apple sign-in successful:', data.user?.id);

    } catch (err: any) {
      // Handle user cancellation gracefully
      if (err.code === 'ERR_CANCELED' || err.code === 'ERR_REQUEST_CANCELED') {
        console.log('Apple sign-in cancelled by user');
        return;
      }
      setError(err as AuthError);
      throw err;
    } finally {
      // Don't set global loading - handled by component level state
      // setIsLoading(false);
    }
  };

  const signOut = async (clearLocalData: boolean = false) => {
    try {
      setError(null);
      setIsLoading(true);

      const currentUserId = user?.id;

      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      // Clear session token
      await SecureStore.deleteItemAsync('supabase_access_token');

      // Clear backend JWTs so next user doesn’t reuse
      await AsyncStorage.multiRemove(['backend_jwt','backend_jwt_expires_at']).catch(()=>{});

      // Clear user-scoped caches
      if (currentUserId) {
        await AsyncStorage.removeItem(`wallet_recent_txns_v1:${currentUserId}`).catch(()=>{});
        await AsyncStorage.removeItem(`wallet_all_txns_v1:${currentUserId}`).catch(()=>{});
      }

      // Clear all auth state
      setSession(null);
      setUser(null);

      // Always reset hasPin and biometric state on logout
      setHasPin(false);
      setBiometricEnabled(false);
      setBiometricType(null);

      // Only clear stored PIN and biometric data if explicitly requested (account switch)
      if (clearLocalData) {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.PIN_HASH);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_PASSWORD);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.PIN_ATTEMPTS);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.PIN_BLOCKED_UNTIL);
      }

      console.log('Sign out successful');

    } catch (err) {
      setError(err as AuthError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      setError(null);

      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Session refresh error:', error);
        // For refresh token errors, try to get current session instead
        if (error.message?.includes('refresh token') || error.message?.includes('Refresh Token')) {
          console.log('Refresh token invalid, checking current session');
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData.session) {
            setSession(sessionData.session);
            if (sessionData.session.user) {
              await loadUserPinState(sessionData.session.user.id);
              setUser(sessionData.session.user as ExtendedUser);
            }
            return;
          } else {
            // No valid session, sign out
            await signOut();
            return;
          }
        }
        throw error;
      }

      setSession(data.session);

      if (data.session?.user) {
        await loadUserPinState(data.session.user.id);
        setUser(data.session.user as ExtendedUser);
      } else {
        setUser(null);
      }

      console.log('Session refreshed successfully');

    } catch (err) {
      console.error('Session refresh failed:', err);
      const errorMessage = (err as Error).message?.toLowerCase() || '';
      if (!errorMessage.includes('refresh token') && !errorMessage.includes('token')) {
        setError(err as AuthError);
        throw err;
      }
    }
  };

  const signInWithPhone = async (phone: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
    } catch (err) {
      setError(err as AuthError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPhoneOTP = async (phone: string, token: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
      if (error) throw error;
    } catch (err) {
      setError(err as AuthError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserExists = async (emailOrPhone: string): Promise<{ exists: boolean; hasPin: boolean }> => {
    try {
      const isPhone = /^\+?[1-9]\d{1,14}$/.test(emailOrPhone);
      const column = isPhone ? 'phone' : 'email';

      const { data, error } = await supabase
        .from('users')
        .select('id, pin_hash')
        .eq(column, emailOrPhone.toLowerCase())
        .single();

      if (error && error.code === 'PGRST116') {
        // No rows returned
        return { exists: false, hasPin: false };
      }

      if (error) throw error;

      return {
        exists: true,
        hasPin: !!data?.pin_hash
      };
    } catch (err) {
      console.error('Error checking user:', err);
      return { exists: false, hasPin: false };
    }
  };

  const setupPin = async (pin: string, enableBiometric: boolean = false, password?: string, fullName?: string) => {
    try {
      if (!user?.id) throw new Error('No user session');

      console.log('setupPin: Called with parameters:', {
        pinLength: pin.length,
        enableBiometric,
        hasPassword: !!password,
        fullName: fullName,
        userId: user.id,
        userEmail: user.email
      });

      // Hash PIN with user ID as salt
      const pinHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        pin + user.id,
        { encoding: Crypto.CryptoEncoding.HEX }
      );

      // Save to SecureStore
      await SecureStore.setItemAsync(STORAGE_KEYS.PIN_HASH, pinHash);

      // Store user email for PIN verification during login
      if (user.email) {
        await SecureStore.setItemAsync('user_email', user.email);
      }

      if (enableBiometric) {
        await SecureStore.setItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
        // Store password if provided for biometric unlock
        if (password) {
          await SecureStore.setItemAsync(STORAGE_KEYS.USER_PASSWORD, password);
        }
      }

      // Prepare update data
      const updateData: any = {
        id: user.id,
        email: user.email,
        pin_hash: pinHash,
        biometric_enabled: enableBiometric,
        biometric_type: enableBiometric ? biometricType : null,
        updated_at: new Date().toISOString(),
      };

      // Add fullName if provided
      if (fullName && fullName.trim()) {
        updateData.full_name = fullName.trim();
        console.log('setupPin: Storing full name:', updateData.full_name);
      } else {
        console.log('setupPin: No fullName provided or empty:', fullName);
      }

      console.log('setupPin: Update data being sent to database:', updateData);

      // Update database
      const { error } = await supabase
        .from('users')
        .upsert(updateData);

      if (error) {
        console.error('Database upsert error:', error);
        throw error;
      }

      console.log('User data successfully stored in database');

      setHasPin(true);
      setBiometricEnabled(enableBiometric);

      // Reset PIN attempts on successful setup
      await resetPinAttempts();

    } catch (error) {
      console.error('PIN setup error:', error);
      throw error;
    }
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    try {
      // Check if blocked
      const { blocked } = await checkPinAttemptsInternal();
      if (blocked) {
        throw new Error('PIN entry blocked. Please use password to unlock.');
      }

      // Get user email
      const userEmail = user?.email || await SecureStore.getItemAsync('user_email');
      if (!userEmail) {
        console.log('No user email available for PIN verification');
        return false;
      }

      // Get user data and PIN hash from database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('pin_hash, id')
        .eq('email', userEmail.toLowerCase().trim())
        .single();

      if (userError || !userData || !userData.pin_hash) {
        console.log('No user data or PIN hash found');
        return false;
      }

      let isValidPin = false;

      // Try RPC function first (if available)
      try {
        const { data: rpcResult, error: rpcError } = await supabase
          .rpc('rpc_verify_pin', {
            p_user_email: userEmail,
            p_pin_plain: pin
          });

        if (!rpcError) {
          isValidPin = rpcResult;
        } else {
          throw new Error('RPC not available');
        }
      } catch (rpcErr) {
        // Fallback to client-side verification
        console.log('Using client-side PIN verification');

        // Try both hashing methods for compatibility
        const inputHashWithId = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          pin + userData.id,
          { encoding: Crypto.CryptoEncoding.HEX }
        );

        const inputHashWithEmail = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          pin + userEmail.toLowerCase().trim(),
          { encoding: Crypto.CryptoEncoding.HEX }
        );

        // Check both hash methods for compatibility
        isValidPin = (inputHashWithId === userData.pin_hash) || (inputHashWithEmail === userData.pin_hash);
      }

      if (isValidPin) {
        await resetPinAttempts();
      } else {
        await incrementPinAttempts();
      }

      return isValidPin;
    } catch (error) {
      console.error('PIN verification error:', error);
      throw error;
    }
  };

  const updatePin = async (oldPin: string, newPin: string) => {
    const isValid = await verifyPin(oldPin);
    if (!isValid) throw new Error('Current PIN is incorrect');

    await setupPin(newPin, biometricEnabled);
  };

  const authenticateWithBiometric = async (): Promise<boolean> => {
    try {
      if (!biometricEnabled || !biometricType) return false;

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your account',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: true,
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };

  const enableBiometric = async (password: string) => {
    try {
      if (!user) throw new Error('No user session');

      // Verify password first
      const isValid = await authenticateWithPassword(password);
      if (!isValid) throw new Error('Invalid password');

      // Test biometric authentication
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable biometric authentication',
        fallbackLabel: 'Cancel',
      });

      if (!result.success) throw new Error('Biometric authentication failed');

      // Save settings
      await SecureStore.setItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_PASSWORD, password);

      // Update database
      await supabase
        .from('users')
        .update({
          biometric_enabled: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      setBiometricEnabled(true);
    } catch (error) {
      console.error('Enable biometric error:', error);
      throw error;
    }
  };

  const disableBiometric = async () => {
    try {
      if (!user) throw new Error('No user session');

      await SecureStore.deleteItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_PASSWORD);

      await supabase
        .from('users')
        .update({
          biometric_enabled: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      setBiometricEnabled(false);
    } catch (error) {
      console.error('Disable biometric error:', error);
      throw error;
    }
  };

  const checkPinAttemptsInternal = async () => {
    try {
      if (!user?.email) {
        // Try to get email from stored email if user not loaded yet
        const storedEmail = await SecureStore.getItemAsync('user_email');
        if (!storedEmail) {
          return { attempts: 0, blocked: false };
        }

        // Check database for attempts
        const { data, error } = await supabase
          .from('users')
          .select('failed_pin_attempts')
          .eq('email', storedEmail)
          .single();

        if (error || !data) {
          return { attempts: 0, blocked: false };
        }

        const currentAttempts = data.failed_pin_attempts || 0;
        const blocked = currentAttempts >= MAX_PIN_ATTEMPTS;

        setPinAttemptsRemaining(MAX_PIN_ATTEMPTS - currentAttempts);
        setIsPinBlocked(blocked);

        return { attempts: currentAttempts, blocked };
      }

      // Check database for attempts using user email
      const { data, error } = await supabase
        .from('users')
        .select('failed_pin_attempts')
        .eq('email', user.email)
        .single();

      if (error || !data) {
        return { attempts: 0, blocked: false };
      }

      const currentAttempts = data.failed_pin_attempts || 0;
      const blocked = currentAttempts >= MAX_PIN_ATTEMPTS;

      setPinAttemptsRemaining(MAX_PIN_ATTEMPTS - currentAttempts);
      setIsPinBlocked(blocked);

      return { attempts: currentAttempts, blocked };
    } catch (error) {
      console.error('Check PIN attempts error:', error);
      return { attempts: 0, blocked: false };
    }
  };

  const checkPinAttempts = async () => {
    return checkPinAttemptsInternal();
  };

  const incrementPinAttempts = async () => {
    try {
      const userEmail = user?.email || await SecureStore.getItemAsync('user_email');
      if (!userEmail) {
        console.error('No user email available for incrementing PIN attempts');
        return;
      }

      const { attempts } = await checkPinAttemptsInternal();
      const newAttempts = attempts + 1;

      // Update database
      const { error } = await supabase
        .from('users')
        .update({
          failed_pin_attempts: newAttempts,
          updated_at: new Date().toISOString()
        })
        .eq('email', userEmail);

      if (error) {
        console.error('Error updating failed PIN attempts:', error);
        return;
      }

      const blocked = newAttempts >= MAX_PIN_ATTEMPTS;
      setPinAttemptsRemaining(MAX_PIN_ATTEMPTS - newAttempts);
      setIsPinBlocked(blocked);
    } catch (error) {
      console.error('Increment PIN attempts error:', error);
    }
  };

  const resetPinAttempts = async () => {
    try {
      const userEmail = user?.email || await SecureStore.getItemAsync('user_email');
      if (!userEmail) {
        console.error('No user email available for resetting PIN attempts');
        return;
      }

      // Update database
      const { error } = await supabase
        .from('users')
        .update({
          failed_pin_attempts: 0,
          updated_at: new Date().toISOString()
        })
        .eq('email', userEmail);

      if (error) {
        console.error('Error resetting failed PIN attempts:', error);
        return;
      }

      setPinAttemptsRemaining(MAX_PIN_ATTEMPTS);
      setIsPinBlocked(false);
    } catch (error) {
      console.error('Reset PIN attempts error:', error);
    }
  };

  const authenticateWithPassword = async (password: string): Promise<boolean> => {
    try {
      const userEmail = user?.email || await SecureStore.getItemAsync('user_email');
      if (!userEmail) return false;

      // Try to sign in with password to verify it's correct
      const { error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password,
      });

      if (!error) {
        // Password is valid - also reset PIN attempts
        await resetPinAttempts();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Password authentication error:', error);
      return false;
    }
  };

  const setSignupFlowComplete = () => {
    setIsInSignupFlow(false);
  };

  // New function to initiate signup without creating user
  const initiateSignup = async (email: string, password: string, fullName: string) => {
    try {
      setError(null);
      setIsLoading(true);
      setIsInSignupFlow(true);

      console.log('initiateSignup: Starting signup process for:', email);

      // Store signup data locally
      await SecureStore.setItemAsync(STORAGE_KEYS.SIGNUP_EMAIL, email.toLowerCase().trim());
      await SecureStore.setItemAsync(STORAGE_KEYS.SIGNUP_PASSWORD, password);
      await SecureStore.setItemAsync(STORAGE_KEYS.SIGNUP_FULLNAME, fullName);

      // Send OTP using signInWithOtp (which works for both existing and new users)
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          shouldCreateUser: false, // Don't create user in Auth yet
        }
      });

      if (error) {
        console.error('Error sending OTP:', error);
        // Don't throw for "User not found" - that's expected
        if (!error.message?.includes('User not found')) {
          throw error;
        }
      }

      console.log('OTP sent successfully for signup');

    } catch (err) {
      console.error('Signup initiation error:', err);
      setError(err as AuthError);
      setIsInSignupFlow(false);
      // Clear stored data on error
      await SecureStore.deleteItemAsync(STORAGE_KEYS.SIGNUP_EMAIL);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.SIGNUP_PASSWORD);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.SIGNUP_FULLNAME);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // New function for signup OTP verification
  const verifySignupOTP = async (email: string, token: string) => {
    try {
      setError(null);
      setIsLoading(true);

      console.log('verifySignupOTP: Verifying OTP for signup');

      // Get stored signup data
      const storedEmail = await SecureStore.getItemAsync(STORAGE_KEYS.SIGNUP_EMAIL);
      const storedPassword = await SecureStore.getItemAsync(STORAGE_KEYS.SIGNUP_PASSWORD);
      const storedFullName = await SecureStore.getItemAsync(STORAGE_KEYS.SIGNUP_FULLNAME);

      if (!storedEmail || !storedPassword || storedEmail !== email.toLowerCase().trim()) {
        throw new Error('Signup data not found or email mismatch');
      }

      // First verify the OTP
      const { error: otpError } = await supabase.auth.verifyOtp({
        email: email.toLowerCase().trim(),
        token,
        type: 'email',
      });

      // If OTP is valid but user doesn't exist, create the user
      if (otpError && otpError.message?.includes('User not found')) {
        console.log('OTP valid but user not found, creating user now');

        // Create the user with the stored password
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: storedEmail,
          password: storedPassword,
          options: {
            data: { full_name: storedFullName },
            emailRedirectTo: undefined,
          }
        });

        if (signUpError) throw signUpError;

        console.log('User created successfully:', signUpData.user?.id);

        // Create user record in database
        if (signUpData.user) {
          try {
            const { error: dbError } = await supabase
              .from('users')
              .upsert({
                id: signUpData.user.id,
                email: signUpData.user.email,
                full_name: storedFullName,
                is_verified: true,
                failed_pin_attempts: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });

            if (dbError) {
              console.error('Error creating user record:', dbError);
            } else {
              console.log('User record created in database with full name:', storedFullName);
            }
          } catch (dbError) {
            console.error('Error creating user record:', dbError);
          }
        }

        // Sign in the user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: storedEmail,
          password: storedPassword,
        });

        if (signInError) throw signInError;

        console.log('User signed in successfully after signup');

      } else if (otpError) {
        throw otpError;
      } else {
        // User already exists, just sign them in
        console.log('User already exists, signing in');
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: storedEmail,
          password: storedPassword,
        });

        if (signInError) throw signInError;
      }

      // Clear stored signup data (except password which might be needed for biometric setup)
      await SecureStore.deleteItemAsync(STORAGE_KEYS.SIGNUP_EMAIL);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.SIGNUP_FULLNAME);

      console.log('Signup OTP verification completed successfully');

    } catch (err) {
      setError(err as AuthError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    error,
    signInWithEmail,
    signUpWithEmail,
    initiateSignup,
    verifySignupOTP,
    signInWithOTP,
    verifyOTP,
    signInWithGoogle,
    signInWithApple,
    signInWithPhone,
    verifyPhoneOTP,
    signOut,
    checkUserExists,
    setupPin,
    verifyPin,
    updatePin,
    authenticateWithBiometric,
    enableBiometric,
    disableBiometric,
    checkPinAttempts,
    resetPinAttempts,
    authenticateWithPassword,
    refreshSession,
    hasPin,
    biometricEnabled,
    biometricType,
    pinAttemptsRemaining,
    isPinBlocked,
    isInSignupFlow,
    requiresReauth,
    setSignupFlowComplete,
    clearReauthRequired,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

export default AuthContext;
