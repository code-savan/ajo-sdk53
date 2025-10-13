import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { apiGet } from '../../lib/api';

export default function WalletFundedScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'WalletFunded'>>();
  const { payment_intent_id, amount_cents, currency } = route.params || {};
  const [isConfirming, setIsConfirming] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [tx, setTx] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      if (!payment_intent_id) {
        // No id to poll with; consider it confirmed after brief delay
        setTimeout(() => !cancelled && setIsConfirming(false), 1500);
        return;
      }
      // Poll up to ~10s for the ledger entry
      const started = Date.now();
      while (!cancelled && Date.now() - started < 10000) {
        try {
          const found = await apiGet(`/api/me/transactions/find?external_ref=${encodeURIComponent(payment_intent_id)}&source=deposit`);
          if (found && found.id) {
            if (!cancelled) {
              setTx(found);
              setConfirmed(true);
              break;
            }
          }
        } catch {}
        await new Promise(r => setTimeout(r, 1000));
      }
      if (!cancelled) setIsConfirming(false);
    };

    poll();
    return () => { cancelled = true };
  }, [payment_intent_id]);

  const handleGoBack = () => {
    navigation.dispatch(CommonActions.navigate('MainTabs', { screen: 'Wallet' } as any));
  };

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

  const displayAmount = ((tx?.amount_cents ?? amount_cents) || 0) / 100;
  const displayCurrency = (tx?.currency || currency || 'USD').toUpperCase();
  const feeCents = typeof tx?.fee_cents === 'number' ? Number(tx?.fee_cents) : null;

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
            Payment successful! Your deposit has been added to your wallet.
          </Text>
        </View>

        <View style={styles.transactionDetailsCard}>
          <View style={styles.transactionRow}>
            <Text style={styles.transactionLabel}>Transaction type</Text>
            <Text style={styles.transactionValue}>Deposit</Text>
          </View>

          <View style={styles.transactionRow}>
            <Text style={styles.transactionLabel}>Amount</Text>
            <Text style={styles.transactionValue}>
              {displayAmount.toLocaleString('en-US',{ style:'currency', currency: displayCurrency })}
            </Text>
          </View>

          {typeof feeCents === 'number' ? (
            <View style={styles.transactionRow}>
              <Text style={styles.transactionLabel}>Fee</Text>
              <Text style={styles.transactionValue}>
                {(feeCents/100).toLocaleString('en-US',{ style:'currency', currency: displayCurrency })}
              </Text>
            </View>
          ) : null}

          <View style={styles.transactionRow}>
            <Text style={styles.transactionLabel}>Payment method</Text>
            <Text style={styles.transactionValue}>Card</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.transactionRow}>
            <Text style={styles.transactionLabel}>Reference</Text>
            <Text style={styles.transactionValue}>{payment_intent_id || '—'}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  loadingContainer: { flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' },
  loadingContent: { alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#4D4845', fontWeight: '500' },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { width: 24, height: 24 },
  content: { flex: 1, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  successSection: { alignItems: 'center', marginBottom: 40, paddingHorizontal: 20 },
  approved: { width: 80, height: 80, borderRadius: 999, marginBottom: 15 },
  successTitle: { fontSize: 24, fontWeight: '600', color: '#000000', marginBottom: 16 },
  successMessage: { fontSize: 16, color: '#6C6C6C', textAlign: 'center', lineHeight: 24, marginBottom: 20, fontWeight: '400' },
  transactionDetailsCard: { backgroundColor: '#F2F2F2', borderRadius: 12, padding: 20, width: '100%' },
  transactionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  transactionLabel: { fontSize: 12, color: '#9A9AA', },
  transactionValue: { fontSize: 12, fontWeight: '500', color: '#4D4845', textAlign: 'right' },
  divider: { height: 0, borderBottomWidth: 1, borderBottomColor: '#E5E5E5', borderStyle: 'dashed', marginBottom: 20, width: '100%' },
});
