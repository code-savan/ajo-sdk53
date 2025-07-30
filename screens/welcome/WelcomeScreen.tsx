import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const handleCreateAccount = () => {
    navigation.navigate('Signup');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.content}>
        {/* App Logo/Title */}
        <Image
            source={require('../../assets/images/ajoblue.png')}
            style={styles.topImage}
            resizeMode="contain"
          />

        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/splash.png')}
            style={styles.mainImage}
            resizeMode="contain"
          />
        {/* Description Text */}
        <Text style={styles.descriptionText}>
          Join forces with friends, family, or teams to reach your goals faster.
        </Text>
        </View>


        {/* Create Account Button */}
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={handleCreateAccount}
        >
          <Text style={styles.createAccountText}>Create account</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.loginText}>
            Already have an account: <Text style={styles.loginLink}>Login here</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 50,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3B82F6', // Blue color for Ajo title
    textAlign: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  topImage: {
    width: '100%',
    height: 30,
    // maxWidth: 400,
  },
  mainImage: {
    width: '100%',
    height: 350,
    maxWidth: 400,
  },
  descriptionText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#1C1C1C',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 40,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  createAccountButton: {
    backgroundColor: '#0D0D0D',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
  },
  createAccountText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#3358FF',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: '400',
  },
  loginLink: {
    color: '#3358FF',
  },
});
