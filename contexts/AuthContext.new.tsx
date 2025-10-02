import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser, useAuth, useSignIn } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  // Clerk session state
  isSessionActive: boolean;
  clerkUser: any;
  
  // Local app state
  storedEmail: string | null;
  hasBiometricsEnabled: boolean;
  appUnlocked: boolean;
  
  // Biometric state
  biometricType: string | null;
  isBiometricSupported: boolean;
  
  // Actions
  setStoredEmail: (email: string) => Promise<void>;
  setAppUnlocked: (unlocked: boolean) => void;
  enableBiometrics: () => Promise<void>;
  disableBiometrics: () => Promise<void>;
  authenticateWithBiometric: () => Promise<boolean>;
  lockApp: () => void;
  
  // Loading states
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Storage keys
const STORAGE_KEYS = {
  STORED_EMAIL: '@ajo/stored_email',
  HAS_BIOMETRICS_ENABLED: '@ajo/has_biometrics_enabled',
  APP_UNLOCKED: '@ajo/app_unlocked',
  BIOMETRIC_KEY_ID: 'biometric_device_secret',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { isSignedIn } = useAuth();
  
  // Local state
  const [storedEmail, setStoredEmailState] = useState<string | null>(null);
  const [hasBiometricsEnabled, setHasBiometricsEnabled] = useState(false);
  const [appUnlocked, setAppUnlockedState] = useState(false);
  const [biometricType, setBiometricType] = useState<string | null>(null);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize local state from storage
  useEffect(() => {
    loadLocalState();
  }, []);

  // Check biometric hardware on mount
  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const loadLocalState = async () => {
    try {
      const [email, biometricsEnabled, unlocked] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.STORED_EMAIL),
        AsyncStorage.getItem(STORAGE_KEYS.HAS_BIOMETRICS_ENABLED),
        AsyncStorage.getItem(STORAGE_KEYS.APP_UNLOCKED),
      ]);

      setStoredEmailState(email);
      setHasBiometricsEnabled(biometricsEnabled === 'true');
      setAppUnlockedState(unlocked === 'true');
    } catch (error) {
      console.error('Error loading local state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkBiometricSupport = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (hasHardware && isEnrolled) {
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        
        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('face_id');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('fingerprint');
        } else {
          setBiometricType('biometric');
        }
        setIsBiometricSupported(true);
      } else {
        setIsBiometricSupported(false);
        setBiometricType(null);
      }
    } catch (error) {
      console.error('Biometric check error:', error);
      setIsBiometricSupported(false);
    }
  };

  const setStoredEmail = async (email: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STORED_EMAIL, email.toLowerCase());
      setStoredEmailState(email.toLowerCase());
    } catch (error) {
      console.error('Error storing email:', error);
      throw error;
    }
  };

  const setAppUnlocked = (unlocked: boolean) => {
    AsyncStorage.setItem(STORAGE_KEYS.APP_UNLOCKED, unlocked ? 'true' : 'false')
      .catch(console.error);
    setAppUnlockedState(unlocked);
  };

  const enableBiometrics = async () => {
    if (!isBiometricSupported) {
      throw new Error('Biometric authentication not supported on this device');
    }

    try {
      // Generate random device secret
      const deviceSecret = generateDeviceSecret();
      
      // Store with biometric protection
      await SecureStore.setItemAsync(STORAGE_KEYS.BIOMETRIC_KEY_ID, deviceSecret, {
        requireAuthentication: true,
        authenticationPrompt: 'Authenticate to enable biometrics',
      });

      // Update local state
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_BIOMETRICS_ENABLED, 'true');
      setHasBiometricsEnabled(true);
    } catch (error) {
      console.error('Enable biometrics error:', error);
      throw error;
    }
  };

  const disableBiometrics = async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.BIOMETRIC_KEY_ID);
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_BIOMETRICS_ENABLED, 'false');
      setHasBiometricsEnabled(false);
    } catch (error) {
      console.error('Disable biometrics error:', error);
      throw error;
    }
  };

  const authenticateWithBiometric = async (): Promise<boolean> => {
    if (!hasBiometricsEnabled || !isBiometricSupported) {
      return false;
    }

    try {
      // First authenticate with biometric
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to unlock app',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: true,
      });

      if (!result.success) {
        return false;
      }

      // Try to read the secure store - this will also prompt biometric if needed
      const secret = await SecureStore.getItemAsync(STORAGE_KEYS.BIOMETRIC_KEY_ID);
      
      if (secret) {
        setAppUnlocked(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };

  const lockApp = () => {
    setAppUnlocked(false);
  };

  const generateDeviceSecret = (): string => {
    // Generate a random UUID for device secret
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const value: AuthContextType = {
    // Clerk session state
    isSessionActive: isSignedIn ?? false,
    clerkUser,
    
    // Local app state
    storedEmail,
    hasBiometricsEnabled,
    appUnlocked,
    
    // Biometric state
    biometricType,
    isBiometricSupported,
    
    // Actions
    setStoredEmail,
    setAppUnlocked,
    enableBiometrics,
    disableBiometrics,
    authenticateWithBiometric,
    lockApp,
    
    // Loading states
    isLoading: !clerkLoaded || isLoading,
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
