import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const route = useRoute();
  const { isInSignupFlow } = useAuth();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (hasNavigated) return;

    const timer = setTimeout(async () => {
      if (hasNavigated) return;
      try {
        // Decide destination based on presence of any stored session/token
        let goTo: keyof RootStackParamList = 'Welcome';
        try {
          const { data } = await supabase.auth.getSession();
          const storedAny = await AsyncStorage.getItem('sb-cpvgznbnczuqzmyvaxdo-auth-token');
          if (data?.session?.access_token || storedAny) {
            goTo = 'Login';
          }
        } catch {}

        setHasNavigated(true);
        navigation.replace(goTo);
      } catch {}
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, hasNavigated]);

  return (
    <View style={styles.container}>
      {/* <ImageBackground
        source={require('../../assets/images/bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      > */}
        <View style={styles.content}>
          {/* Ajo Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/ajowhite.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Tagline */}
          <View style={styles.taglineContainer}>
            <Text style={styles.tagline}>
              A smarter way to{"\n"}save together.
            </Text>
          </View>
        </View>
      {/* </ImageBackground> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3358FF', // Blue background color
  },
  backgroundImage: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 116,
    // No width specified - let it maintain aspect ratio
  },
  taglineContainer: {
    paddingBottom: 40,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '400', // Regular weight
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
});
