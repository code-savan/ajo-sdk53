import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

export default function SignupScreen() {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSignup = () => {
    console.log('Signup button pressed');
    // Just need email to proceed - let's remove the mobileNumber check
    if (email) {
      console.log('Navigating to VerifyEmail');
      navigation.navigate('VerifyEmail');
    } else {
      console.log('Email is required');
      // Could show an alert or error message here
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
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Create your account.</Text>
          <Text style={styles.subtitle}>Set up your account to join a group and grow your savings.</Text>

          <View style={styles.form}>
            <Text style={styles.inputLabel}>Email address</Text>
            <Input
              placeholder="Johndoe@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <Text style={styles.inputLabel}>Mobile No.</Text>
            <Input
              placeholder="Enter mobile number"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
              style={styles.input}
            />

            <Button
              title="Proceed"
              onPress={handleSignup}
              style={styles.proceedButton}
            />

            <Text style={styles.orText}>Or get started with</Text>

            <TouchableOpacity style={styles.gmailButton}>
              <Image
                source={require('../../assets/images/gmail.png')}
                style={styles.gmailIcon}
              />
              <Text style={styles.gmailButtonText}>Create account with Gmail</Text>
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
    fontSize: 16,
    fontWeight: "regular"
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
});
