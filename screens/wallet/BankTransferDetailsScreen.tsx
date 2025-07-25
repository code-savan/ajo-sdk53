import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Copy, CheckCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

export default function BankTransferDetailsScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [copied, setCopied] = useState(false);

  const accountNumber = "2123797362";

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCopyAccountNumber = async () => {
    await Clipboard.setStringAsync(accountNumber);
    setCopied(true);

    // Reset after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleConfirmPayment = () => {
    // Navigate to wallet funded confirmation screen
    navigation.navigate('WalletFunded');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank transfer details</Text>
        {/* <View style={styles.headerSpacer} /> */}
      </View>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Bank transfer details</Text>
          <Text style={styles.subtitle}>
            Add money to your wallet to start secure payments and contributions.
          </Text>
        </View>

        <View style={styles.bankInfoContainer}>
          <Text style={styles.sectionTitle}>Bank Info</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bank name</Text>
            <Text style={styles.infoValue}>Monument bank</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account name</Text>
            <Text style={styles.infoValue}>PUB Delivery</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account number</Text>
            <View style={styles.accountNumberContainer}>
              <Text style={styles.infoValue}>{accountNumber}</Text>
              <TouchableOpacity onPress={handleCopyAccountNumber}>
                {copied ? (
                  <CheckCircle width={16} height={16} color="#000000" />
                ) : (
                  <Copy width={16} height={16} color="#000000" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.transferInfoContainer}>
          <Text style={styles.transferInfoTitle}>Transfer info</Text>

          <View style={styles.bulletPoint}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              Make sure you transfer the exact amount and nothing more.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              If you have transferred, you can click on "confirm payment" to proceed.
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmPayment}
          >
            <Text style={styles.confirmButtonText}>Confirm Payment</Text>
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
//   headerSpacer: {
//     width: 24,
//   },
  headerTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 12,
    color: '#928F8B',
    lineHeight: 24,
    paddingRight: 20,
    fontWeight: '400'
  },
  bankInfoContainer: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: '#ABABAB',
    marginBottom: 4,
    fontWeight: "400",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '400',
    color: '#3B3B3B',
    marginRight: 2
  },
  accountNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 2
  },
  transferInfoContainer: {
    backgroundColor: '#FFE9E9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  transferInfoTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 16,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingRight: 10,
  },
  bulletDot: {
    fontSize: 16,
    marginRight: 8,
    color: '#000000',
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    lineHeight: 22,
    fontWeight: "400"
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  confirmButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
