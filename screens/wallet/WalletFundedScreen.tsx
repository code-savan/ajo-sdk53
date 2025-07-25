import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle, CircleCheck } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

export default function WalletFundedScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isConfirming, setIsConfirming] = useState(true);

  // Simulate a 3-second loading period
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConfirming(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoBack = () => {
    // Navigate to the main tabs and select the Wallet tab
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'MainTabs' }],
    // });
    navigation.navigate('MainTabs', { screen: 'Wallet' });
  };

  // Loading state during confirmation
  if (isConfirming) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.loadingText}>Confirming payment...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Success state after confirmation
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.successSection}>
        {/* <CircleCheck width={88} height={88} color="#17C964" /> */}
        {/* <Image
          source={require('../../assets/images/splash.png')}
          style={styles.splashImage}
          resizeMode="contain"
        /> */}
        <Image
        source={require('../../assets/images/approved.png')}
        style={styles.approved}
        resizeMode="contain"
        />
          <Text style={styles.successTitle}>Wallet Funded</Text>
          <Text style={styles.successMessage}>
            Payment successful! Your contribution has been recorded and reflected in the group.
          </Text>
        </View>

        <View style={styles.transactionDetailsCard}>
          <View style={styles.transactionRow}>
            <Text style={styles.transactionLabel}>Transaction type</Text>
            <Text style={styles.transactionValue}>Fund</Text>
          </View>

          <View style={styles.transactionRow}>
            <Text style={styles.transactionLabel}>Amount</Text>
            <Text style={styles.transactionValue}>$100</Text>
          </View>

          <View style={styles.transactionRow}>
            <Text style={styles.transactionLabel}>Payment method</Text>
            <Text style={styles.transactionValue}>Bank Transfer</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.transactionRow}>
            <Text style={styles.transactionLabel}>Total amount</Text>
            <Text style={styles.transactionValue}>$100.00</Text>
          </View>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4D4845',
    fontWeight: '500',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  approved: {
    width: 80,
    height: 80,
    borderRadius: 999,
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: '#6C6C6C',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '400',
  },
  transactionDetailsCard: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 20,
    width: '100%',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  transactionLabel: {
    fontSize: 12,
    color: '#9A9A9A',
  },
  transactionValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4D4845',
    textAlign: 'right',
  },
  divider: {
    height: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    borderStyle: 'dashed',
    marginBottom: 20,
    width: '100%',
  },
});
