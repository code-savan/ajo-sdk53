import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Keyboard, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '../../contexts/SupabaseAuthContext';

// Define navigation prop types
interface ChangePinScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'ChangePin'>;
}

const ChangePinScreen: React.FC<ChangePinScreenProps> = ({ navigation }) => {
  const { updatePin } = useAuth();
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [repeatNewPin, setRepeatNewPin] = useState('');
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showRepeatPin, setShowRepeatPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for TextInputs to allow focus management
  const newPinRef = useRef<TextInput>(null);
  const repeatPinRef = useRef<TextInput>(null);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const toggleOldPinVisibility = () => {
    setShowOldPin(!showOldPin);
  };

  const toggleNewPinVisibility = () => {
    setShowNewPin(!showNewPin);
  };

  const toggleRepeatPinVisibility = () => {
    setShowRepeatPin(!showRepeatPin);
  };

  const handleSavePin = async () => {
    // Validate inputs
    if (!oldPin.trim()) {
      Alert.alert('Error', 'Please enter your current PIN');
      return;
    }

    if (oldPin.length !== 4) {
      Alert.alert('Error', 'Current PIN must be 4 digits');
      return;
    }

    if (!newPin.trim()) {
      Alert.alert('Error', 'Please enter a new PIN');
      return;
    }

    if (newPin.length !== 4) {
      Alert.alert('Error', 'New PIN must be 4 digits');
      return;
    }

    if (!repeatNewPin.trim()) {
      Alert.alert('Error', 'Please confirm your new PIN');
      return;
    }

    if (newPin !== repeatNewPin) {
      Alert.alert('Error', 'New PIN and confirmation do not match');
      return;
    }

    if (oldPin === newPin) {
      Alert.alert('Error', 'New PIN must be different from your current PIN');
      return;
    }

    // Validate PIN is numeric
    if (!/^\d{4}$/.test(newPin)) {
      Alert.alert('Error', 'PIN must contain only numbers');
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      await updatePin(oldPin, newPin);

      Alert.alert(
        'Success',
        'Your PIN has been changed successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error('PIN change error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to change PIN. Please check your current PIN and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Security / Change security pin</Text>
      </View>

      <Text style={styles.description}>
        Set a 4-digit PIN to secure your account.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Old pin</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={oldPin}
            onChangeText={setOldPin}
            placeholder="******"
            placeholderTextColor="#1C1C1C"
            secureTextEntry={!showOldPin}
            keyboardType="numeric"
            maxLength={4}
            returnKeyType="next"
            onSubmitEditing={() => newPinRef.current?.focus()}
            editable={!isLoading}
          />
          <TouchableOpacity onPress={toggleOldPinVisibility} style={styles.eyeIcon}>
            {showOldPin ? <EyeOff color="#B0B0B0" size={20} /> : <Eye color="#B0B0B0" size={20} />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>New pin</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={newPin}
            onChangeText={setNewPin}
            placeholder="******"
            placeholderTextColor="#1C1C1C"
            secureTextEntry={!showNewPin}
            keyboardType="numeric"
            maxLength={4}
            ref={newPinRef}
            returnKeyType="next"
            onSubmitEditing={() => repeatPinRef.current?.focus()}
            editable={!isLoading}
          />
          <TouchableOpacity onPress={toggleNewPinVisibility} style={styles.eyeIcon}>
            {showNewPin ? <EyeOff color="#B0B0B0" size={20} /> : <Eye color="#B0B0B0" size={20} />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Repeat new pin</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={repeatNewPin}
            onChangeText={setRepeatNewPin}
            placeholder="******"
            placeholderTextColor="#1C1C1C"
            secureTextEntry={!showRepeatPin}
            keyboardType="numeric"
            maxLength={4}
            ref={repeatPinRef}
            returnKeyType="done"
            onSubmitEditing={() => {
              if (!isLoading) {
                handleSavePin();
              }
            }}
            editable={!isLoading}
          />
          <TouchableOpacity onPress={toggleRepeatPinVisibility} style={styles.eyeIcon}>
            {showRepeatPin ? <EyeOff color="#B0B0B0" size={20} /> : <Eye color="#B0B0B0" size={20} />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSavePin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Pin</Text>
          )}
        </TouchableOpacity>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
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
  description: {
    fontSize: 12,
    color: '#303030',
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    color: '#929292',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    position: 'relative',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1C',
  },
  eyeIcon: {
    padding: 8,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  saveButton: {
    backgroundColor: '#000000',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
  },
});

export default ChangePinScreen;
