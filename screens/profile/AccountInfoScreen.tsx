import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Pressable, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ChevronLeft, Pencil } from 'lucide-react-native';

type AccountInfoScreenProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

export default function AccountInfoScreen({ navigation }: AccountInfoScreenProps) {
  const [fullName, setFullName] = useState('Dean Winchester');
  const [email, setEmail] = useState('deanwinchester@gmail.com');
  const [phoneNumber, setPhoneNumber] = useState('+1 555 0324');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSaveChanges = () => {
    // Save user information here
    navigation.goBack();
  };

  // Set up keyboard listeners to track keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    // Clean up listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <ChevronLeft color="#000" size={24} />
        </Pressable>
        <Text style={styles.headerText}>Account info</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 30}
        enabled={keyboardVisible}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollViewContent, keyboardVisible && styles.keyboardActiveContent]}>
        <Text style={styles.subHeader}>Update your personal details, contact info, and preferences.</Text>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=987' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIcon}>
            <Pencil color="#fff" size={16} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Full name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Mobile No.</Text>
        <View style={styles.phoneInputContainer}>
          <View style={styles.countryCodeContainer}>
            <Text style={styles.flagEmoji}>🇺🇸</Text>
            <Text style={styles.arrowDown}>▼</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>
      </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save changes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    color: "#1E1E1E"
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  keyboardActiveContent: {
    paddingBottom: 40, // Reduced padding as the button is now outside the ScrollView
  },
  keyboardAvoidView: {
    flex: 1,
  },
  subHeader: {
    fontSize: 12,
    color: '#303030',
    marginBottom: 24,
    marginTop: 8,
  },
  imageContainer: {
    alignItems: 'flex-start',
    marginVertical: 16,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
  },
  editIcon: {
    position: 'absolute',
    left: 80,
    bottom: 0,
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 8,
  },
  label: {
    fontSize: 12,
    color: '#303030',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    height: 56,
    width: '100%',
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 16,
    borderRadius: 16,
    borderColor: "#DCDCDC",
    borderWidth: 1,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "400"
  },
  phoneInputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
    height: 56,
    borderRadius: 16,
    borderColor: "#DCDCDC",
    borderWidth: 1,
    overflow: "hidden"
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 12,
    // marginRight: 2,
    height: 56,
    width: 80,
  },
  flagEmoji: {
    fontSize: 24,
    marginRight: 4,
  },
  arrowDown: {
    fontSize: 10,
    color: '#555',
    marginLeft: 4,
  },
  phoneInput: {
    flex: 1,
    height: 56,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 16,
    fontSize: 12,
    fontWeight: "400"
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
    marginTop: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
