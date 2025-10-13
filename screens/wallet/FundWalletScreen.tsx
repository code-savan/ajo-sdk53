import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { apiPost } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

export default function FundWalletScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { showToast } = useToast();
  const [amount, setAmount] = useState('$100');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numeric = amount.replace(/[^0-9.]/g, '');
  const cents = Math.round((parseFloat(numeric || '0')) * 100);
  const platformFeeBps = 300; // 3%
  const stripeFeeBps = Number(process.env.EXPO_PUBLIC_STRIPE_ESTIMATED_FEE_BPS || '0');
  const currency = 'USD';
  const grossCents = useMemo(() => {
    const totalBps = platformFeeBps + stripeFeeBps;
    return Math.ceil(cents * (1 + totalBps/10000));
  }, [cents, stripeFeeBps]);
  const grossFormatted = useMemo(() => (grossCents/100).toLocaleString('en-US',{style:'currency',currency:'USD'}), [grossCents]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleProceed = async () => {
    try {
      setSubmitting(true);
      setError(null);
      if (!cents || cents <= 0) {
        setError('Enter a valid amount');
        setSubmitting(false);
        return;
      }
      // Send gross to be charged; include net for display/reference
      navigation.navigate('CardPayment' as any, { amount_cents: grossCents, currency, net_amount_cents: cents } as any);
    } catch (e: any) {
      showToast({ message: 'Failed to start card payment. Please try again.', variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fund wallet</Text>
      </View>

        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Fund your wallet</Text>
            <Text style={styles.subtitle}>Get bank transfer instructions for your wallet top-up.</Text>
            {error ? <Text style={{ color: '#6B7280', marginTop: 8 }}>{error}</Text> : null}
        </View>

        <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Amount</Text>
          <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="$100" keyboardType="decimal-pad" defaultValue="$100" onChangeText={(t)=>setAmount(t.startsWith('$')?t:`$${t}`)} />
            </View>
            <Text style={styles.feeHint}>A 3% fee applies{stripeFeeBps>0?` (+ Stripe est. ${(stripeFeeBps/100).toFixed(2)}%)`:''}. You’ll transfer approximately {grossFormatted}.</Text>
          </View>

          <TouchableOpacity style={[styles.proceedButton, submitting && { opacity: 0.6 }]} onPress={handleProceed} disabled={submitting}>
            <Text style={styles.proceedButtonText}>{submitting ? 'Processing...' : 'Pay with card'}</Text>
          </TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { width: 24, height: 24 },
  headerTitle: { fontSize: 16, fontWeight: '400', color: '#000000' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  titleSection: { marginBottom: 40 },
  title: { fontSize: 16, fontWeight: '500', color: '#000000', marginBottom: 12 },
  subtitle: { fontSize: 12, color: '#928F8B', lineHeight: 24, fontWeight: '400' },
  inputSection: { marginBottom: 8 },
  inputLabel: { fontSize: 12, color: '#4D4845', marginBottom: 8, fontWeight: '400' },
  inputContainer: { backgroundColor: '#F2F2F2', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16, borderColor: '#DCDCDC', borderStyle: 'solid', borderWidth: 1 },
  input: { fontSize: 12, color: '#000000', fontWeight: '400' },
  feeHint: { fontSize: 12, color: '#2563EB', marginTop: 8 },
  proceedButton: { backgroundColor: '#000000', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  proceedButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '500' },
});
