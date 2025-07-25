import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';

// Define navigation prop types
interface ChangePinScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'ChangePin'>;
}

const ChangePinScreen: React.FC<ChangePinScreenProps> = ({ navigation }) => {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [repeatNewPin, setRepeatNewPin] = useState('');
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showRepeatPin, setShowRepeatPin] = useState(false);
  
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

  const handleSavePin = () => {
    // Here you would implement PIN validation and saving logic
    // For example, check if new PIN matches repeat PIN, if old PIN is correct, etc.
    console.log('Saving PIN...');
    navigation.goBack();
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
            maxLength={6}
            returnKeyType="next"
            onSubmitEditing={() => newPinRef.current?.focus()}
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
            maxLength={6}
            ref={newPinRef}
            returnKeyType="next"
            onSubmitEditing={() => repeatPinRef.current?.focus()}
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
            maxLength={6}
            ref={repeatPinRef}
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss();
              handleSavePin();
            }}
          />
          <TouchableOpacity onPress={toggleRepeatPinVisibility} style={styles.eyeIcon}>
            {showRepeatPin ? <EyeOff color="#B0B0B0" size={20} /> : <Eye color="#B0B0B0" size={20} />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSavePin}>
          <Text style={styles.saveButtonText}>Save Pin</Text>
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
    backgroundColor: '#EAEAEA',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#3B3B3B',
  },
});

export default ChangePinScreen;
