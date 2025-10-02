import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser, useAuth } from '@clerk/clerk-expo';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profileImageUrl?: string;
  hasPin: boolean;
  biometricEnabled: boolean;
}

interface AuthContextType {
  // User state
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  
  // PIN management
  hasPin: boolean;
  setupPin: (pin: string, enableBiometric?: boolean) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  updatePin: (oldPin: string, newPin: string) => Promise<void>;
  
  // Biometric management
  biometricEnabled: boolean;
  biometricType: string | null;
  enableBiometric: () => Promise<void>;
  disableBiometric: () => Promise<void>;
  authenticateWithBiometric: () => Promise<boolean>;
  
  // Session management
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  
  // Local credentials
  hasLocalCredentials: boolean;
  clearLocalCredentials: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Secure storage keys
const STORAGE_KEYS = {
  PIN_HASH: 'user_pin_hash',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  USER_EMAIL: 'user_email',
  HAS_LOCAL_CREDENTIALS: 'has_local_credentials',
  LOCAL_SIGNED_OUT: 'local_signed_out',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { signOut: clerkSignOut } = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [hasPin, setHasPin] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<string | null>(null);
  const [hasLocalCredentials, setHasLocalCredentials] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLocallySignedOut, setIsLocallySignedOut] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    if (clerkLoaded) {
      initializeAuth();
    }
  }, [clerkUser, clerkLoaded]);

  const initializeAuth = async () => {
    try {
      if (!clerkLoaded) {
        console.log('Clerk not loaded yet, waiting...');
        return;
      }

      console.log('initializeAuth: clerkUser:', !!clerkUser);
      
      // Always check biometric availability
      await checkBiometricAvailability();
      
      if (clerkUser) {
        // Load user data and PIN status
        await loadUserData();
        await checkLocalCredentials();
      } else {
        // No Clerk user - check for stale local credentials
        const storedEmail = await SecureStore.getItemAsync(STORAGE_KEYS.USER_EMAIL);
        const hasCredentials = await SecureStore.getItemAsync(STORAGE_KEYS.HAS_LOCAL_CREDENTIALS);
        
        if (storedEmail || hasCredentials === 'true') {
          console.log('Found stale local credentials without Clerk user, cleaning up...');
          // Clear all stale local data
          await clearAllLocalData();
        }
        
        // Update state to reflect no credentials
        setHasLocalCredentials(false);
        setHasPin(false);
        setBiometricEnabled(false);
      }
      
      setIsLoaded(true);
      console.log('Auth initialization complete');
    } catch (error) {
      console.error('Auth initialization error:', error);
      setIsLoaded(true);
    }
  };

  const loadUserData = async () => {
    if (!clerkUser) {
      console.log('loadUserData: No clerkUser available');
      return;
    }

    console.log('loadUserData: Loading data for user:', clerkUser.id, clerkUser.primaryEmailAddress?.emailAddress);

    try {
      // Check if PIN exists in secure storage
      const pinHash = await SecureStore.getItemAsync(STORAGE_KEYS.PIN_HASH);
      const bioEnabled = await SecureStore.getItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED);
      
      console.log('loadUserData: Secure storage check:', { hasPinHash: !!pinHash, bioEnabled });
      
      setHasPin(!!pinHash);
      setBiometricEnabled(bioEnabled === 'true');

      // Create user object
      const userData: User = {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        profileImageUrl: clerkUser.imageUrl,
        hasPin: !!pinHash,
        biometricEnabled: bioEnabled === 'true',
      };

      console.log('loadUserData: Created user data:', userData);
      setUser(userData);

      // Sync user data to Supabase
      await syncUserToSupabase(userData);
      console.log('loadUserData: User data synced to Supabase');

    } catch (error) {
      console.error('Load user data error:', error);
    }
  };

  const syncUserToSupabase = async (userData: User) => {
    try {
      console.log('Syncing user to Supabase:', userData.id);
      
      // First try to insert the user
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: userData.id,
          email: userData.email,
          first_name: userData.firstName || '',
          last_name: userData.lastName || '',
          profile_image_url: userData.profileImageUrl,
          biometric_enabled: userData.biometricEnabled,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        // If user exists (unique constraint), try to update
        if (insertError.code === '23505') {
          const { error: updateError } = await supabase
            .from('users')
            .update({
              first_name: userData.firstName || '',
              last_name: userData.lastName || '',
              profile_image_url: userData.profileImageUrl,
              biometric_enabled: userData.biometricEnabled,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userData.id);
            
          if (updateError) {
            console.error('User update error:', updateError);
          } else {
            console.log('User updated in Supabase');
          }
        } else {
          console.error('Supabase sync error:', insertError);
        }
      } else {
        console.log('User successfully created in Supabase');
      }
    } catch (error) {
      console.error('Supabase sync error:', error);
      // Don't throw - app works without Supabase sync
    }
  };

  const checkBiometricAvailability = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      if (hasHardware && supportedTypes.length > 0) {
        // Determine biometric type
        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('face_id');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('fingerprint');
        } else {
          setBiometricType('biometric');
        }
      } else {
        setBiometricType(null);
      }
    } catch (error) {
      console.error('Biometric check error:', error);
      setBiometricType(null);
    }
  };

  const checkLocalCredentials = async () => {
    try {
      const hasCredentials = await SecureStore.getItemAsync(STORAGE_KEYS.HAS_LOCAL_CREDENTIALS);
      setHasLocalCredentials(hasCredentials === 'true');
    } catch (error) {
      console.error('Local credentials check error:', error);
      setHasLocalCredentials(false);
    }
  };

  const setupPin = async (pin: string, enableBiometric: boolean = false) => {
    console.log('setupPin called with:', { user: !!user, clerkUser: !!clerkUser, isLoaded, clerkLoaded });
    
    if (!clerkUser || !clerkLoaded) {
      throw new Error('Authentication not ready. Please wait and try again.');
    }
    
    // Get the user email directly from clerkUser if user state isn't ready
    let currentUser = user;
    let userEmail = user?.email;
    
    if (!currentUser) {
      console.log('User state not ready, creating from clerkUser...');
      currentUser = {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        profileImageUrl: clerkUser.imageUrl,
        hasPin: false,
        biometricEnabled: false,
      };
      userEmail = currentUser.email;
      setUser(currentUser);
    }
    
    if (!userEmail) {
      throw new Error('Unable to determine user email. Please sign in again.');
    }

    try {
      // Hash the PIN using crypto
      const pinHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        pin + userEmail, // Salt with email for additional security
        { encoding: Crypto.CryptoEncoding.HEX }
      );

      // Store PIN hash securely
      await SecureStore.setItemAsync(STORAGE_KEYS.PIN_HASH, pinHash);
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_EMAIL, userEmail);
      await SecureStore.setItemAsync(STORAGE_KEYS.HAS_LOCAL_CREDENTIALS, 'true');

      if (enableBiometric && biometricType) {
        await SecureStore.setItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
        setBiometricEnabled(true);
      }

      // Update Supabase (skip if it fails - not critical for app functionality)
      try {
        // First try to insert
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: currentUser.id,
            email: userEmail,
            first_name: currentUser.firstName || '',
            last_name: currentUser.lastName || '',
            pin_hash: pinHash,
            biometric_enabled: enableBiometric,
            biometric_type: enableBiometric ? biometricType : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (insertError) {
          // If insert fails (user exists), try update
          if (insertError.code === '23505') { // Unique violation
            const { error: updateError } = await supabase
              .from('users')
              .update({
                pin_hash: pinHash,
                biometric_enabled: enableBiometric,
                biometric_type: enableBiometric ? biometricType : null,
                updated_at: new Date().toISOString(),
              })
              .eq('id', currentUser.id);
              
            if (updateError) {
              console.error('PIN update Supabase error:', updateError);
            }
          } else {
            console.error('PIN insert Supabase error:', insertError);
          }
        }
      } catch (dbError) {
        console.error('Supabase operation failed:', dbError);
        // Continue without Supabase - app will work with local storage
      }

      setHasPin(true);
      setHasLocalCredentials(true);

      // Update user object
      setUser(prev => ({
        ...currentUser,
        hasPin: true,
        biometricEnabled: enableBiometric,
      }));

    } catch (error) {
      console.error('PIN setup error:', error);
      throw error;
    }
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    try {
      let storedHash = await SecureStore.getItemAsync(STORAGE_KEYS.PIN_HASH);
      let storedEmail = await SecureStore.getItemAsync(STORAGE_KEYS.USER_EMAIL);
      
      // If no local PIN hash, try to get from database
      if (!storedHash && storedEmail) {
        console.log('No local PIN hash, checking database...');
        
        // Try to get PIN hash from Supabase
        const { data: userData, error } = await supabase
          .from('users')
          .select('pin_hash')
          .eq('email', storedEmail)
          .single();
          
        if (userData?.pin_hash) {
          console.log('Found PIN hash in database');
          storedHash = userData.pin_hash;
          
          // Store it back in local storage for next time
          await SecureStore.setItemAsync(STORAGE_KEYS.PIN_HASH, userData.pin_hash);
        } else {
          console.log('No PIN hash found in database either');
        }
      }
      
      if (!storedHash || !storedEmail) {
        console.log('No stored PIN or email found');
        return false;
      }

      // Hash the provided PIN with the stored email as salt
      const inputHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        pin + storedEmail,
        { encoding: Crypto.CryptoEncoding.HEX }
      );

      return inputHash === storedHash;
    } catch (error) {
      console.error('PIN verification error:', error);
      return false;
    }
  };

  const updatePin = async (oldPin: string, newPin: string) => {
    const isOldPinValid = await verifyPin(oldPin);
    if (!isOldPinValid) {
      throw new Error('Current PIN is incorrect');
    }

    await setupPin(newPin, biometricEnabled);
  };

  const enableBiometric = async () => {
    if (!biometricType) {
      throw new Error('Biometric authentication not available');
    }

    try {
      // Check if biometrics are enrolled
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        throw new Error('No biometrics enrolled on this device');
      }

      // Test biometric authentication
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable biometric authentication',
        fallbackLabel: 'Use PIN',
      });

      if (result.success) {
        await SecureStore.setItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
        setBiometricEnabled(true);

        // Update Supabase
        if (user) {
          await supabase
            .from('users')
            .update({ 
              biometric_enabled: true,
              biometric_type: biometricType,
            })
            .eq('id', user.id);

          setUser(prev => prev ? { ...prev, biometricEnabled: true } : null);
        }
      } else {
        throw new Error('Biometric authentication failed');
      }
    } catch (error) {
      console.error('Enable biometric error:', error);
      throw error;
    }
  };

  const disableBiometric = async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED);
      setBiometricEnabled(false);

      if (user) {
        await supabase
          .from('users')
          .update({ 
            biometric_enabled: false,
            biometric_type: null,
          })
          .eq('id', user.id);

        setUser(prev => prev ? { ...prev, biometricEnabled: false } : null);
      }
    } catch (error) {
      console.error('Disable biometric error:', error);
      throw error;
    }
  };

  const authenticateWithBiometric = async (): Promise<boolean> => {
    if (!biometricEnabled || !biometricType) return false;

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your account',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: true,  // Use only biometric, not device passcode
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };

  const clearLocalCredentials = async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_EMAIL);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.HAS_LOCAL_CREDENTIALS);
      setHasLocalCredentials(false);
    } catch (error) {
      console.error('Clear local credentials error:', error);
    }
  };

  const clearAllLocalData = async () => {
    try {
      // Clear all secure storage items
      await SecureStore.deleteItemAsync(STORAGE_KEYS.PIN_HASH);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_EMAIL);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.HAS_LOCAL_CREDENTIALS);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.LOCAL_SIGNED_OUT);
      
      // Also clear the authenticated_user key that might be set elsewhere
      await SecureStore.deleteItemAsync('authenticated_user');
      
      console.log('All local data cleared');
    } catch (error) {
      console.error('Clear all local data error:', error);
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting sign out process...');
      
      // Clear only biometric settings, keep PIN and email for re-login
      try {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED);
        // Keep PIN_HASH, USER_EMAIL, and HAS_LOCAL_CREDENTIALS for re-login
      } catch (err) {
        console.error('Error clearing secure storage:', err);
      }
      
      // Reset state
      setUser(null);
      setHasPin(false);
      setBiometricEnabled(false);
      // Keep hasLocalCredentials true so user goes to Login screen
      
      // Sign out from Clerk
      if (clerkSignOut && typeof clerkSignOut === 'function') {
        try {
          await clerkSignOut({ redirectUrl: undefined });
          console.log('Clerk sign out successful');
        } catch (clerkError: any) {
          console.error('Clerk sign out error:', clerkError);
          // Try alternative approach
          try {
            if (clerkError?.message?.includes('origin')) {
              // This error happens in React Native, just continue
              console.log('Ignoring origin error in React Native environment');
            }
          } catch (e) {
            console.log('Error handling failed, continuing with local signout');
          }
        }
      }
      
      console.log('User signed out, will redirect to Login screen');
    } catch (error) {
      console.error('Sign out error:', error);
      // Don't throw - just log the error
    }
  };

  const refreshSession = async () => {
    if (clerkUser) {
      await loadUserData();
    }
  };

  const value: AuthContextType = {
    user,
    isLoaded,
    isSignedIn: !!clerkUser,
    hasPin,
    setupPin,
    verifyPin,
    updatePin,
    biometricEnabled,
    biometricType,
    enableBiometric,
    disableBiometric,
    authenticateWithBiometric,
    signOut,
    refreshSession,
    hasLocalCredentials,
    clearLocalCredentials,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
