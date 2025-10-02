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
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

export default function SignupScreen() {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Helper function to detect if input is email or phone
  const detectInputType = (input: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9]?\d{9,15}$/;

    if (emailRegex.test(input)) {
      return 'email';
    } else if (phoneRegex.test(input.replace(/[\s\-\(\)]/g, ''))) {
      return 'phone';
    }
    return 'unknown';
  };

  const handleSignup = async () => {
    if (!emailOrPhone.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    if (!password.trim() || password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    const inputType = detectInputType(emailOrPhone.trim());
    if (inputType !== 'email') {
      Alert.alert('Invalid Input', 'Please enter a valid email address');
      return;
    }

    // Save form values
    const savedEmail = emailOrPhone.trim();
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
      console.log('SignupScreen: Processing signup in background');
      await signUpWithEmail(
        savedEmail,
        savedPassword,
        {
          full_name: savedFullName
        }
      );
      console.log('SignupScreen: Signup completed successfully in background');
    } catch (err: any) {
      console.error('Signup error:', err);
      // The user is already on VerifyEmail screen, show error there
      Alert.alert(
        'Signup Error',
        err.message || 'Failed to create account. Please go back and try again.'
      );
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);

    try {
      await signInWithGoogle();
      // Navigation will be handled by auth state change
    } catch (err: any) {
      console.error('Google signup error:', err);
      Alert.alert(
        'Google Sign Up Error',
        err.message || 'Failed to sign up with Google. Please try again.'
      );
    } finally {
      setIsGoogleLoading(false);
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

            <Text style={styles.inputLabel}>Email address</Text>
            <Input
              placeholder="Enter your email address"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
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

            <TouchableOpacity
              onPress={handleSignup}
              style={[
                styles.proceedButton,
                (isLoading || !emailOrPhone.trim() || !fullName.trim() || !password.trim()) && styles.proceedButtonDisabled
              ]}
              disabled={isLoading || !emailOrPhone.trim() || !fullName.trim() || !password.trim()}
            >
              <Text style={styles.proceedButtonText}>
                {isLoading ? 'Creating Account...' : 'Proceed'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.orText}>Or get started with</Text>

            <TouchableOpacity
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
    marginBottom: 32,
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
    marginBottom: 24,
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
