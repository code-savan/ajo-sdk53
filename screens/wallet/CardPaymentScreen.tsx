import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

export default function CardPaymentScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Simulate payment processing
  const processPayment = () => {
    setIsProcessing(true);
    
    // Simulate network delay for payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to wallet funded screen on successful payment
      navigation.navigate('WalletFunded');
    }, 3000);
  };

  useEffect(() => {
    // Automatically process payment when the screen loads
    // This is just a placeholder implementation
    processPayment();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Processing payment</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {isProcessing ? 'Processing your payment...' : 'Payment completed!'}
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#000000',
    marginTop: 16,
  },
});
