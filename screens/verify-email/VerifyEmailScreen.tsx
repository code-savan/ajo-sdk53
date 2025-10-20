import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { useLoading } from '../../contexts/LoadingContext';
import { ArrowLeft } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';

type VerifyEmailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VerifyEmail'>;

type RouteParams = {
  contactInfo: string;
  verificationType: 'email' | 'phone';
  fullName?: string;
  password?: string;
  isSignupFlow?: boolean; // Flag to ensure this is only used during signup
};

export default function VerifyEmailScreen() {
  const navigation = useNavigation<VerifyEmailScreenNavigationProp>();
  const route = useRoute();
  const { verifyOTP } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  // Get route parameters
  const params = route.params as RouteParams || {};
  const { contactInfo, verificationType = 'email', fullName, password, isSignupFlow = true } = params; // Default to true

  // Log parameters for debugging
  useEffect(() => {
    console.log('VerifyEmailScreen loaded with params:', {
      contactInfo,
      isSignupFlow,
      fullName: !!fullName,
      password: !!password,
      verificationType,
      rawParams: params
    });
  }, [contactInfo, isSignupFlow, fullName, password, verificationType, params]);

  // State management
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60); // Start with 60 seconds since OTP was just sent
  const [isVerifying, setIsVerifying] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [waitingForOtp, setWaitingForOtp] = useState(true);

  // References to input fields
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Wait a moment for OTP to be sent
  useEffect(() => {
    const timer = setTimeout(() => {
      setWaitingForOtp(false);
    }, 2000); // 2 seconds should be enough for the OTP to be sent
    return () => clearTimeout(timer);
  }, []);

  // Debug function to test Supabase configuration
  const debugSupabaseConfig = async () => {
    try {
      console.log('=== SUPABASE DEBUG INFO ===');
      console.log('Contact Info:', contactInfo);
      console.log('Verification Type:', verificationType);

      // Test if we can get session info
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Current Session:', session ? 'Exists' : 'None');
      if (sessionError) console.log('Session Error:', sessionError);

      // Test if we can get user info
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('Current User:', user ? user.email : 'None');
      if (userError) console.log('User Error:', userError);

      console.log('=== SUPABASE CONFIGURATION GUIDE ===');
      console.log('To receive OTP CODES instead of MAGIC LINKS:');
      console.log('1. Go to Supabase Dashboard > Authentication > Email Templates');
      console.log('2. Edit the "Magic Link" template');
      console.log('3. Replace {{ .ConfirmationURL }} with {{ .Token }}');
      console.log('4. This will send a 6-digit code instead of a clickable link');
      console.log('=== END DEBUG INFO ===');

      Alert.alert(
        'Debug Info',
        'Check console for detailed Supabase configuration information.\n\nTo get OTP codes instead of magic links, you need to modify your email template in the Supabase dashboard.',
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Debug function error:', error);
    }
  };

  // Focus first input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  // Timer for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Handle input changes for code digits
  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    // Reset error state if user types
    if (showError) {
      setShowError(false);
      setErrorMessage('');
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all fields are filled
    if (newCode.every(digit => digit !== '') && value) {
      handleVerify(newCode.join(''));
    }
  };

  // Handle backspace key press
  const handleKeyPress = (index: number, e: any) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify code with Supabase
  const handleVerify = async (verificationCode: string) => {
    console.log('Starting verification for:', verificationType, 'with code:', verificationCode);

    setIsVerifying(true);
    showLoading('Verifying your code...');
    setShowError(false);
    setErrorMessage('');

    try {
      // Use Supabase OTP verification
      await verifyOTP(contactInfo, verificationCode, 'signup');

      console.log('OTP verification successful');
      setVerificationSuccess(true);
      hideLoading();

    } catch (err: any) {
      console.error('Verification error:', err);
      hideLoading();

      const errorMsg = err.message || 'Invalid verification code';
      setShowError(true);
      setErrorMessage(errorMsg);
      clearCodeInputs();
    } finally {
      setIsVerifying(false);
    }
  };

  // Helper function to clear code inputs
  const clearCodeInputs = () => {
    setCode(['', '', '', '', '', '']);
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  // Resend code with Supabase
  const handleResendCode = async () => {
    setIsResending(true);
    setResendTimer(60); // 60-second cooldown
    setShowError(false);
    setErrorMessage('');

    try {
      // Resend OTP using Supabase (for signup, we use signInWithOtp)
      console.log('Resending OTP to:', contactInfo);

      const { error } = await supabase.auth.signInWithOtp({
        email: contactInfo.toLowerCase().trim(),
        options: {
          shouldCreateUser: false, // Don't create user yet
        }
      });

      if (error && !error.message?.includes('User not found')) {
        throw error;
      }

      Alert.alert(
        'Code Sent',
        `A new verification code has been sent to your ${verificationType === 'email' ? 'email' : 'phone number'}.`
      );

    } catch (err: any) {
      console.error('Resend error:', err);

      // Show more specific error messages
      let errorMsg = 'Failed to resend verification code. ';
      if (err.message?.includes('Email not confirmed')) {
        errorMsg += 'Please check if your email address is valid.';
      } else if (err.message?.includes('rate limit')) {
        errorMsg += 'Too many requests. Please wait a moment before trying again.';
      } else if (err.message?.includes('Invalid email')) {
        errorMsg += 'The email address appears to be invalid.';
      } else {
        errorMsg += err.message || 'Please check your internet connection and try again.';
      }

      Alert.alert('Error', errorMsg);

      // Reset timer on error so user can try again sooner
      setResendTimer(0);
    } finally {
      setIsResending(false);
      clearCodeInputs();
    }
  };

  // Handle main button press
  const handleProceed = async () => {
    console.log('handleProceed: Navigating to SetPin');

    showLoading('Setting up your account...');

    // Use reset navigation to prevent going back
    navigation.reset({
      index: 0,
      routes: [{
        name: 'SetPin',
        params: {
          fullName,
          password
        }
      }],
    });

    // Hide loading after navigation
    setTimeout(() => {
      hideLoading();
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#000000" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Enter the 6 digit code we {verificationType === 'email' ? 'emailed' : 'sent to'} you.
            </Text>
            <Text style={styles.description}>
              {waitingForOtp ? 'Sending verification code to' : 'A code has been sent to your'} <Text style={styles.email}>{contactInfo}</Text>.
              {verificationType === 'email' && !waitingForOtp &&
                ' Please remember to check your inbox as well as your spam folder.'
              }
            </Text>
          </View>

          {/* Success state */}
          {verificationSuccess ? (
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Your verification was successful.</Text>
              <Text style={styles.successMessage}>
                You're all set to start your AJO journey. Let's set up your secure 4-digit PIN.
              </Text>
              <TouchableOpacity
                onPress={handleProceed}
                style={styles.proceedButton}
              >
                <Text style={styles.proceedButtonText}>Continue to PIN Setup</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Code input */}
              <View style={styles.codeContainer}>
                <View style={styles.codeInputs}>
                  {code.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      style={[
                        styles.codeInput,
                        digit && styles.codeInputFilled,
                        showError && styles.codeInputError
                      ]}
                      keyboardType="numeric"
                      maxLength={1}
                      value={digit}
                      onChangeText={(value) => handleInputChange(index, value)}
                      onKeyPress={(e) => handleKeyPress(index, e)}
                      editable={!isVerifying}
                    />
                  ))}
                </View>

                {/* Error message */}
                {showError && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                      {errorMessage || 'Incorrect code entered.'}
                    </Text>
                  </View>
                )}
              </View>

              {/* Resend code */}
              <View style={styles.resendContainer}>
                <Text style={styles.resendLabel}>Didn't get a code? </Text>
                {resendTimer > 0 ? (
                  <Text style={styles.timerText}>{`${resendTimer < 10 ? '0' : ''}${Math.floor(resendTimer / 60)}:${resendTimer % 60 < 10 ? '0' : ''}${resendTimer % 60}`}</Text>
                ) : (
                  <TouchableOpacity
                    onPress={handleResendCode}
                    disabled={isResending || resendTimer > 0}
                  >
                    <Text style={styles.resendButton}>Resend code.</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Debug button - only show in development */}
              {/* {__DEV__ && (
                <View style={styles.debugContainer}>
                  <TouchableOpacity onPress={debugSupabaseConfig} style={styles.debugButton}>
                    <Text style={styles.debugButtonText}>Debug Supabase Config</Text>
                  </TouchableOpacity>
                </View>
              )} */}
            </>
          )}

          {/* Bottom notice */}
          {!verificationSuccess && (
            <View style={styles.noticeContainer}>
              <View style={styles.noticeBox}>
                <View style={styles.noticeIcon}>
                  <Text style={styles.noticeIconText}>✉</Text>
                </View>
                <Text style={styles.noticeText}>
                  If you are having any issues, remember to verify that the {verificationType === 'email' ? 'email address' : 'phone number'} you
                  provided is correct.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
  },
  backButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000000',
  },
  header: {
    marginBottom: 80,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#000000',
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  email: {
    fontWeight: '500',
    color: '#4b5563',
  },
  codeContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  codeInputs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  codeInput: {
    width: 48,
    height: 48,
    borderBottomWidth: 2,
    borderBottomColor: '#d1d5db',
    fontSize: 32,
    textAlign: 'center',
  },
  codeInputFilled: {
    borderBottomColor: '#000000',
  },
  codeInputError: {
    borderBottomColor: '#ef4444',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
  },
  resendLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  resendButton: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '500',
  },
  timerText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '500',
  },
  noticeContainer: {
    marginTop: 'auto',
    marginBottom: 24,
  },
  noticeBox: {
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  noticeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  noticeIconText: {
    color: '#ffffff',
    fontSize: 16,
  },
  noticeText: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 120,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  proceedButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  debugContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  debugButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  debugButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 10,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 5,
  },
});
