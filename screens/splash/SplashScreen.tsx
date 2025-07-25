import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const bounce1 = new Animated.Value(0);
  const bounce2 = new Animated.Value(0);
  const bounce3 = new Animated.Value(0);

  useEffect(() => {
    // Auto-navigate to sign up after 2 seconds
    const timer = setTimeout(() => {
      navigation.navigate('Signup');
    }, 2000);

    // Animate the dots
    const animateDot = (animValue: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: -10,
            duration: 300,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDot(bounce1, 0);
    animateDot(bounce2, 100);
    animateDot(bounce3, 200);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#16a34a', '#15803d']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* App Logo */}
        <Image 
          source={require('../../assets/images/Ajo.png')} 
          style={styles.logoImage} 
          resizeMode="contain"
        />

        {/* Splash Image */}
        <Image 
          source={require('../../assets/images/splash.png')} 
          style={styles.splashImage} 
          resizeMode="contain"
        />
        
        {/* App Name */}
        <Text style={styles.appName}>Ajo</Text>
        <Text style={styles.tagline}>Grow your savings together</Text>

        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.dotsContainer}>
            <Animated.View
              style={[
                styles.dot,
                { transform: [{ translateY: bounce1 }] },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                { transform: [{ translateY: bounce2 }] },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                { transform: [{ translateY: bounce3 }] },
              ]}
            />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  logoImage: {
    width: 150,
    height: 60,
    marginBottom: 32,
  },
  splashImage: {
    width: '100%',
    height: 300,
    marginBottom: 32,
  },
  appName: {
    fontSize: 36,
    fontFamily: 'Roboto-Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    fontFamily: 'Inter',
    color: '#dcfce7',
  },
  loadingContainer: {
    marginTop: 48,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    marginHorizontal: 2,
  },
});
