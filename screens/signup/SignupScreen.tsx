import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { useLoading } from '../../contexts/LoadingContext';
import { ArrowLeft, Eye, EyeOff, Phone, Mail } from 'lucide-react-native';

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;
type SignupMethod = 'email' | 'phone';

export default function SignupScreen() {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { signUpWithEmail, /* signInWithGoogle, */ signInWithApple, signInWithPhone } = useAuth(); // Google auth disabled
  const { showLoading, hideLoading } = useLoading();

  const [signupMethod, setSignupMethod] = useState<SignupMethod>('email');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Google auth disabled
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  // Format phone number as user types (US format)
  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');

    // Limit to 10 digits (US phone without country code)
    const limited = cleaned.slice(0, 10);

    // Format as (XXX) XXX-XXXX
    if (limited.length >= 6) {
      return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
    } else if (limited.length >= 3) {
      return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
    } else if (limited.length > 0) {
      return `(${limited}`;
    }
    return '';
  };

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(formatPhoneNumber(text));
  };

  // Get clean phone number with country code
  const getCleanPhoneNumber = () => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return `+1${cleaned}`;
  };

  // Validate phone number (must be 10 digits for US)
  const isValidPhoneNumber = () => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length === 10;
  };

  const handleSignup = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    if (signupMethod === 'email') {
      if (!email.trim()) {
        Alert.alert('Error', 'Please enter your email address');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        Alert.alert('Invalid Email', 'Please enter a valid email address');
        return;
      }

      if (!password.trim() || password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters long');
        return;
      }

      // Save form values
      const savedEmail = email.trim();
      const savedFullName = fullName.trim();
      const savedPassword = password;

      // NAVIGATE FIRST - This happens immediately
      console.log('SignupScreen: Navigating to VerifyEmail FIRST');

      // Use replace to ensure we can't go back and it replaces the current screen
      navigation.replace('VerifyEmail', {
        contactInfo: savedEmail,
        verificationType: 'email' as const,
        fullName: savedFullName,
        password: savedPassword,
        isSignupFlow: true
      });

      // THEN process signup in the background
      try {
        console.log('SignupScreen: Processing email signup in background');
        await signUpWithEmail(
          savedEmail,
          savedPassword,
          {
            full_name: savedFullName
          }
        );
        console.log('SignupScreen: Email signup completed successfully in background');
      } catch (err: any) {
        console.error('Email signup error:', err);
        Alert.alert(
          'Signup Error',
          err.message || 'Failed to create account. Please go back and try again.'
        );
      }
    } else {
      // Phone signup
      if (!isValidPhoneNumber()) {
        Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit US phone number');
        return;
      }

      const cleanPhone = getCleanPhoneNumber();
      const savedFullName = fullName.trim();

      // NAVIGATE FIRST
      console.log('SignupScreen: Navigating to VerifyEmail for phone verification');

      navigation.replace('VerifyEmail', {
        contactInfo: cleanPhone,
        verificationType: 'phone' as const,
        fullName: savedFullName,
        isSignupFlow: true
      });

      // THEN send OTP in background
      try {
        console.log('SignupScreen: Sending phone OTP');
        await signInWithPhone(cleanPhone);
        console.log('SignupScreen: Phone OTP sent successfully');
      } catch (err: any) {
        console.error('Phone signup error:', err);
        Alert.alert(
          'Signup Error',
          err.message || 'Failed to send verification code. Please go back and try again.'
        );
      }
    }
  };

  // Google Sign Up - COMMENTED OUT
  // const handleGoogleSignup = async () => {
  //   setIsGoogleLoading(true);
  //
  //   try {
  //     await signInWithGoogle();
  //     // Navigation will be handled by auth state change
  //   } catch (err: any) {
  //     console.error('Google signup error:', err);
  //     Alert.alert(
  //       'Google Sign Up Error',
  //       err.message || 'Failed to sign up with Google. Please try again.'
  //     );
  //   } finally {
  //     setIsGoogleLoading(false);
  //   }
  // };

  const handleAppleSignup = async () => {
    setIsAppleLoading(true);

    try {
      await signInWithApple();
      // Navigation will be handled by auth state change
    } catch (err: any) {
      console.error('Apple signup error:', err);
      // Don't show error for user cancellation
      if (err.code !== 'ERR_CANCELED' && err.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert(
          'Apple Sign Up Error',
          err.message || 'Failed to sign up with Apple. Please try again.'
        );
      }
    } finally {
      setIsAppleLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.title}>Create your account.</Text>
          <Text style={styles.subtitle}>Set up your account to join a group and grow your savings.</Text>

          {/* Signup Method Toggle */}
          <View style={styles.methodToggle}>
            <TouchableOpacity
              style={[styles.methodButton, signupMethod === 'email' && styles.methodButtonActive]}
              onPress={() => setSignupMethod('email')}
            >
              <Mail size={18} color={signupMethod === 'email' ? '#FFFFFF' : '#666'} />
              <Text style={[styles.methodButtonText, signupMethod === 'email' && styles.methodButtonTextActive]}>
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.methodButton, signupMethod === 'phone' && styles.methodButtonActive]}
              onPress={() => setSignupMethod('phone')}
            >
              <Phone size={18} color={signupMethod === 'phone' ? '#FFFFFF' : '#666'} />
              <Text style={[styles.methodButtonText, signupMethod === 'phone' && styles.methodButtonTextActive]}>
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <Input
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              keyboardType="default"
              autoCapitalize="words"
              style={styles.input}
              editable={!isLoading}
            />

            {signupMethod === 'email' ? (
              <>
                <Text style={styles.inputLabel}>Email address</Text>
                <Input
                  placeholder="Enter your email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  editable={!isLoading}
                />

                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    placeholder="Enter your password (min 6 characters)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    style={styles.passwordInput}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Eye size={20} color="#6b7280" />
                    ) : (
                      <EyeOff size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.inputLabel}>Phone Number (US Only)</Text>
                <View style={styles.phoneInputContainer}>
                  <View style={styles.countryCode}>
                    <Text style={styles.countryCodeText}>🇺🇸 +1</Text>
                  </View>
                  <TextInput
                    placeholder="(555) 555-5555"
                    value={phoneNumber}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    style={styles.phoneInput}
                    editable={!isLoading}
                    maxLength={14}
                  />
                </View>
                <Text style={styles.phoneHint}>
                  We'll send you a verification code via SMS
                </Text>
              </>
            )}

            <TouchableOpacity
              onPress={handleSignup}
              style={[
                styles.proceedButton,
                (isLoading ||
                  !fullName.trim() ||
                  (signupMethod === 'email' && (!email.trim() || !password.trim())) ||
                  (signupMethod === 'phone' && !isValidPhoneNumber())
                ) && styles.proceedButtonDisabled
              ]}
              disabled={isLoading ||
                !fullName.trim() ||
                (signupMethod === 'email' && (!email.trim() || !password.trim())) ||
                (signupMethod === 'phone' && !isValidPhoneNumber())}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.proceedButtonText}>Proceed</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.orText}>Or get started with</Text>

            {/* Google Sign Up Button - COMMENTED OUT */}
            {/* <TouchableOpacity
              style={[styles.gmailButton, isGoogleLoading && styles.gmailButtonDisabled]}
              onPress={handleGoogleSignup}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <ActivityIndicator size="small" color="#3B3B3B" style={{ marginRight: 12 }} />
              ) : (
                <Image
                  source={require('../../assets/images/gmail.png')}
                  style={styles.gmailIcon}
                />
              )}
              <Text style={styles.gmailButtonText}>
                {isGoogleLoading ? 'Signing up...' : 'Create account with Gmail'}
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={[styles.appleButton, isAppleLoading && styles.appleButtonDisabled]}
              onPress={handleAppleSignup}
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
                {isAppleLoading ? 'Signing up...' : 'Create account with Apple'}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Login here</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.agreementText}>
              By clicking on proceed, you agree to our{' '}
              <Text style={styles.linkText}>Privacy Policy</Text> and{' '}
              <Text style={styles.linkText}>Terms & Conditions.</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  backButton: {
    paddingVertical: 12,
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 24,
    color: '#111827',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#1C1C1C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#303030',
    marginBottom: 16,
  },
  methodToggle: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  methodButtonActive: {
    backgroundColor: '#000000',
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  methodButtonTextActive: {
    color: '#FFFFFF',
  },
  form: {
    gap: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#303030',
    marginBottom: 3,
  },
  input: {
    marginBottom: 16,
    height: 60,
    borderRadius: 12,
    fontSize: 14,
    backgroundColor: '#F2F2F2',
  },
  phoneInputContainer: {
    height: 60,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 12,
    backgroundColor: '#F2F2F2',
    marginBottom: 24,
    justifyContent: 'center',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 8,
  },
  chevron: {
    fontSize: 14,
    color: '#6b7280',
  },
  proceedButton: {
    height: 60,
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButtonDisabled: {
    opacity: 0.6,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400',
    color: '#212121',
    marginVertical: 10,
  },
  gmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginBottom: 12,
  },
  gmailIcon: {
    width: 20,
    height: 14,
    marginRight: 12,
  },
  gmailButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#3B3B3B',
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderRadius: 12,
    backgroundColor: '#000000',
    marginBottom: 24,
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
  gmailButtonDisabled: {
    opacity: 0.6,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#212121',
  },
  loginLink: {
    fontSize: 14,
    color: '#3358FF',
    fontWeight: '500',
  },
  agreementText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#212121',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  linkText: {
    color: '#3358FF',
    fontWeight: '500',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F2F2F2',
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#111827',
  },
  eyeButton: {
    paddingHorizontal: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F2F2F2',
    marginBottom: 8,
  },
  countryCode: {
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: '#DCDCDC',
    height: '100%',
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#111827',
  },
  phoneHint: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 16,
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 10,
  },
  loadingSubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6b7280',
    marginTop: 5,
  },
});
