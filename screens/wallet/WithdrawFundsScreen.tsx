import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { apiGet, apiPost } from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const formatCurrency = (cents: number): string => {
  const dollars = cents / 100;
  return dollars.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export default function WithdrawFundsScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [amount, setAmount] = useState('$100');
  const [loading, setLoading] = useState(true);
  const [availableCents, setAvailableCents] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // hydrate from cache first
        const [balCache, pendCache] = await Promise.all([
          AsyncStorage.getItem('wallet_balance_cache_v1'),
          AsyncStorage.getItem('wallet_pending_cache_v1')
        ]);
        let usedCache = false;
        if (balCache && pendCache) {
          try {
            const bc = JSON.parse(balCache);
            const pc = JSON.parse(pendCache);
            const available = Number(bc || 0) - Number(pc || 0);
            setAvailableCents(Math.max(0, available));
            usedCache = true;
          } catch {}
        }
        if (!usedCache) setLoading(true);
        // fetch fresh
        const balance = await apiGet('/api/wallet/balance').catch(()=>({ balanceCents: 0 }));
        const pending = await apiGet('/api/wallet/pending').catch(()=>({ pending_cents: 0 }));
        const available = Number(balance?.balanceCents || 0) - Number((pending as any)?.pending_cents || 0);
        setAvailableCents(Math.max(0, available));
        try {
          await AsyncStorage.setItem('wallet_balance_cache_v1', JSON.stringify(Number(balance?.balanceCents || 0)));
          await AsyncStorage.setItem('wallet_pending_cache_v1', JSON.stringify(Number((pending as any)?.pending_cents || 0)));
        } catch {}
      } catch {
        setError('Failed to load balance');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setAccountsLoading(true);
        const res = await apiGet('/api/wallet/bank-accounts').catch(()=>[]);
        const arr = Array.isArray(res) ? res : [];
        setAccounts(arr);
        setSelectedAccountId(arr[0]?.id || null);
      } finally { setAccountsLoading(false); }
    };
    const unsub = navigation.addListener('focus', loadAccounts);
    loadAccounts();
    return unsub;
  }, [navigation]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleProceed = async () => {
    const cents = Math.round(parseFloat(amount.replace('$', '')) * 100);
    if (cents <= 0) {
      Alert.alert('Invalid amount', 'Enter a valid amount.');
      return;
    }
    if (cents > availableCents) {
      Alert.alert('Insufficient funds', 'Amount exceeds your available credits.');
      return;
    }
    if (!selectedAccountId) {
      Alert.alert('No account', 'Please link a bank account first.');
      return;
    }
    try {
      setSubmitting(true);
      await apiPost(`/api/wallet/withdraw`, { amount_cents: cents, bank_account_id: selectedAccountId });
      Alert.alert('Requested', 'Withdrawal initiated.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', 'Withdrawal failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdraw funds</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Withdraw funds</Text>
          <Text style={styles.subtitle}>
            Easily transfer money from your wallet to your linked bank account.
          </Text>
          {loading ? <ActivityIndicator style={{ marginTop: 8 }} /> : null}
          <Text style={{ marginTop: 8, color: '#6B7280' }}>
            Available: ${formatCurrency(availableCents)}
          </Text>
          {error ? <Text style={{ marginTop: 8, color: '#ef4444' }}>{error}</Text> : null}
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Enter amount</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="$100"
              keyboardType="decimal-pad"
              defaultValue="$100"
              onChangeText={(t)=>setAmount(t.startsWith('$')?t:`$${t}`)}
            />
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Withdraw to</Text>
          {accountsLoading ? (
            <ActivityIndicator />
          ) : accounts.length === 0 ? (
            <View style={styles.inputContainer}>
              <Text style={[styles.paymentMethod, { marginBottom: 8 }]}>No linked accounts</Text>
              <TouchableOpacity onPress={()=>navigation.navigate('WalletAndPayment' as never)} style={styles.linkCta}>
                <Text style={styles.linkCtaText}>Manage linked account</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {accounts.map((a) => (
                <TouchableOpacity key={a.id} style={styles.accountRow} onPress={()=>setSelectedAccountId(a.id)}>
                  <View style={[styles.radio, selectedAccountId===a.id && styles.radioActive]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.accountTitle}>{a.bank_name}</Text>
                    <Text style={styles.accountSub}>{a.account_holder_name} • ••••{a.account_number_last4}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.proceedButton, submitting && { opacity: 0.6 }]} onPress={handleProceed} disabled={submitting || loading}>
            <Text style={styles.proceedButtonText}>{submitting ? 'Processing...' : 'Proceed'}</Text>
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
    fontWeight: '400',
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    color: '#4D4845',
    marginBottom: 8,
    fontWeight: '400',
  },
  inputContainer: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderColor: '#DCDCDC',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  input: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '400',
  },
  paymentMethod: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '400',
  },
  linkCta: { backgroundColor: '#111111', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  linkCtaText: { color: '#FFFFFF', fontSize: 14 },
  accountRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#fff' },
  radio: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: '#D1D5DB', marginRight: 12 },
  radioActive: { borderColor: '#111111', backgroundColor: '#111111' },
  accountTitle: { fontSize: 14, fontWeight: '500', color: '#1C1C1C' },
  accountSub: { fontSize: 12, color: '#6B7280' },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  proceedButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
