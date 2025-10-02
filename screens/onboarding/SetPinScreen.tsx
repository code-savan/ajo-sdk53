import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, X, Home } from 'lucide-react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import * as LocalAuthentication from 'expo-local-authentication';
import Modal from 'react-native-modal';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import * as SecureStore from 'expo-secure-store';

type SetPinScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SetPin'>;
type SetPinScreenRouteProp = RouteProp<RootStackParamList, 'SetPin'>;

interface Props {
  navigation: SetPinScreenNavigationProp;
  route: SetPinScreenRouteProp;
}

const SetPinScreen = ({ navigation, route }: Props) => {
  const { setupPin, biometricType, user, setSignupFlowComplete } = useAuth();
  const fullName = route.params?.fullName || '';
  const password = route.params?.password || '';

  // Debug logging
  console.log('SetPinScreen: Route params:', route.params);
  console.log('SetPinScreen: Extracted values:', { fullName, password });

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deviceBiometricType, setDeviceBiometricType] = useState<string | null>(null);

  const confirmPinRef = useRef<TextInput>(null);

  // Check device biometric capabilities on component mount
  useEffect(() => {
    checkDeviceBiometrics();
  }, []);


  const checkDeviceBiometrics = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      if (hasHardware && supportedTypes.length > 0) {
        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setDeviceBiometricType('face_id');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setDeviceBiometricType('fingerprint');
        } else {
          setDeviceBiometricType('biometric');
        }
      } else {
        setDeviceBiometricType(null);
      }
    } catch (error) {
      console.error('Device biometric check error:', error);
      setDeviceBiometricType(null);
    }
  };

  const handlePinChange = (value: string) => {
    // Only allow numeric input up to 4 digits
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 4) {
      setPin(numericValue);
      // Auto-focus confirm PIN field when 4 digits entered
      if (numericValue.length === 4) {
        setTimeout(() => confirmPinRef.current?.focus(), 100);
      }
    }
  };

  const handleConfirmPinChange = (value: string) => {
    // Only allow numeric input up to 4 digits
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 4) {
      setConfirmPin(numericValue);
    }
  };

  const checkBiometricAvailability = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (!hasHardware) {
      Alert.alert('Not Available', 'Biometric authentication is not available on this device');
      setFaceIdEnabled(false);
      return false;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert(
        'No Biometrics Enrolled',
        'Please set up Face ID or Touch ID in your device settings first'
      );
      setFaceIdEnabled(false);
      return false;
    }

    return true;
  };

  const handleFaceIdToggle = async (enabled: boolean) => {
    if (enabled) {
      // First check if biometrics are available
      const isAvailable = await checkBiometricAvailability();
      if (!isAvailable) {
        return; // checkBiometricAvailability already shows appropriate alerts
      }

      // Now authenticate with biometrics before enabling
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to enable biometric login',
          fallbackLabel: 'Cancel',
          cancelLabel: 'Cancel',
          disableDeviceFallback: true,  // This prevents device passcode fallback
        });

        if (result.success) {
          setFaceIdEnabled(true);

          // Store biometric preference locally
          await SecureStore.setItemAsync('biometric_enabled', 'true');

          Alert.alert(
            'Success',
            `${deviceBiometricType === 'face_id' ? 'Face ID' : deviceBiometricType === 'fingerprint' ? 'Fingerprint' : 'Biometric'} authentication has been enabled for your account.`
          );
        } else {
          // User cancelled or authentication failed
          setFaceIdEnabled(false);
          if (!result.success && 'error' in result && result.error === 'user_cancel') {
            // User cancelled, don't show error
            return;
          }
          Alert.alert(
            'Authentication Failed',
            'Biometric authentication failed. Please try again or use your device passcode to enable biometric login.'
          );
        }
      } catch (error) {
        console.error('Biometric authentication error:', error);
        Alert.alert(
          'Authentication Error',
          'Failed to authenticate. Biometric login remains disabled.'
        );
        setFaceIdEnabled(false);
      }
    } else {
      // Disabling biometric - no authentication needed
      setFaceIdEnabled(false);
      try {
        await SecureStore.deleteItemAsync('biometric_enabled');
      } catch (error) {
        console.error('Error removing biometric preference:', error);
      }
    }
  };

  const validatePins = () => {
    if (pin.length !== 4) {
      Alert.alert('Invalid PIN', 'Please enter a 4-digit PIN');
      return false;
    }

    if (confirmPin.length !== 4) {
      Alert.alert('Invalid PIN', 'Please confirm your 4-digit PIN');
      return false;
    }

    if (pin !== confirmPin) {
      Alert.alert('PIN Mismatch', 'PINs do not match. Please try again.');
      setConfirmPin('');
      return false;
    }

    // Check for simple patterns
    const weakPatterns = ['1234', '4321', '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '0123', '2345', '3456', '4567', '5678', '6789', '7890'];
    if (weakPatterns.includes(pin)) {
      Alert.alert(
        'Weak PIN',
        'Please choose a more secure PIN. Avoid simple patterns like 1234, 0000, or repeated digits.',
        [
          { text: 'Choose Different PIN', style: 'default' },
          { text: 'Use Anyway', style: 'destructive', onPress: () => handleSavePin() }
        ]
      );
      return false;
    }

    return true;
  };

  const handleSavePin = async () => {
    if (!validatePins()) return;

    setIsLoading(true);

    try {
      console.log('SetPinScreen: handleSavePin called with:', {
        pin: pin.length + ' digits',
        faceIdEnabled,
        password: password ? 'provided' : 'empty',
        fullName: fullName || 'empty'
      });

      // Save PIN with biometric preference, password, and fullName
      await setupPin(pin, faceIdEnabled, password, fullName);

      // Mark signup flow as complete
      setSignupFlowComplete();

      // Show success modal
      setShowSuccessModal(true);

    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to save PIN. Please try again.';
      Alert.alert('Error', errorMessage);
      console.error('PIN setup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    navigation.navigate('VerifyAccount' as never);
  };

  useEffect(() => {
    if (showSuccessModal) {
      const t = setTimeout(() => {
        handleSuccessConfirm();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [showSuccessModal]);


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Set Your 4-Digit PIN</Text>
            <Text style={styles.description}>
              Create a secure 4-digit PIN to protect your account and approve important actions like payments and withdrawals.
            </Text>
          </View>



          {/* PIN Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Input Pin</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.pinInput}
                value={pin}
                onChangeText={handlePinChange}
                placeholder="Enter 4-digit PIN"
                placeholderTextColor="#B0B0B0"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry={!showPin}
                autoComplete="off"
                textContentType="none"
                returnKeyType="next"
                onSubmitEditing={() => confirmPinRef.current?.focus()}
                selectTextOnFocus={true}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPin(!showPin)}
              >
                {showPin ? (
                  <EyeOff size={20} color="#B0B0B0" />
                ) : (
                  <Eye size={20} color="#B0B0B0" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm PIN Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Confirm Pin</Text>
            <View style={styles.inputContainer}>
              <TextInput
                ref={confirmPinRef}
                style={styles.pinInput}
                value={confirmPin}
                onChangeText={handleConfirmPinChange}
                placeholder="Confirm 4-digit PIN"
                placeholderTextColor="#B0B0B0"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry={!showConfirmPin}
                autoComplete="off"
                textContentType="none"
                returnKeyType="done"
                onSubmitEditing={handleSavePin}
                selectTextOnFocus={true}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPin(!showConfirmPin)}
              >
                {showConfirmPin ? (
                  <EyeOff size={20} color="#B0B0B0" />
                ) : (
                  <Eye size={20} color="#B0B0B0" />
                )}
              </TouchableOpacity>
            </View>
          </View>
             {/* Face ID Toggle */}
             {(deviceBiometricType || biometricType) && (
            <View style={styles.faceIdSection}>
              <Text style={styles.faceIdLabel}>
                Enable {(deviceBiometricType || biometricType) === 'face_id' ? 'Face ID 🤗' : (deviceBiometricType || biometricType) === 'fingerprint' ? 'Fingerprint 👆' : 'Biometric 🔒'}
              </Text>
          <TouchableOpacity
            style={[styles.toggle, faceIdEnabled && styles.toggleActive]}
            onPress={() => handleFaceIdToggle(!faceIdEnabled)}
            activeOpacity={0.7}
          >
            <View style={[styles.toggleKnob, faceIdEnabled && styles.toggleKnobActive]} />
              </TouchableOpacity>
            </View>
          )}

 {/* Security Notes */}
 <View style={styles.securityNotesContainer}>
            <Text style={styles.securityNotesTitle}>PIN Security Tips:</Text>
            <View style={styles.securityNote}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.securityNoteText}>Choose a PIN that's hard to guess</Text>
            </View>
            <View style={styles.securityNote}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.securityNoteText}>Avoid using birthdays or simple patterns (1234, 0000)</Text>
            </View>
            <View style={styles.securityNote}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.securityNoteText}>This PIN will be used for all transactions</Text>
            </View>
          </View>


        </ScrollView>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSavePin}
            disabled={isLoading || pin.length !== 4 || confirmPin.length !== 4}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save info'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        isVisible={showSuccessModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}
        style={styles.modal}
        onBackdropPress={() => {}}
        onBackButtonPress={() => {}}
        useNativeDriver
        useNativeDriverForBackdrop
      >
        <View style={styles.modalContent}>
          {/* Removed close (X) button to prevent dismiss */}
          <View style={styles.modalBody}>
            <Text style={styles.modalTitle}>Your 4-Digit Pin has been set.</Text>
            <Text style={styles.modalDescription}>
              You'll use this PIN to log in and confirm important actions like payments and withdrawals.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleSuccessConfirm}
          >
            <Text style={styles.modalButtonText}>Proceed to verification</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 10,
  },
  description: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 2,
  },
  inputSection: {
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 5,
    fontWeight: '500',
  },
  inputContainer: {
    position: 'relative',
  },
  pinInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000000',
    paddingRight: 50,
    letterSpacing: 3,
    textAlign: 'left',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 18,
    padding: 4,
  },
  faceIdSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  faceIdLabel: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#007AFF',
  },
  toggleKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: 0 }],
  },
  toggleKnobActive: {
    transform: [{ translateX: 20 }],
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  saveButton: {
    backgroundColor: '#000000',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    minHeight: 300,
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 10,
  },
  modalBody: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: '#000000',
    borderRadius: 25,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  modalButtonIcon: {
    marginRight: 8,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Security Notes Styles
  securityNotesContainer: {
    // backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 32,
  },
  securityNotesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 12,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 12,
    color: '#666666',
    marginRight: 8,
    marginTop: 1,
  },
  securityNoteText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
    flex: 1,
  },
});

export default SetPinScreen;
