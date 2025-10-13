import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type RouteP = RouteProp<RootStackParamList, 'TransactionDetail'>;

export default function TransactionDetailScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteP>();
  const txn: any = (route.params as any)?.txn || {};

  const handleGoBack = () => {
    navigation.goBack();
  };

  const amountNumber = Number(txn.amount_cents) || 0;
  const currency = (txn.currency || 'USD').toUpperCase();
  const amount = (amountNumber/100).toLocaleString('en-US',{ style: 'currency', currency });
  const feeCurrency = (txn.fee_currency || txn.currency || 'USD').toUpperCase();
  const feeCents = typeof txn.fee_cents === 'number' ? Number(txn.fee_cents) : Math.round(amountNumber * 0.03);
  const feeAmount = (feeCents/100).toLocaleString('en-US',{ style:'currency', currency: feeCurrency });
  const paymentMethod = txn.payment_method || 'Card';
  const readableDate = txn.occurred_at ? new Date(txn.occurred_at).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.amount}>{amount}</Text>
        <View style={styles.row}><Text style={styles.label}>Type</Text><Text style={styles.value}>{txn.source === 'deposit' ? 'Deposit' : txn.source === 'withdrawal' ? 'Withdrawal' : txn.source}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Direction</Text><Text style={styles.value}>{txn.direction}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Date</Text><Text style={styles.value}>{readableDate}</Text></View>
        {txn.external_ref ? <View style={styles.row}><Text style={styles.label}>Reference</Text><Text style={styles.value}>{txn.external_ref}</Text></View> : null}
        <View style={styles.row}><Text style={styles.label}>Fee</Text><Text style={styles.value}>{feeAmount}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Payment method</Text><Text style={styles.value}>{paymentMethod}</Text></View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { width: 24, height: 24 },
  headerTitle: { fontSize: 16, fontWeight: '400', color: '#000000' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  amount: { fontSize: 28, fontWeight: '600', color: '#000000', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  label: { fontSize: 12, color: '#6B7280' },
  value: { fontSize: 14, color: '#111827' },
});
