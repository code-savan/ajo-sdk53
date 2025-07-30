import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Home } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type GroupFundedScreenRouteProp = {
  params: {
    amount?: string;
    groupName?: string;
  };
};

export default function GroupFundedScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<GroupFundedScreenRouteProp>();
  const [isConfirming, setIsConfirming] = useState(true);

  // Get parameters from route or use defaults
  const amount = route.params?.amount || '$100';
  const groupName = route.params?.groupName || 'Hawaii Vacation';

  // Simulate a 3-second loading period
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConfirming(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoBack = () => {
    // Navigate back to main tabs
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  const handleGoHome = () => {
    navigation.navigate('MainTabs', { screen: 'Home' });
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
            <Text style={styles.transactionLabel}>Group name</Text>
            <Text style={styles.transactionValue}>{groupName}</Text>
          </View>

          <View style={styles.transactionRow}>
            <Text style={styles.transactionLabel}>Contribution amount</Text>
            <Text style={styles.transactionValue}>{amount}</Text>
          </View>

          <View style={styles.transactionRow}>
            <Text style={styles.transactionLabel}>Payment method</Text>
            <Text style={styles.transactionValue}>Wallet</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.transactionRow}>
            <Text style={styles.transactionLabel}>Total amount</Text>
            <Text style={styles.transactionValue}>${parseFloat(amount.replace('$', '')).toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.goHomeButton} onPress={handleGoHome}>
          <Home width={20} height={20} color="#4D4845" />
          <Text style={styles.goHomeText}>Go home</Text>
        </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: '500',
    color: '#4D4845',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 14,
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
    marginBottom: 40,
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
    // height: 0,
    borderWidth: 1,
    borderColor: '#CACACA',
    borderStyle: 'dashed',
    marginBottom: 20,
    width: '100%',
  },
  goHomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: '#F6F6F4',
  },
  goHomeText: {
    fontSize: 16,
    color: '#4D4845',
    marginLeft: 8,
    fontWeight: '400',
  },
});
