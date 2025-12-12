import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check, X, Clock, Calendar, CreditCard, Hash, TrendingUp, TrendingDown } from 'lucide-react-native';
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
  const feeCents = typeof txn.fee_cents === 'number' ? Number(txn.fee_cents) : (txn.source === 'deposit' ? Math.round(amountNumber * 0.03) : 0);
  const feeAmount = (feeCents/100).toLocaleString('en-US',{ style:'currency', currency: feeCurrency });
  const totalCharged = ((amountNumber + feeCents)/100).toLocaleString('en-US',{ style:'currency', currency });
  const paymentMethod = txn.payment_method || 'Card';
  const readableDate = txn.occurred_at ? new Date(txn.occurred_at).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—';
  const isDeposit = txn.source === 'deposit';
  const isWithdrawal = txn.source === 'withdrawal';
  const isCredit = txn.direction === 'credit';

  const getStatusIcon = () => {
    if (txn.status === 'completed' || txn.status === 'succeeded') {
      return <Check size={32} color="#10B981" strokeWidth={3} />;
    }
    if (txn.status === 'failed' || txn.status === 'cancelled') {
      return <X size={32} color="#EF4444" strokeWidth={3} />;
    }
    return <Clock size={32} color="#F59E0B" strokeWidth={2.5} />;
  };

  const getStatusBgColor = () => {
    if (txn.status === 'completed' || txn.status === 'succeeded') return '#D1FAE5';
    if (txn.status === 'failed' || txn.status === 'cancelled') return '#FEE2E2';
    return '#FEF3C7';
  };

  const getStatusText = () => {
    if (txn.status === 'completed' || txn.status === 'succeeded' || txn.status === 'success' || txn.status === 'paid' || txn.status === 'approved') return 'Completed';
    if (txn.status === 'failed') return 'Failed';
    if (txn.status === 'cancelled') return 'Cancelled';
    if (txn.status === 'pending') return 'Pending';
    return 'Completed';
  };

  const getStatusColor = () => {
    if (txn.status === 'completed' || txn.status === 'succeeded' || txn.status === 'success' || txn.status === 'paid' || txn.status === 'approved' || !txn.status) return '#10B981';
    if (txn.status === 'failed' || txn.status === 'cancelled') return '#EF4444';
    if (txn.status === 'pending') return '#F59E0B';
    return '#10B981';
  };

  const getTransactionTitle = () => {
    if (isDeposit) return 'Wallet Deposit';
    if (isWithdrawal) return 'Withdrawal';
    if (txn.source === 'contribution') return 'Group Contribution';
    if (txn.source === 'rotation_earning') return 'Rotation Payout';
    return txn.source || 'Transaction';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Transaction Details</Text>

        </View>
        {/* <View style={styles.headerRight} /> */}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Amount Card */}
          <View style={styles.amountCard}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
            <View style={styles.amountHeader}>
              {isCredit ? (
                <TrendingUp size={24} color="#10B981" strokeWidth={2.5} />
              ) : (
                <TrendingDown size={24} color="#EF4444" strokeWidth={2.5} />
              )}
              <Text style={styles.amountLabel}>{getTransactionTitle()}</Text>
            </View>
            <Text style={[styles.amount, { color: isCredit ? '#10B981' : '#EF4444' }]}>
              {isCredit ? '+' : ''}{amount}
            </Text>

            {/* Fee Breakdown for Deposits */}
            {isDeposit && feeCents > 0 && (
              <View style={styles.feeBreakdown}>
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Wallet credit</Text>
                  <Text style={styles.feeValue}>{amount}</Text>
                </View>
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Processing fee (3%)</Text>
                  <Text style={styles.feeValue}>{feeAmount}</Text>
                </View>
                <View style={[styles.feeRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total charged</Text>
                  <Text style={styles.totalValue}>{totalCharged}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Transaction Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Details</Text>

            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Calendar size={20} color="#6B7280" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>{readableDate}</Text>
              </View>
            </View>

            {txn.external_ref && (
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Hash size={20} color="#6B7280" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Reference ID</Text>
                  <Text style={[styles.detailValue, styles.refText]} numberOfLines={1}>
                    {txn.external_ref}
                  </Text>
                </View>
              </View>
            )}

            {(isDeposit || isWithdrawal) && (
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <CreditCard size={20} color="#6B7280" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Payment Method</Text>
                  <Text style={styles.detailValue}>{paymentMethod}</Text>
                </View>
              </View>
            )}

            {!isDeposit && feeCents > 0 && (
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <TrendingUp size={20} color="#6B7280" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Fee</Text>
                  <Text style={styles.detailValue}>{feeAmount}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    // flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 12
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 48,
  },
  amountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  amountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  feeBreakdown: {
    width: '100%',
    paddingTop: 20,
    marginTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#F3F4F6',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  feeLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
  },
  feeValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
    fontWeight: '400',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  refText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#6B7280',
  },
});
