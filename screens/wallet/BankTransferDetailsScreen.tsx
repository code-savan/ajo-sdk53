import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Copy, CheckCircle } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { apiPost } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

type RouteP = RouteProp<RootStackParamList, 'BankTransferDetails'>;

type FundingInstructions = {
  bank_transfer?: {
    country?: string;
    financial_addresses?: Array<any>;
    reference?: string;
    expires_at?: number; // epoch seconds if provided
  };
};

export default function BankTransferDetailsScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteP>();
  const { showToast } = useToast();
  const params = route.params;
  const instructions = (params?.instructions as FundingInstructions) || undefined;
  const paymentIntentId = params?.payment_intent_id as string | undefined;
  const currency = (params?.currency || 'usd').toUpperCase();
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<string | null>(null);

  const accountNumber = extractAccountNumber(instructions) || '—';
  const bankName = extractBankName(instructions) || '—';
  const extractedAccountName = extractAccountHolderName(instructions) || '—';
  const brandedName = process.env.EXPO_PUBLIC_BRAND_ACCOUNT_NAME || 'Ajo Pay';
  const accountName = brandedName || extractedAccountName;
  const amountCents = params?.amount_cents || 0; // this is transfer_amount_cents (gross)
  const amountFormatted = useMemo(() => (amountCents/100).toLocaleString('en-US',{style:'currency',currency:'USD'}), [amountCents]);

  useEffect(() => {
    const expiresAt = (instructions as any)?.bank_transfer?.expires_at as number | undefined;
    if (!expiresAt) return;
    const tick = () => {
      const now = Math.floor(Date.now()/1000);
      const remain = Math.max(0, expiresAt - now);
      const h = Math.floor(remain/3600);
      const m = Math.floor((remain%3600)/60);
      const s = remain%60;
      setCountdown(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [instructions]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCopyAccountNumber = async () => {
    if (!accountNumber || accountNumber === '—') return;
    await Clipboard.setStringAsync(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    if (!paymentIntentId) {
      navigation.navigate('WalletFunded', { payment_intent_id: undefined, amount_cents: amountCents, currency });
      return;
    }
    try {
      await apiPost('/api/wallet/test/fund', { payment_intent_id: paymentIntentId });
      navigation.navigate('WalletFunded', { payment_intent_id: paymentIntentId, amount_cents: amountCents, currency });
    } catch (e) {
      showToast({ message: 'We could not confirm yet. We’ll update once it clears.', variant: 'info' });
      navigation.navigate('WalletFunded', { payment_intent_id: paymentIntentId, amount_cents: amountCents, currency });
    }
  };

  const hasDetails = Boolean(instructions);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank transfer details</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Bank transfer details</Text>
          <Text style={styles.subtitle}>Add money to your wallet to start secure payments and contributions.</Text>
        </View>

        {hasDetails ? (
          <View style={styles.bankInfoContainer}>
            <Text style={styles.sectionTitle}>Bank Info</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Bank name</Text>
              <Text style={styles.infoValue}>{bankName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Account name</Text>
              <Text style={styles.infoValue}>{accountName}</Text>
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
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Amount to transfer</Text>
              <Text style={styles.infoValue}>{amountFormatted}</Text>
            </View>
            {(instructions as any)?.bank_transfer?.reference ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Reference</Text>
                <Text style={styles.infoValue}>{(instructions as any)?.bank_transfer?.reference}</Text>
              </View>
            ) : null}
            {countdown ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Expires in</Text>
                <Text style={styles.infoValue}>{countdown}</Text>
              </View>
            ) : null}
          </View>
        ) : (
          <Text style={{ color: '#6B7280' }}>No funding details yet. Go back and start a funding request.</Text>
        )}

        <View style={styles.transferInfoContainer}>
          <Text style={styles.transferInfoTitle}>Transfer info</Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Make sure you transfer the exact amount and nothing more.</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>If you have transferred, you can click on "confirm payment" to proceed.</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
            <Text style={styles.confirmButtonText}>Confirm Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function extractAccountNumber(instr?: FundingInstructions): string | null {
  const fa = (instr as any)?.bank_transfer?.financial_addresses?.[0]
  if (!fa) return null
  if (typeof fa.account_number === 'string') return fa.account_number
  if (fa.iban && typeof fa.iban === 'string') return fa.iban
  if (fa.iban && typeof fa.iban.iban === 'string') return fa.iban.iban
  if (fa.aba && typeof fa.aba.account_number === 'string') return fa.aba.account_number
  if (fa.sort_code && typeof fa.sort_code.account_number === 'string') return fa.sort_code.account_number
  return null
}

function extractBankName(instr?: FundingInstructions): string | null {
  const fa = (instr as any)?.bank_transfer?.financial_addresses?.[0]
  if (!fa) return null
  if (typeof fa.bank_name === 'string') return fa.bank_name
  if (typeof fa.financial_institution === 'string') return fa.financial_institution
  if (fa.aba && typeof fa.aba.bank_name === 'string') return fa.aba.bank_name
  if (fa.sort_code && typeof fa.sort_code.bank_name === 'string') return fa.sort_code.bank_name
  if (fa.iban && typeof fa.iban.bank_name === 'string') return fa.iban.bank_name
  return null
}

function extractAccountHolderName(instr?: FundingInstructions): string | null {
  const fa = (instr as any)?.bank_transfer?.financial_addresses?.[0]
  if (!fa) return null
  if (typeof fa.account_holder_name === 'string') return fa.account_holder_name
  if (fa.aba && typeof fa.aba.account_holder_name === 'string') return fa.aba.account_holder_name
  if (fa.sort_code && typeof fa.sort_code.account_holder_name === 'string') return fa.sort_code.account_holder_name
  if (fa.iban && typeof fa.iban.account_holder_name === 'string') return fa.iban.account_holder_name
  return null
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
    paddingTop: 16,
    paddingBottom: 8,
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
    marginBottom: 20,
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
