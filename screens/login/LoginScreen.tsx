import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ArrowLeft, Eye, EyeOff, ScanFace } from 'lucide-react-native';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { supabase } from '../../lib/supabase';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import * as LocalAuthentication from 'expo-local-authentication';
import { apiGet } from '../../lib/api';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const {
    signInWithEmail,
    authenticateWithBiometric,
    biometricEnabled,
    biometricType,
    user,
    hasPin,
    isLoading: authLoading,
    // signInWithGoogle, // Google auth disabled
    signInWithApple,
    requiresReauth,
    clearReauthRequired
  } = useAuth();

  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Google auth disabled
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [attemptedBiometric, setAttemptedBiometric] = useState(false);
  const [canGoBack] = useState(navigation.canGoBack());
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [requirePassword, setRequirePassword] = useState(false);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false); // Toggle for password login option
  const [localBiometricType, setLocalBiometricType] = useState<string | null>(null);
  const [hasStoredPassword, setHasStoredPassword] = useState(false);
  const [storedBiometricEnabled, setStoredBiometricEnabled] = useState(false);
  const passwordInputRef = useRef<TextInput>(null);
  const loginInProgressRef = useRef(false); // Prevent double-clicks
  const [isSwitchingAccounts, setIsSwitchingAccounts] = useState(false);
  const [hasPreviouslyLoggedIn, setHasPreviouslyLoggedIn] = useState(false);

  // Remove eager navigation; let App.tsx handle gating
  useEffect(() => {
    // Intentionally do not navigate here; App.tsx will reset to VerifyAccount or MainTabs
  }, [user, hasPin, navigation]);

  // Check failed attempts and biometric availability on mount
  useEffect(() => {
    checkFailedAttempts();
    checkBiometricAvailability();
    checkStoredPassword();
  }, []);

  // Check if biometrics are available on the device
  const checkBiometricAvailability = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      if (hasHardware && isEnrolled && supportedTypes.length > 0) {
        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setLocalBiometricType('face_id');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setLocalBiometricType('fingerprint');
        } else {
          setLocalBiometricType('biometric');
        }
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  };

  // Check if there's a stored password and biometric settings for this device
  const checkStoredPassword = async () => {
    try {
      const storedPassword = await SecureStore.getItemAsync('user_password');
      const storedEmail = await SecureStore.getItemAsync('user_email');
      const storedPin = await SecureStore.getItemAsync('user_pin_hash');
      const biometricEnabledStored = await SecureStore.getItemAsync('biometric_enabled');

      setHasStoredPassword(!!storedPassword);
      setStoredBiometricEnabled(biometricEnabledStored === 'true');

      // Check if user has previously logged in (has any stored credentials)
      const hasAnyStoredCredentials = !!(storedPassword || storedEmail || storedPin || biometricEnabledStored);
      setHasPreviouslyLoggedIn(hasAnyStoredCredentials);
    } catch (error) {
      console.error('Error checking stored password/biometric:', error);
      setHasStoredPassword(false);
      setStoredBiometricEnabled(false);
      setHasPreviouslyLoggedIn(false);
    }
  };

  // Auto-attempt biometric authentication is DISABLED
  // User must explicitly click the Face ID button to trigger biometric login
  // This prevents automatic re-login after logout
  /*
  useEffect(() => {
    const checkAndAttemptBiometric = async () => {
      // Only auto-attempt if biometric is enabled in user's account settings
      const storedBiometricEnabled = await SecureStore.getItemAsync('biometric_enabled');
      const isBiometricEnabled = biometricEnabled || storedBiometricEnabled === 'true';

      if (isBiometricEnabled && (biometricType || localBiometricType) && !attemptedBiometric && !user && !requirePassword) {
        setAttemptedBiometric(true);
        handleUseFaceID();
      }
    };

    checkAndAttemptBiometric();
  }, [biometricEnabled, biometricType, localBiometricType, attemptedBiometric, user, requirePassword]);
  */

  // Auto-focus password input when it becomes visible
  useEffect(() => {
    if (requirePassword && passwordInputRef.current) {
      // Small delay to ensure the input is rendered
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    }
  }, [requirePassword]);

  const checkFailedAttempts = async () => {
    try {
      const storedEmail = await SecureStore.getItemAsync('user_email');
      console.log('checkFailedAttempts: storedEmail =', storedEmail);

      if (storedEmail) {
        setEmail(storedEmail);
        // User has stored email - they can use PIN by default
        // We DON'T auto-lock based on database data to avoid stale locks
        setShowPasswordLogin(false);
        setRequirePassword(false);
        setFailedAttempts(0);
      } else {
        // First-time user or no stored email - show password login by default
        console.log('No stored email - showing password login for first-time user');
        setShowPasswordLogin(true);
        setRequirePassword(false);
      }
    } catch (error) {
      console.error('Error checking failed attempts:', error);
      // On error, default to password login for safety
      setShowPasswordLogin(true);
    }
  };

  const updateFailedAttempts = async (attempts: number) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          failed_pin_attempts: attempts,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (error) {
        console.error('Error updating failed attempts:', error);
      }
    } catch (error) {
      console.error('Error updating failed attempts:', error);
    }
  };

  const resetFailedAttempts = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          failed_pin_attempts: 0,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (error) {
        console.error('Error resetting failed attempts:', error);
      }

      setFailedAttempts(0);
      setRequirePassword(false);
    } catch (error) {
      console.error('Error resetting failed attempts:', error);
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Welcome' as never);
    }
  };

  const handlePinChange = (value: string) => {
    // Only allow numeric input up to 4 digits
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 4) {
      setPin(numericValue);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const handleSwitchAccounts = async () => {
    Alert.alert(
      'Sign in as Different User',
      'This will clear your stored credentials and require password login. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);

              // Clear all AsyncStorage caches
              const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
              const allKeys = await AsyncStorage.getAllKeys();
              await AsyncStorage.multiRemove(allKeys).catch(() => {});

              // Clear all SecureStore credentials
              await SecureStore.deleteItemAsync('user_email').catch(() => {});
              await SecureStore.deleteItemAsync('user_password').catch(() => {});
              await SecureStore.deleteItemAsync('user_pin_hash').catch(() => {});
              await SecureStore.deleteItemAsync('biometric_enabled').catch(() => {});
              await SecureStore.deleteItemAsync('pin_attempts').catch(() => {});
              await SecureStore.deleteItemAsync('pin_blocked_until').catch(() => {});

              // Reset form state
              setEmail('');
              setPin('');
              setPassword('');
              setShowPasswordLogin(true); // Force password login
              setRequirePassword(true); // Require password
              setIsSwitchingAccounts(true);
              setHasStoredPassword(false);
              setStoredBiometricEnabled(false);

              // Reset loading state BEFORE showing alert
              setIsLoading(false);

              // Use setTimeout to ensure state updates complete before Alert
              setTimeout(() => {
                Alert.alert('Success', 'Please sign in with your password');
              }, 100);
            } catch (error) {
              console.error('Error switching accounts:', error);
              setIsLoading(false);
              Alert.alert('Error', 'Failed to clear credentials');
            }
          }
        }
      ]
    );
  };

  const handleProceed = async () => {
    // Prevent double-clicks - only check our local state, not authLoading from context
    if (loginInProgressRef.current || isLoading) {
      console.log('Login already in progress, ignoring');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Missing Information', 'Please enter your email or phone number');
      return;
    }

    if (requirePassword || showPasswordLogin) {
      if (!password.trim()) {
        Alert.alert('Missing Information', 'Please enter your password');
        return;
      }
      handlePasswordLogin();
    } else {
      if (pin.length !== 4) {
        Alert.alert('Invalid PIN', 'Please enter your 4-digit PIN');
        return;
      }
      handlePinLogin();
    }
  };

  const handlePinLogin = async () => {
    if (loginInProgressRef.current) return;
    loginInProgressRef.current = true;
    setIsLoading(true);
    console.log('handlePinLogin: Starting PIN verification for email:', email);

    try {
      // First check if user exists and get PIN hash
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('pin_hash, id')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (userError || !userData) {
        console.error('User lookup error:', userError);
        Alert.alert('Error', 'User not found. Please check your email address.');
        setIsLoading(false);
        return;
      }

      if (!userData.pin_hash) {
        console.log('No PIN hash found for user');
        Alert.alert('Error', 'No PIN set for this account. Please use password to login.');
        setRequirePassword(true);
        setIsLoading(false);
        return;
      }

      // Try RPC function first (if available)
      let isValidPin = false;
      let useRpcFunction = true;

      try {
        const { data: rpcResult, error: rpcError } = await supabase
          .rpc('rpc_verify_pin', {
            p_user_email: email,
            p_pin_plain: pin
          });

        console.log('RPC verification attempt:', {
          email: email.toLowerCase().trim(),
          pinLength: pin.length,
          rpcResult,
          rpcError
        });

        if (rpcError) {
          console.log('RPC function not available, falling back to client-side verification');
          console.log('RPC error details:', rpcError);
          useRpcFunction = false;
        } else {
          isValidPin = rpcResult;
          console.log('RPC verification result:', isValidPin);
        }
      } catch (rpcErr) {
        console.log('RPC function error, using fallback method');
        console.log('RPC error:', rpcErr);
        useRpcFunction = false;
      }

      // Fallback to client-side verification if RPC not available
      if (!useRpcFunction) {
        try {
          console.log('Using client-side PIN verification');
          console.log('User ID:', userData.id);
          console.log('Email:', email.toLowerCase().trim());
          console.log('PIN length:', pin.length);
          console.log('Stored PIN hash:', userData.pin_hash);

          // Use the same hashing method as the auth context
          // First try with user ID as salt
          const inputHashWithId = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            pin + userData.id,
            { encoding: Crypto.CryptoEncoding.HEX }
          );

          console.log('Generated hash with ID:', inputHashWithId);

          // Then try with email as salt (fallback method)
          const inputHashWithEmail = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            pin + email.toLowerCase().trim(),
            { encoding: Crypto.CryptoEncoding.HEX }
          );

          console.log('Generated hash with email:', inputHashWithEmail);

          // Check both hash methods for compatibility
          isValidPin = (inputHashWithId === userData.pin_hash) || (inputHashWithEmail === userData.pin_hash);

          console.log('PIN verification result:', isValidPin);
          console.log('Hash matches with ID:', inputHashWithId === userData.pin_hash);
          console.log('Hash matches with email:', inputHashWithEmail === userData.pin_hash);

        } catch (hashError) {
          console.error('PIN hashing error:', hashError);
          Alert.alert('Error', 'Failed to verify PIN. Please try again.');
          setIsLoading(false);
          return;
        }
      }

      console.log('handlePinLogin: PIN verification result:', isValidPin);

      if (!isValidPin) {
        // PIN is incorrect - increment failed attempts in database
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        await updateFailedAttempts(newAttempts);

        if (newAttempts >= 3) {
          setRequirePassword(true);
          Alert.alert(
            'PIN Locked',
            'You have entered an incorrect PIN 3 times. Please use your password to login.'
          );
        } else {
          Alert.alert(
            'Invalid PIN',
            `The PIN you entered is incorrect. ${3 - newAttempts} attempts remaining.`
          );
        }

        setPin('');
        setIsLoading(false);
        return;
      }

      console.log('PIN verified successfully');

      // Reset failed attempts on successful PIN
      await resetFailedAttempts();

      // Store email for future use
      await SecureStore.setItemAsync('user_email', email);

      // Check if user is already authenticated
      if (user) {
        console.log('User already authenticated, PIN verification complete');
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' as never }],
        });
        return;
      }

      // If no user session, try to sign in with stored password
      try {
        const storedPassword = await SecureStore.getItemAsync('user_password');
        if (storedPassword) {
          console.log('Signing in with stored password after PIN verification');
          await signInWithEmail(email, storedPassword);
        } else {
          // No stored password - user needs to re-authenticate
          Alert.alert(
            'Authentication Required',
            'Please enter your password to complete the login.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Enter Password', onPress: () => setRequirePassword(true) }
            ]
          );
        }
      } catch (error: any) {
        console.error('Sign in error after PIN verification:', error);

        // Check if it's an authentication error
        if (error.message?.includes('Invalid login credentials')) {
          Alert.alert(
            'Invalid Credentials',
            'The stored password is incorrect. Please enter your current password.'
          );
          setRequirePassword(true);
        } else {
          Alert.alert(
            'Sign In Error',
            error.message || 'Failed to complete sign in. Please enter your password.'
          );
          setRequirePassword(true);
        }
      }

    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Error',
        error.message || 'Failed to sign in. Please try again.'
      );
    } finally {
      setIsLoading(false);
      loginInProgressRef.current = false;
    }
  };

  const handlePasswordLogin = async () => {
    if (loginInProgressRef.current) return;
    loginInProgressRef.current = true;
    setIsLoading(true);

    try {
      // Support both email and phone login
      const identifier = email.trim().toLowerCase();
      await signInWithEmail(identifier, password);
      await resetFailedAttempts();
      await SecureStore.setItemAsync('user_email', identifier);
      await SecureStore.setItemAsync('user_password', password);

      // Clear session timeout flag if set
      if (requiresReauth) {
        clearReauthRequired();
      }

      // Proactively fetch profile and navigate if needed for immediate feedback
      try {
        const profile = await apiGet('/api/users/profile');
        if (profile && profile.is_verified === false) {
          navigation.reset({ index: 0, routes: [{ name: 'VerifyAccount' as never }] });
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'MainTabs' as never }] });
        }
      } catch {
        // Fallback to App.tsx listener
      }
    } catch (error: any) {
      console.error('Password login error:', error);
      Alert.alert(
        'Login Error',
        error.message || 'Invalid email/phone or password. Please try again.'
      );
    } finally {
      setIsLoading(false);
      loginInProgressRef.current = false;
    }
  };

  const handleUseFaceID = async () => {
    // Check if biometric is enabled for this user's account
    const storedBiometricEnabled = await SecureStore.getItemAsync('biometric_enabled');
    const isBiometricEnabled = biometricEnabled || storedBiometricEnabled === 'true';

    if (!isBiometricEnabled) {
      Alert.alert(
        'Biometric Not Enabled',
        'Biometric authentication is not enabled for your account. Please enable it in Settings > Security to use this feature.'
      );
      return;
    }

    if (!localBiometricType && !biometricType) {
      Alert.alert(
        'Biometric Not Available',
        'Biometric authentication is not available on this device.'
      );
      return;
    }

    if (loginInProgressRef.current) return;
    loginInProgressRef.current = true;
    setIsLoading(true);

    try {
      // First authenticate with biometric
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login to Ajo Pay',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: false,
      });

      if (result.success) {
        console.log('Biometric authentication successful');

        // Get stored email from secure storage
        const storedEmail = await SecureStore.getItemAsync('user_email');

        if (!storedEmail) {
          Alert.alert(
            'Email Required',
            'Please enter your email address to sign in with biometrics.'
          );
          setIsLoading(false);
          loginInProgressRef.current = false;
          return;
        }

        // Set the email field for UI consistency
        setEmail(storedEmail);

        // Reset failed attempts on successful biometric
        await resetFailedAttempts();

        // Try to sign in with stored credentials
        const storedPassword = await SecureStore.getItemAsync('user_password');
        if (storedPassword) {
          try {
            await signInWithEmail(storedEmail, storedPassword);
            console.log('Biometric login successful');

            // Clear session timeout flag if set
            if (requiresReauth) {
              clearReauthRequired();
            }

            navigation.reset({ index: 0, routes: [{ name: 'MainTabs' as never }] });
            return;
          } catch (err: any) {
            console.log('Password-based biometric login failed:', err.message);
            // Password might be incorrect, ask user to re-enter
            Alert.alert(
              'Session Expired',
              'Please enter your password to continue.',
              [
                { text: 'OK', onPress: () => setShowPasswordLogin(true) }
              ]
            );
            return;
          }
        }

        // Check if there's an existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('Biometric login successful with existing session');

          // Clear session timeout flag if set
          if (requiresReauth) {
            clearReauthRequired();
          }

          navigation.reset({ index: 0, routes: [{ name: 'MainTabs' as never }] });
          return;
        }

        // No stored password and no session - need password
        Alert.alert(
          'Password Required',
          'Please enter your password to complete login. Your password will be stored securely for future biometric logins.',
          [
            { text: 'OK', onPress: () => setShowPasswordLogin(true) }
          ]
        );

      } else {
        console.log('Biometric authentication cancelled or failed:', result.error);
        // Ignore non-critical errors (user_cancel, system_cancel, app_cancel)
        if (result.error === 'user_cancel' || result.error === 'system_cancel' || result.error === 'app_cancel') {
          // User or system cancelled, do nothing
        } else if (result.error) {
          Alert.alert('Authentication Failed', `Biometric authentication failed: ${result.error}`);
        }
      }
    } catch (error: any) {
      console.error('Biometric login error:', error);
      Alert.alert(
        'Login Error',
        'Failed to sign in with biometric. Please try using your PIN or password.'
      );
    } finally {
      setIsLoading(false);
      loginInProgressRef.current = false;
    }
  };

  // Google Sign In - COMMENTED OUT
  // const handleGoogleSignIn = async () => {
  //   setIsGoogleLoading(true);
  //   try {
  //     await signInWithGoogle();
  //     // Navigation will be handled by auth state change
  //   } catch (error: any) {
  //     console.error('Google sign in error:', error);
  //     Alert.alert(
  //       'Google Sign In Error',
  //       error.message || 'Failed to sign in with Google. Please try again.'
  //     );
  //   } finally {
  //     setIsGoogleLoading(false);
  //   }
  // };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    try {
      await signInWithApple();
      // Navigation will be handled by auth state change
    } catch (error: any) {
      console.error('Apple sign in error:', error);
      // Don't show error for user cancellation
      if (error.code !== 'ERR_CANCELED' && error.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert(
          'Apple Sign In Error',
          error.message || 'Failed to sign in with Apple. Please try again.'
        );
      }
    } finally {
      setIsAppleLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header with back button or app name */}
        <View style={styles.header}>
          {canGoBack ? (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ) : (
            <View style={styles.appHeader}>
              <Text style={styles.appName}>AJO</Text>
            </View>
          )}
        </View>

        {/* Title and subtitle */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>"Welcome back. Let's get you where you left off."</Text>
        </View>

        {/* Email/Phone Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Email or Phone</Text>
          <View style={styles.emailInputContainer}>
            <TextInput
              style={styles.emailInput}
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter your email or phone"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {requirePassword || showPasswordLogin ? (
          /* Password Input Section */
          <View style={styles.pinSection}>
            <Text style={styles.pinLabel}>Password</Text>
            <View style={styles.emailInputContainer}>
              <TextInput
                ref={passwordInputRef}
                style={styles.passwordTextInput}
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleProceed}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButtonInline}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {showPassword ? (
                  <Eye size={20} color="#666" />
                ) : (
                  <EyeOff size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>
            {/* Option to switch back to PIN if not locked and not switching accounts */}
            {!requirePassword && showPasswordLogin && !isSwitchingAccounts && (
              <TouchableOpacity
                onPress={() => setShowPasswordLogin(false)}
                style={styles.switchLoginMethod}
              >
                <Text style={styles.switchLoginMethodText}>Use PIN instead</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          /* PIN Input Section */
          <View style={styles.pinSection}>
            <Text style={styles.pinLabel}>Input Pin</Text>
            {failedAttempts > 0 && failedAttempts < 3 && (
              <Text style={styles.attemptsText}>
                {3 - failedAttempts} attempts remaining
              </Text>
            )}
            <View style={styles.emailInputContainer}>
              <TextInput
                style={styles.emailInput}
                value={pin}
                onChangeText={(text) => handlePinChange(text)}
                secureTextEntry={true}
                placeholder="Enter 4-digit PIN"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                maxLength={4}
                returnKeyType="done"
                onSubmitEditing={handleProceed}
              />
            </View>
            {/* Option to use password instead (for cross-device login) - not shown when switching accounts */}
            {!isSwitchingAccounts && (
              <TouchableOpacity
                onPress={() => setShowPasswordLogin(true)}
                style={styles.switchLoginMethod}
              >
                <Text style={styles.switchLoginMethodText}>Use password instead</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Proceed Button */}
        <TouchableOpacity
          style={[styles.proceedButton,
            (
              isLoading ||
              !email.trim() ||
              ((requirePassword || showPasswordLogin) && !password.trim()) ||
              (!(requirePassword || showPasswordLogin) && pin.length !== 4)
            ) && styles.proceedButtonDisabled
          ]}
          onPress={handleProceed}
          disabled={
            isLoading ||
            !email.trim() ||
            ((requirePassword || showPasswordLogin) && !password.trim()) ||
            (!(requirePassword || showPasswordLogin) && pin.length !== 4)
          }
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.proceedButtonText}>Proceed</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.orText}>Or sign in with</Text>

        {/* Google Sign In Button - COMMENTED OUT */}
        {/* <TouchableOpacity
          style={[styles.googleButton, isGoogleLoading && styles.googleButtonDisabled]}
          onPress={handleGoogleSignIn}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <ActivityIndicator size="small" color="#3B3B3B" style={{ marginRight: 12 }} />
          ) : (
            <Image
              source={require('../../assets/images/gmail.png')}
              style={styles.googleIcon}
            />
          )}
          <Text style={styles.googleButtonText}>
            {isGoogleLoading ? 'Signing in...' : 'Sign in with Gmail'}
          </Text>
        </TouchableOpacity> */}

        {/* Apple Sign In Button */}
        <TouchableOpacity
          style={[styles.appleButton, isAppleLoading && styles.appleButtonDisabled]}
          onPress={handleAppleSignIn}
          disabled={isAppleLoading}
        >
          {isAppleLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 12 }} />
          ) : (
            <Image
              source={require('../../assets/applesignin.png')}
              style={styles.appleIcon}
              resizeMode="contain"
            />
          )}
          <Text style={styles.appleButtonText}>
            {isAppleLoading ? 'Signing in...' : 'Sign in with Apple'}
          </Text>
        </TouchableOpacity>

        {/* Face ID Button - Only show if user has enabled biometrics in their account settings */}
        {(biometricEnabled || storedBiometricEnabled) && (biometricType || localBiometricType) && !requirePassword && !showPasswordLogin && !isSwitchingAccounts && (
          <View style={styles.faceIdSection}>
            <TouchableOpacity
              style={[styles.faceIdButton, (isLoading || authLoading) && styles.faceIdButtonDisabled]}
              onPress={handleUseFaceID}
              disabled={isLoading || authLoading}
            >
              <Text style={styles.faceIdText}>
                Use {(biometricType || localBiometricType) === 'face_id' ? 'Face ID' : (biometricType || localBiometricType) === 'fingerprint' ? 'Fingerprint' : 'Biometric'}
              </Text>
              <ScanFace size={20} color={(isLoading || authLoading) ? "#999" : "#000"} />
            </TouchableOpacity>
          </View>
        )}

        {/* Sign in as Different User - Only show if user has previously logged in */}
        {!isSwitchingAccounts && hasPreviouslyLoggedIn && (
          <TouchableOpacity
            style={styles.switchAccountButton}
            onPress={handleSwitchAccounts}
          >
            <Text style={styles.switchAccountText}>Sign in as different user?</Text>
          </TouchableOpacity>
        )}

        {/* Create Account Link */}
        <View style={styles.createAccountSection}>
          <Text style={styles.createAccountText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
            <Text style={styles.createAccountLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  appHeader: {
    height: 40,
    justifyContent: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  titleSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'medium',
    color: '#1C1C1C',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#303030',
    lineHeight: 24,
  },
  toggleSection: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#000',
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#fff',
  },
  inputSection: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 12,
    color: '#929292',
    marginBottom: 12,
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  emailInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    paddingVertical: 16,
  },
  passwordTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    paddingVertical: 16,
  },
  eyeButtonInline: {
    padding: 8,
    marginLeft: 8,
  },
  pinSection: {
    marginBottom: 40,
  },
  pinLabel: {
    fontSize: 12,
    color: '#929292',
    marginBottom: 12,
  },
  warningText: {
    fontSize: 12,
    color: '#D73527',
    marginBottom: 8,
    fontWeight: '500',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  attemptsText: {
    fontSize: 12,
    color: '#FF8C00',
    marginBottom: 8,
    fontWeight: '500',
  },
  switchLoginMethod: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  switchLoginMethodText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  proceedButton: {
    backgroundColor: '#0D0D0D',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },
  proceedButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'regular',
    textAlign: 'center',
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400',
    color: '#212121',
    marginBottom: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginBottom: 12,
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleIcon: {
    width: 20,
    height: 14,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#3B3B3B',
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    backgroundColor: '#000000',
    marginBottom: 20,
  },
  appleButtonDisabled: {
    opacity: 0.6,
  },
  appleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  faceIdSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 50,
  },
  faceIdButton: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  faceIdButtonDisabled: {
    opacity: 0.6,
  },
  faceIdText: {
    fontSize: 14,
    color: '#1E1E1E',
    textAlign: 'center',
    fontWeight: "regular"
  },
  noticeBox: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  noticeText: {
    fontSize: 14,
    color: '#4169E1',
    textAlign: 'center',
    lineHeight: 20,
  },
  createAccountSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  createAccountText: {
    fontSize: 14,
    color: '#666',
  },
  createAccountLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#999',
  },
  textDisabled: {
    color: '#999',
    opacity: 0.5,
  },
  switchAccountButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 8,
    // borderWidth: 1,
    // borderColor: '#E5E5E5',
    // backgroundColor: '#F9F9F9',
    alignItems: 'center',
    position: 'absolute',
    bottom: 35,
    left: 0,
    right: 0,
  },
  switchAccountText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

});
