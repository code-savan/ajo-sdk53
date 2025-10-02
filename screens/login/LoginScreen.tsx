import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ArrowLeft, Eye, EyeOff, ScanFace } from 'lucide-react-native';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { supabase } from '../../lib/supabase';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
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
    signInWithGoogle
  } = useAuth();

  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attemptedBiometric, setAttemptedBiometric] = useState(false);
  const [canGoBack] = useState(navigation.canGoBack());
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [requirePassword, setRequirePassword] = useState(false);
  const passwordInputRef = useRef<TextInput>(null);

  // Remove eager navigation; let App.tsx handle gating
  useEffect(() => {
    // Intentionally do not navigate here; App.tsx will reset to VerifyAccount or MainTabs
  }, [user, hasPin, navigation]);

  // Check failed attempts on mount
  useEffect(() => {
    checkFailedAttempts();
  }, []);

  // Auto-attempt biometric authentication if enabled (only once)
  useEffect(() => {
    if (biometricEnabled && biometricType && !attemptedBiometric && !user && !requirePassword) {
      setAttemptedBiometric(true);
      handleUseFaceID();
    }
  }, [biometricEnabled, biometricType, attemptedBiometric, user, requirePassword]);

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

        // Check failed attempts from database
        const { data, error } = await supabase
          .from('users')
          .select('failed_pin_attempts')
          .eq('email', storedEmail)
          .single();

        console.log('checkFailedAttempts: database result =', { data, error });

        if (data && data.failed_pin_attempts >= 3) {
          console.log('checkFailedAttempts: Setting requirePassword to true, failed attempts =', data.failed_pin_attempts);
          setFailedAttempts(data.failed_pin_attempts);
          setRequirePassword(true);
        } else {
          console.log('checkFailedAttempts: Failed attempts below threshold or no data, failed attempts =', data?.failed_pin_attempts || 0);
          setFailedAttempts(data?.failed_pin_attempts || 0);
          setRequirePassword(false);
        }
      }
    } catch (error) {
      console.error('Error checking failed attempts:', error);
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

  const handlePasswordChange = (value: string) => {
    console.log('Password input changed:', value.length, 'chars');
    setPassword(value);
  };

  const handleProceed = async () => {
    if (!email.trim()) {
      Alert.alert('Missing Information', 'Please enter your email address');
      return;
    }

    if (requirePassword) {
      if (!password.trim()) {
        Alert.alert('Missing Information', 'Please enter your password');
        return;
      }
      await handlePasswordLogin();
    } else {
      if (pin.length !== 4) {
        Alert.alert('Invalid PIN', 'Please enter your 4-digit PIN');
        return;
      }
      await handlePinLogin();
    }
  };

  const handlePinLogin = async () => {
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
    }
  };

  const handlePasswordLogin = async () => {
    setIsLoading(true);

    try {
      await signInWithEmail(email, password);
      await resetFailedAttempts();
      await SecureStore.setItemAsync('user_email', email);
      await SecureStore.setItemAsync('user_password', password);
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
        error.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseFaceID = async () => {
    if (!biometricEnabled) {
      Alert.alert(
        'Biometric Login Disabled',
        'Biometric authentication is not enabled for your account. Please use your PIN to login.'
      );
      return;
    }

    setIsLoading(true);

    try {
      // First authenticate with biometric
      const success = await authenticateWithBiometric();

      if (success) {
        console.log('Biometric authentication successful');

        // Get stored email from secure storage
        const storedEmail = await SecureStore.getItemAsync('user_email');

        if (!storedEmail) {
          Alert.alert(
            'Email Required',
            'Please enter your email address to sign in.'
          );
          setIsLoading(false);
          return;
        }

        // Set the email field for UI consistency
        setEmail(storedEmail);

        // Reset failed attempts on successful biometric
        await resetFailedAttempts();

        // Try to sign in with stored credentials
        try {
          const storedPassword = await SecureStore.getItemAsync('user_password');
          if (storedPassword) {
            await signInWithEmail(storedEmail, storedPassword);
            console.log('Biometric login successful');
            return;
          }
        } catch (err) {
          console.log('Password-based biometric login failed, checking session');
        }

        // Check if there's an existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('Biometric login successful with existing session');
          return;
        }

        // Fallback to OTP
        navigation.navigate('VerifyEmail', {
          contactInfo: storedEmail,
          verificationType: 'email'
        });

      } else {
        console.log('Biometric authentication cancelled or failed');
      }
    } catch (error: any) {
      console.error('Biometric login error:', error);
      Alert.alert(
        'Login Error',
        'Failed to sign in with biometric. Please try using your PIN or password.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // Navigation will be handled by auth state change
    } catch (error: any) {
      console.error('Google sign in error:', error);
      Alert.alert(
        'Google Sign In Error',
        error.message || 'Failed to sign in with Google. Please try again.'
      );
    } finally {
      setIsLoading(false);
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

        {/* Email Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.emailInputContainer}>
            <TextInput
              style={styles.emailInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>
        </View>

        {requirePassword ? (
          /* Password Input Section */
          <View style={styles.pinSection}>
            <Text style={styles.pinLabel}>Password</Text>
            <Text style={styles.warningText}>
              PIN locked due to multiple failed attempts. Please use your password.
            </Text>
            <View style={styles.pinInputContainer}>
              <TextInput
                ref={passwordInputRef}
                style={styles.pinInput}
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                editable={!isLoading && !authLoading}
                returnKeyType="done"
                onSubmitEditing={handleProceed}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                keyboardType="default"
                selectTextOnFocus={true}
                onFocus={() => console.log('Password input focused')}
                onBlur={() => console.log('Password input blurred')}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <Eye size={20} color="#999" />
                ) : (
                  <EyeOff size={20} color="#999" />
                )}
              </TouchableOpacity>
            </View>
            {__DEV__ && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 12, color: '#666' }}>
                  Debug: Password length: {password.length} | Loading: {isLoading} | AuthLoading: {authLoading}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setPassword('test123');
                    console.log('Test password set');
                  }}
                  style={{ backgroundColor: '#f0f0f0', padding: 8, marginTop: 4, borderRadius: 4 }}
                >
                  <Text style={{ fontSize: 12 }}>Set Test Password</Text>
                </TouchableOpacity>
              </View>
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
            <View style={styles.pinInputContainer}>
              <TextInput
                style={styles.pinInput}
                value={pin}
                onChangeText={handlePinChange}
                secureTextEntry={true}
                placeholder="Enter 4-digit PIN"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                maxLength={4}
                editable={!isLoading}
                returnKeyType="done"
                onSubmitEditing={handleProceed}
                selectTextOnFocus={true}
              />
            </View>
          </View>
        )}

        {/* Proceed Button */}
        <TouchableOpacity
          style={[styles.proceedButton,
            (isLoading || authLoading || !email.trim() ||
             (requirePassword && !password.trim()) ||
             (!requirePassword && pin.length !== 4)
            ) && styles.proceedButtonDisabled
          ]}
          onPress={handleProceed}
          disabled={isLoading || authLoading || !email.trim() ||
                   (requirePassword && !password.trim()) ||
                   (!requirePassword && pin.length !== 4)}
        >
          <Text style={styles.proceedButtonText}>
            {isLoading || authLoading ? 'Signing in...' : 'Proceed'}
          </Text>
        </TouchableOpacity>

        {/* Google Sign In Button */}
        <TouchableOpacity
          style={[styles.googleButton, (isLoading || authLoading) && styles.googleButtonDisabled]}
          onPress={handleGoogleSignIn}
          disabled={isLoading || authLoading}
        >
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        {/* Face ID Button - Only show if biometric is available and PIN not locked */}
        {biometricType && !requirePassword && (
          <View style={styles.faceIdSection}>
            <TouchableOpacity
              style={[styles.faceIdButton, (isLoading || authLoading) && styles.faceIdButtonDisabled]}
              onPress={handleUseFaceID}
              disabled={isLoading || authLoading}
            >
              <Text style={styles.faceIdText}>
                Use {biometricType === 'face_id' ? 'Face ID' : biometricType === 'fingerprint' ? 'Fingerprint' : 'Biometric'}
              </Text>
              <ScanFace size={20} color={(isLoading || authLoading) ? "#999" : "#000"} />
            </TouchableOpacity>
          </View>
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
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 12,
    color: '#929292',
    marginBottom: 12,
  },
  emailInputContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  emailInput: {
    fontSize: 16,
    color: '#000000',
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
  attemptsText: {
    fontSize: 12,
    color: '#FF8C00',
    marginBottom: 8,
    fontWeight: '500',
  },
  pinInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  pinInput: {
    flex: 1,
    fontSize: 18,
    color: '#000000',
    fontWeight: '500',
  },
  eyeButton: {
    padding: 4,
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
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'regular',
    textAlign: 'center',
  },
  faceIdSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
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
    bottom: 40,
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

});
