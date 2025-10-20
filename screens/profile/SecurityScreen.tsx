import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, TextInput, Dimensions, Alert, ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react-native';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import * as SecureStore from 'expo-secure-store';

// Define navigation prop types
interface SecurityScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Security'>;
}

const SecurityScreen: React.FC<SecurityScreenProps> = ({ navigation }) => {
  const {
    biometricEnabled,
    biometricType,
    enableBiometric,
    disableBiometric,
    verifyPin,
    signOut,
    user
  } = useAuth();

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [pin, setPin] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showPinModal, setShowPinModal] = React.useState(false);
  const [pinForBiometric, setPinForBiometric] = React.useState('');
  const [localBiometricEnabled, setLocalBiometricEnabled] = React.useState(biometricEnabled);

  // Update local state when context state changes
  React.useEffect(() => {
    setLocalBiometricEnabled(biometricEnabled);
  }, [biometricEnabled]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const toggleBiometrics = async () => {
    if (isProcessing) return;

    try {
      if (!localBiometricEnabled) {
        // Enabling biometrics - show PIN verification modal first
        setShowPinModal(true);
      } else {
        // Disabling biometrics
        Alert.alert(
          'Disable Biometrics',
          'Are you sure you want to disable biometric authentication?',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Disable',
              style: 'destructive',
              onPress: async () => {
                setIsProcessing(true);
                try {
                  await disableBiometric();
                  // Also clear biometric_type in DB
                  try {
                    const { supabase } = await import('../../lib/supabase');
                    if (user?.id) {
                      await supabase
                        .from('users')
                        .update({ biometric_type: null, biometric_enabled: false, updated_at: new Date().toISOString() })
                        .eq('id', user.id);
                    }
                  } catch {}
                  setLocalBiometricEnabled(false);
                  Alert.alert('Success', 'Biometric authentication has been disabled.');
                } catch (error: any) {
                  Alert.alert('Error', error.message || 'Failed to disable biometrics');
                } finally {
                  setIsProcessing(false);
                }
              }
            }
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to toggle biometrics');
    }
  };

  const handleEnableBiometric = async () => {
    if (pinForBiometric.length !== 4) {
      Alert.alert('Error', 'Please enter your 4-digit PIN');
      return;
    }

    console.log('=== BIOMETRIC ENABLE DEBUG INFO ===');
    console.log('Current biometricType from context:', biometricType);
    console.log('Current biometricEnabled from context:', biometricEnabled);
    console.log('Current localBiometricEnabled:', localBiometricEnabled);
    console.log('User object:', user?.id ? 'Present' : 'Missing');

    setIsProcessing(true);
    try {
      console.log('Starting biometric enable process...');

      // First verify the PIN
      const isPinValid = await verifyPin(pinForBiometric);
      if (!isPinValid) {
        Alert.alert('Error', 'Incorrect PIN');
        return;
      }

      console.log('PIN verified successfully');

      // Close the PIN modal
      setShowPinModal(false);
      setPinForBiometric('');

      // Dismiss keyboard to prevent blocking biometric popup
      Keyboard.dismiss();

      // Add a small delay to ensure keyboard is fully dismissed
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if biometrics are available
      const LocalAuth = await import('expo-local-authentication');
      const hasHardware = await LocalAuth.hasHardwareAsync();
      const isEnrolled = await LocalAuth.isEnrolledAsync();
      const supportedTypes = await LocalAuth.supportedAuthenticationTypesAsync();

      console.log('Biometric availability check:', {
        hasHardware,
        isEnrolled,
        supportedTypes,
        biometricType
      });

      // Let's also check the security level
      try {
        const securityLevel = await LocalAuth.getEnrolledLevelAsync();
        console.log('Security level:', securityLevel);
      } catch (secError) {
        console.log('Could not get security level:', secError);
      }

      if (!hasHardware) {
        Alert.alert('Hardware Not Available', 'This device does not support biometric authentication');
        return;
      }

      if (!isEnrolled) {
        Alert.alert('Biometrics Not Set Up', 'Please set up Face ID or Touch ID in your device settings first');
        return;
      }

      if (supportedTypes.length === 0) {
        Alert.alert('No Biometric Types', 'No biometric authentication types are available on this device');
        return;
      }

      console.log('Biometric hardware available, prompting for authentication...');

      // Prompt for biometric authentication with minimal options
      const result = await LocalAuth.authenticateAsync({
        promptMessage: 'Use your biometric to enable this feature',
      });

      console.log('Biometric authentication result:', result);

      if (!result.success) {
        console.log('Biometric authentication failed. Result:', JSON.stringify(result, null, 2));

        // Handle different failure reasons
        if (result.error === 'user_cancel') {
          Alert.alert('Cancelled', 'You cancelled the biometric authentication');
          return;
        } else if (result.error === 'not_available') {
          Alert.alert('Not Available', 'Biometric authentication is not available on this device');
          return;
        } else if (result.error === 'not_enrolled') {
          Alert.alert('Not Set Up', 'Please set up Face ID or Touch ID in your device settings first');
          return;
        } else if (result.error === 'lockout') {
          Alert.alert('Locked Out', 'Too many failed attempts. Please try again later or use your device passcode');
          return;
        } else {
          Alert.alert('Authentication Failed', `Biometric authentication failed: ${result.error || 'Unknown error'}`);
          return;
        }
      }

      // Check for Face ID permission warning
      if (
        'warning' in result &&
        typeof result.warning === 'string' &&
        result.warning.includes('NSFaceIDUsageDescription')
      ) {
        Alert.alert(
          'App Update Required',
          'The app needs to be updated to properly support Face ID. Please restart the app or reinstall it from the App Store.',
          [
            { text: 'OK', onPress: () => {} }
          ]
        );
        return;
      }

      console.log('Biometric authentication successful, updating database...');

      // Determine biometric type based on device capabilities
      let detectedType: 'face_id' | 'fingerprint' | 'biometric' = 'biometric';
      try {
        const AuthType: any = (LocalAuth as any).AuthenticationType || {};
        if (supportedTypes.includes(AuthType.FACIAL_RECOGNITION)) detectedType = 'face_id';
        else if (supportedTypes.includes(AuthType.FINGERPRINT)) detectedType = 'fingerprint';
      } catch {}

      // Get stored password and save biometric settings
      const storedPassword = await SecureStore.getItemAsync('user_password');

      // Save biometric settings locally
      await SecureStore.setItemAsync('biometric_enabled', 'true');
      if (storedPassword) {
        await SecureStore.setItemAsync('user_password', storedPassword);
      }

      // Update database if user exists
      if (user?.id) {
        const { supabase } = await import('../../lib/supabase');
        const { error } = await supabase
          .from('users')
          .update({
            biometric_enabled: true,
            biometric_type: detectedType,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error) {
          console.error('Database update error:', error);
          // Don't fail the whole process for database errors
        }
      }

      console.log('Biometric enabled successfully');

      // Update local state immediately
      setLocalBiometricEnabled(true);

      Alert.alert(
        'Success',
        `${biometricType === 'face_id' ? 'Face ID' : biometricType === 'fingerprint' ? 'Fingerprint' : 'Biometric'} authentication has been enabled.`
      );

    } catch (error: any) {
      console.error('Biometric enable error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to enable biometric authentication'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangePinPress = () => {
    navigation.navigate('ChangePin');
  };

  const handleTwoFactorAuthPress = () => {
    navigation.navigate('TwoFactorAuth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Security</Text>
      </View>

      <Text style={styles.description}>
        Control your PIN, biometric settings, and account protection options.
      </Text>

      <TouchableOpacity style={styles.option} onPress={handleChangePinPress}>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Change security pin</Text>
          <Text style={styles.optionDescription}>Set a 4-digit PIN to secure your account.</Text>
        </View>
        <ChevronRight color={"#4D4845"}  />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={handleTwoFactorAuthPress}>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Two-Factor authentication</Text>
          <Text style={styles.optionDescription}>Add an extra layer of security to your account login.</Text>
        </View>
        <ChevronRight color={"#4D4845"}  />
      </TouchableOpacity>

      <View style={styles.option}>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Enable biometrics</Text>
          <Text style={styles.optionDescription}>
            {biometricType ?
              `Enable/disable ${biometricType === 'face_id' ? 'Face ID' : biometricType === 'fingerprint' ? 'Touch ID' : 'biometric'} authentication` :
              'Biometric authentication not available on this device'}
          </Text>
        </View>
        {biometricType ? (
          isProcessing ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Switch
              onValueChange={toggleBiometrics}
              value={localBiometricEnabled}
              disabled={isProcessing}
            />
          )
        ) : (
          <Text style={styles.unavailableText}>N/A</Text>
        )}
      </View>

      <TouchableOpacity style={styles.option} onPress={() => setShowDeleteModal(true)}>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Delete Account</Text>
          <Text style={styles.optionDescription}>Permanently close your account and erase associated data.</Text>
        </View>
        <ChevronRight color={"#4D4845"} />
      </TouchableOpacity>

      <Modal
        visible={showDeleteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowDeleteModal(false)}
          />
          <View style={styles.keyboardAwareBottomSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delete account</Text>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.deleteIconContainer}>
              <View style={styles.deleteIconWrapper}>
                <Trash2 size={32} color="#D73527" />
              </View>
            </View>

            <Text style={styles.modalText}>Input pin to delete account</Text>

            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={setPin}
              placeholder="****"
              placeholderTextColor="#999"
              secureTextEntry={true}
              keyboardType="numeric"
              maxLength={4}
            />

            <TouchableOpacity
              style={styles.saveButton}
              disabled={pin.length !== 4}
            >
              <Text style={styles.saveButtonText}>Delete account</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* PIN Verification Modal for Biometric Enable */}
      <Modal
        visible={showPinModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowPinModal(false);
          setPinForBiometric('');
        }}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => {
              setShowPinModal(false);
              setPinForBiometric('');
            }}
          />
          <View style={styles.keyboardAwareBottomSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Verify PIN</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowPinModal(false);
                  setPinForBiometric('');
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalText}>Enter your PIN to enable biometric authentication</Text>

            <TextInput
              style={styles.pinInput}
              value={pinForBiometric}
              onChangeText={setPinForBiometric}
              placeholder="****"
              placeholderTextColor="#999"
              secureTextEntry={true}
              keyboardType="numeric"
              maxLength={4}
              autoFocus
            />

            <TouchableOpacity
              style={[styles.saveButton, pinForBiometric.length !== 4 && styles.disabledButton]}
              disabled={pinForBiometric.length !== 4 || isProcessing}
              onPress={handleEnableBiometric}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Enable Biometric</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginVertical: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  optionContent: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1E1E1E',
  },
  optionDescription: {
    fontSize: 12,
    color: '#928F8B',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4D4845',
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CACACA",
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6B6B6B',
    fontWeight: '500',
  },
  deleteIconContainer: {
    marginBottom: 30,
  },
  deleteIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FDD8D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#6B6B6B',
    marginBottom: 20,
    textAlign: 'left',
    alignSelf: 'flex-start',
    width: '100%',
  },
  pinInput: {
    width: '100%',
    height: 60,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    paddingHorizontal: 15,
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    color: '#1C1C1C',
  },
  saveButton: {
    width: '100%',
    height: 56,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  unavailableText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.7,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  keyboardAwareBottomSheet: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: 'relative',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
});

export default SecurityScreen;
