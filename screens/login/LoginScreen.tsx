import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ArrowLeft, Eye, EyeOff, ScanFace } from 'lucide-react-native';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleProceed = () => {
    if (pin.length >= 4) {
      navigation.navigate('MainTabs');
    }
  };

  const handleUseFaceID = () => {
    // Handle Face ID authentication
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Title and subtitle */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>"Welcome back. Let's get you where you left off."</Text>
        </View>

        {/* PIN Input Section */}
        <View style={styles.pinSection}>
          <Text style={styles.pinLabel}>Input Pin</Text>
          <View style={styles.pinInputContainer}>
            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={setPin}
              secureTextEntry={!showPin}
              placeholder="******"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={6}
            />
            <TouchableOpacity
              onPress={() => setShowPin(!showPin)}
              style={styles.eyeButton}
            >
              {showPin ? (
                <Eye size={20} color="#999" />
              ) : (
                <EyeOff size={20} color="#999" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Proceed Button */}
        <TouchableOpacity
          style={styles.proceedButton}
          onPress={handleProceed}
        >
          <Text style={styles.proceedButtonText}>Proceed</Text>
        </TouchableOpacity>

        {/* Face ID Button */}
        <View style={styles.faceIdSection}>
          <TouchableOpacity
            style={styles.faceIdButton}
            onPress={handleUseFaceID}
          >
            <Text style={styles.faceIdText}>Use face ID
            </Text>
            <ScanFace size={20} color="#000" />
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
  titleSection: {
    marginBottom: 60,
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
  pinSection: {
    marginBottom: 40,
  },
  pinLabel: {
    fontSize: 12,
    color: '#929292',
    marginBottom: 12,
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
    marginBottom: 60,
  },
  proceedButtonText: {
    color: '#FFFFFF',
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
  faceIdText: {
    fontSize: 14,
    color: '#1E1E1E',
    textAlign: 'center',
    fontWeight: "regular"
  },
});
