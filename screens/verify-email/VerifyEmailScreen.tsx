import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { Button } from '../../components/ui/button';

type VerifyEmailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VerifyEmail'>;

export default function VerifyEmailScreen() {
  const navigation = useNavigation<VerifyEmailScreenNavigationProp>();
  
  // State management
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showError, setShowError] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  
  // References to input fields
  const inputRefs = useRef<(TextInput | null)[]>([]);
  
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
  
  // Verify code
  const handleVerify = async (verificationCode: string) => {
    setIsVerifying(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsVerifying(false);
    
    // For demo purposes: 172369 is correct code
    if (verificationCode === '172369') {
      setVerificationSuccess(true);
    } else {
      setShowError(true);
      // Clear code after error
      setCode(['', '', '', '', '', '']);
      // Refocus first input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  };
  
  // Resend code
  const handleResendCode = async () => {
    setIsResending(true);
    setResendTimer(50); // 50-second cooldown
    setShowError(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsResending(false);
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };
  
  // Handle main button press
  const handleProceed = () => {
    navigation.navigate('MainTabs');
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
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Enter the 6 digit code we emailed you.</Text>
            <Text style={styles.description}>
              A code has been sent to your <Text style={styles.email}>johndoe@gmail.com</Text>. 
              Please remember to check your inbox as well as your spam folder.
            </Text>
          </View>
          
          {/* Success state */}
          {verificationSuccess ? (
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Your verification was successful.</Text>
              <Text style={styles.successMessage}>
                You're all set to start your AJO journey. Let's proceed to get your info.
              </Text>
              <Button 
                title="Proceed" 
                onPress={handleProceed}
                style={styles.proceedButton}
              />
            </View>
          ) : (
            <>
              {/* Code input */}
              <View style={styles.codeContainer}>
                <View style={styles.codeInputs}>
                  {code.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={el => inputRefs.current[index] = el}
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
                    <Text style={styles.errorText}>Incorrect code inputed.</Text>
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
                  If you are having any issues, remember to check verify that the email address you
                  sent across is correct.
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
  },
});
