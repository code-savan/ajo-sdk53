import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Animated,
  Dimensions,
  Pressable,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGet, apiPut } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { ChevronLeft, ChevronRight, Phone, Shield } from 'lucide-react-native';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { supabase } from '../../lib/supabase';

// Define navigation prop types
interface TwoFactorAuthScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'TwoFactorAuth'>;
}

// Sample security questions
const securityQuestions = [
  "What was the name of your first pet?",
  "In what city were you born?",
  "What is your mother's maiden name?",
  "What was the make of your first car?"
];

const TwoFactorAuthScreen: React.FC<TwoFactorAuthScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(securityQuestions[0]);
  const [questionDropdownOpen, setQuestionDropdownOpen] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [savedQuestion, setSavedQuestion] = useState('');
  const [savedAnswer, setSavedAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const [tfaPhone, setTfaPhone] = useState('');
  const [tfaPhoneVerified, setTfaPhoneVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const { showToast } = useToast();

  // Get screen dimensions for modal sizing
  const { height: screenHeight } = Dimensions.get('window');

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Format phone number as user types (US format)
  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 10);
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
    setTfaPhone(formatPhoneNumber(text));
  };

  const getCleanPhoneNumber = () => {
    const cleaned = tfaPhone.replace(/\D/g, '');
    return `+1${cleaned}`;
  };

  const isValidPhoneNumber = () => {
    const cleaned = tfaPhone.replace(/\D/g, '');
    return cleaned.length === 10;
  };

  useEffect(() => {
    const load = async () => {
      const cached = await AsyncStorage.getItem('profile_cache_v1');
      if (cached) {
        try {
          const p = JSON.parse(cached);
          if (typeof p.tfa_enabled === 'boolean') setTfaEnabled(p.tfa_enabled);
          if (p.security_question) setSavedQuestion(p.security_question);
          if (p.tfa_phone) {
            setTfaPhone(formatPhoneNumber(p.tfa_phone.replace('+1', '')));
            setTfaPhoneVerified(true);
          }
        } catch {}
      }
      const fresh = await apiGet('/api/users/profile').catch(()=>null);
      if (fresh) {
        if (typeof fresh.tfa_enabled === 'boolean') setTfaEnabled(fresh.tfa_enabled);
        if (fresh.security_question) setSavedQuestion(fresh.security_question);
        if (fresh.tfa_phone) {
          setTfaPhone(formatPhoneNumber(fresh.tfa_phone.replace('+1', '')));
          setTfaPhoneVerified(true);
        }
        await AsyncStorage.setItem('profile_cache_v1', JSON.stringify(fresh)).catch(()=>{});
      }
    };
    load();
  }, []);

  const persist = async (changes: any) => {
    setSaving(true);
    try {
      const updated = await apiPut('/api/users/profile', changes);
      await AsyncStorage.setItem('profile_cache_v1', JSON.stringify(updated)).catch(()=>{});
      showToast({ message: 'Security settings updated', variant: 'success' });
    } finally { setSaving(false); }
  };

  const toggleTfa = async () => {
    const next = !tfaEnabled;

    if (next && !tfaPhoneVerified) {
      // If enabling 2FA but no phone verified, prompt to add phone first
      Alert.alert(
        'Add Phone Number',
        'To enable Two-Factor Authentication, please add and verify a phone number first.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Phone', onPress: () => setPhoneModalVisible(true) }
        ]
      );
      return;
    }

    setTfaEnabled(next);
    if (!next) {
      setSavedQuestion('');
      setSavedAnswer('');
    }
    await persist({ tfa_enabled: next });
  };

  const sendVerificationCode = async () => {
    if (!isValidPhoneNumber()) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit US phone number');
      return;
    }

    setSendingCode(true);
    try {
      const phone = getCleanPhoneNumber();

      // Send OTP via Supabase
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) {
        throw error;
      }

      setCodeSent(true);
      showToast({ message: 'Verification code sent!', variant: 'success' });
    } catch (error: any) {
      console.error('Send code error:', error);
      Alert.alert('Error', error.message || 'Failed to send verification code');
    } finally {
      setSendingCode(false);
    }
  };

  const verifyPhoneCode = async () => {
    if (verificationCode.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit verification code');
      return;
    }

    setVerifyingCode(true);
    try {
      const phone = getCleanPhoneNumber();

      // Verify OTP - this will link the phone to the user account
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: verificationCode,
        type: 'sms',
      });

      if (error) {
        throw error;
      }

      // Save phone to profile
      await persist({ tfa_phone: phone, tfa_enabled: true });

      setTfaPhoneVerified(true);
      setTfaEnabled(true);
      setPhoneModalVisible(false);
      setCodeSent(false);
      setVerificationCode('');

      showToast({ message: 'Phone verified! 2FA is now enabled.', variant: 'success' });
    } catch (error: any) {
      console.error('Verify code error:', error);
      Alert.alert('Error', error.message || 'Invalid verification code');
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleSecurityQuestionPress = () => {
    if (tfaEnabled) {
      // Show the modal
      setModalVisible(true);
    }
  };

const closeBottomSheet = () => {
    setModalVisible(false);
  };

  const toggleDropdown = () => {
    setQuestionDropdownOpen(!questionDropdownOpen);
  };

  const selectQuestion = (question: string) => {
    setSelectedQuestion(question);
    setQuestionDropdownOpen(false);
  };

  const handleSaveQuestion = async () => {
    Keyboard.dismiss();
    if (selectedQuestion && securityAnswer) {
      const hash = simpleHash(securityAnswer);
      setSavedQuestion(selectedQuestion);
      setSavedAnswer('');
      await persist({ security_question: selectedQuestion, security_answer_hash: hash });
      closeBottomSheet();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Security / Two-Factor authentication</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Enable Two-Factor authentication</Text>
          <Switch
            onValueChange={toggleTfa}
            value={tfaEnabled}
            trackColor={{ false: '#F2F2F2', true: '#4D7FFA' }}
            thumbColor="#FFFFFF"
          />
        </View>
        <Text style={styles.sectionDescription}>
          Enable 2FA to receive a unique code via text or authenticator app each time you log in.
        </Text>
      </View>

      {/* Phone Number Setup */}
      <TouchableOpacity
        style={styles.securityQuestionContainer}
        onPress={() => setPhoneModalVisible(true)}
      >
        <View style={styles.iconContainer}>
          <Phone size={20} color="#4D7FFA" />
        </View>
        <View style={styles.securityQuestionContent}>
          <Text style={styles.securityQuestionTitle}>
            {tfaPhoneVerified ? 'Update phone number' : 'Add phone number'}
          </Text>
          <Text style={styles.securityQuestionDescription}>
            {tfaPhoneVerified
              ? `Verified: ${tfaPhone}`
              : 'Add a phone number to receive verification codes via SMS.'}
          </Text>
        </View>
        <ChevronRight color="#4D4845" size={24} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.securityQuestionContainer, !tfaEnabled && styles.disabledContainer]}
        onPress={handleSecurityQuestionPress}
        disabled={!tfaEnabled}
      >
        <View style={[styles.iconContainer, !tfaEnabled && styles.iconContainerDisabled]}>
          <Shield size={20} color={tfaEnabled ? "#4D7FFA" : "#C0C0C0"} />
        </View>
        <View style={styles.securityQuestionContent}>
          <Text style={[styles.securityQuestionTitle, !tfaEnabled && styles.disabledText]}>
            Set a security question
          </Text>
          <Text style={[styles.securityQuestionDescription, !tfaEnabled && styles.disabledText]}>
            {savedQuestion
              ? `Question: ${savedQuestion.length > 30 ? savedQuestion.substring(0, 30) + '...' : savedQuestion}`
              : 'Choose a question only you can answer to help recover your account.'}
          </Text>
        </View>
        <ChevronRight color={tfaEnabled ? "#4D4845" : "#C0C0C0"} size={24} />
      </TouchableOpacity>

      {/* Phone Number Setup Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={phoneModalVisible}
        onRequestClose={() => {
          setPhoneModalVisible(false);
          setCodeSent(false);
          setVerificationCode('');
        }}
      >
        <TouchableWithoutFeedback onPress={() => {
          setPhoneModalVisible(false);
          setCodeSent(false);
          setVerificationCode('');
        }}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {codeSent ? 'Verify Phone' : 'Add Phone Number'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setPhoneModalVisible(false);
                      setCodeSent(false);
                      setVerificationCode('');
                    }}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonIcon}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  {!codeSent ? (
                    <>
                      <Text style={styles.inputLabel}>Phone Number (US Only)</Text>
                      <View style={styles.phoneInputContainer}>
                        <View style={styles.countryCode}>
                          <Text style={styles.countryCodeText}>🇺🇸 +1</Text>
                        </View>
                        <TextInput
                          placeholder="(555) 555-5555"
                          value={tfaPhone}
                          onChangeText={handlePhoneChange}
                          keyboardType="phone-pad"
                          style={styles.phoneInput}
                          maxLength={14}
                        />
                      </View>
                      <Text style={styles.phoneHint}>
                        We'll send a verification code to this number.
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.inputLabel}>Verification Code</Text>
                      <TextInput
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                        keyboardType="number-pad"
                        style={styles.textInput}
                        maxLength={6}
                        autoFocus
                      />
                      <Text style={styles.phoneHint}>
                        Enter the code sent to {tfaPhone}
                      </Text>
                    </>
                  )}
                </View>

                <View style={styles.buttonContainer}>
                  {!codeSent ? (
                    <TouchableOpacity
                      style={[styles.saveButton, (!isValidPhoneNumber() || sendingCode) && styles.disabledButton]}
                      onPress={sendVerificationCode}
                      disabled={!isValidPhoneNumber() || sendingCode}
                    >
                      {sendingCode ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.saveButtonText}>Send Code</Text>
                      )}
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.saveButton, (verificationCode.length !== 6 || verifyingCode) && styles.disabledButton]}
                      onPress={verifyPhoneCode}
                      disabled={verificationCode.length !== 6 || verifyingCode}
                    >
                      {verifyingCode ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.saveButtonText}>Verify</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Security Question Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeBottomSheet}
      >
        <TouchableWithoutFeedback onPress={closeBottomSheet}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Set a security question</Text>
                  <TouchableOpacity onPress={closeBottomSheet} style={styles.closeButton}>
                    <Text style={styles.closeButtonIcon}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Select question</Text>
                    <TouchableOpacity
                      style={styles.selectInput}
                      onPress={toggleDropdown}
                    >
                      <Text style={styles.selectInputText}>{selectedQuestion}</Text>
                      <Text style={styles.selectArrow}>▼</Text>
                    </TouchableOpacity>

                    {questionDropdownOpen && (
                      <View style={styles.dropdownList}>
                        {securityQuestions.map((question, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[styles.dropdownItem, index === securityQuestions.length - 1 && styles.lastDropdownItem]}
                            onPress={() => selectQuestion(question)}
                          >
                            <Text style={styles.dropdownItemText}>{question}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  <View style={styles.answerContainer}>
                    <Text style={styles.inputLabel}>Your answer</Text>
                    <TextInput
                      style={styles.textInput}
                      value={securityAnswer}
                      onChangeText={setSecurityAnswer}
                      placeholder="Enter answer"
                      placeholderTextColor="#C0C0C0"
                    />
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.saveButton, (!securityAnswer || saving) && styles.disabledButton]}
                    onPress={handleSaveQuestion}
                    disabled={!securityAnswer || saving}
                  >
                    <Text style={styles.saveButtonText}>{saving ? 'Saving…' : 'Save question'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    color: '#1C1C1C',
  },
  section: {
    marginTop: 30,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1E1E1E',
  },
  sectionDescription: {
    fontSize: 12,
    color: '#928F8B',
    lineHeight: 18,
  },
  securityQuestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerDisabled: {
    backgroundColor: '#F5F5F5',
  },
  securityQuestionContent: {
    flex: 1,
    marginRight: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    marginBottom: 8,
  },
  countryCode: {
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    height: '100%',
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333333',
  },
  phoneHint: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 24,
  },
  securityQuestionTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1E1E1E',
  },
  securityQuestionDescription: {
    fontSize: 12,
    color: '#928F8B',
    marginTop: 4,
    lineHeight: 18,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#C0C0C0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    minHeight: 400,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1C',
  },

  bottomSheetContent: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  dropdownContainer: {
    backgroundColor: '#F2F2F2',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6B7280',
  },
  dropdownList: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 16,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333333',
  },
  input: {
    backgroundColor: '#F2F2F2',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#4D7FFA',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#333333',
    opacity: 0.5,
    borderRadius: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CACACA",
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  closeButtonIcon: {
    fontSize: 18,
    color: '#333333',
  },
  modalBody: {
    paddingHorizontal: 24,
    flex: 1,
  },
  inputContainer: {
    position: 'relative',
    zIndex: 1,
    marginBottom: 40,
  },
  answerContainer: {
    marginBottom: 80,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 12,
  },
  selectInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectInputText: {
    fontSize: 16,
    color: '#333333',
  },
  selectArrow: {
    fontSize: 14,
    color: '#666666',
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    padding: 18,
    fontSize: 16,
    color: '#333333',
  },
  saveButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 30,
    paddingVertical: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TwoFactorAuthScreen;

// very simple non-cryptographic hash for demo; replace with proper hashing server-side
function simpleHash(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}
