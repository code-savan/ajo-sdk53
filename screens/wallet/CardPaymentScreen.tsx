import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard, Lock, Shield, Check } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { apiPost } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

type RouteP = RouteProp<RootStackParamList, 'CardPayment'>;

export default function CardPaymentScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteP>();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  // amount_cents passed here represents the gross to charge; net_amount_cents is optional for display
  const gross_amount_cents = (route.params as any)?.amount_cents || 0;
  const net_amount_cents = (route.params as any)?.net_amount_cents || 0;
  const currency = ((route.params as any)?.currency || 'USD').toUpperCase();

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const setup = async () => {
      try {
        setInitializing(true);
        if (!gross_amount_cents || gross_amount_cents <= 0) {
          showToast({ message: 'Invalid amount', variant: 'error' });
          navigation.goBack();
          return;
        }
        // Send net amount to backend; it will gross-up as needed (backend already handles this)
        const data = await apiPost('/api/wallet/payment-sheet', { amount_cents: net_amount_cents || gross_amount_cents });
        setPaymentIntentId(data.paymentIntentId);
        const init = await initPaymentSheet({
          merchantDisplayName: 'Ajo Pay',
          customerId: data.customerId,
          customerEphemeralKeySecret: data.ephemeralKeySecret,
          paymentIntentClientSecret: data.paymentIntentClientSecret,
          allowsDelayedPaymentMethods: false,
          returnURL: 'ajo://stripe-redirect',
          defaultBillingDetails: { name: '' }
        });
        if (init.error) {
          showToast({ message: init.error.message || 'Failed to initialize payment', variant: 'error' });
          navigation.goBack();
          return;
        }
        setInitializing(false);
      } catch (e: any) {
        showToast({ message: 'Could not start payment. Please try again.', variant: 'error' });
        navigation.goBack();
      }
    };
    setup();
  }, [gross_amount_cents, net_amount_cents]);

  const onPay = async () => {
    try {
      setIsProcessing(true);
      const res = await presentPaymentSheet();
      if (res.error) {
        setIsProcessing(false);
        showToast({ message: res.error.message || 'Payment cancelled', variant: 'info' });
        return;
      }
      // On success, verify and navigate
      const id = paymentIntentId;
      if (id) {
        try {
          await apiPost('/api/wallet/confirm', { payment_intent_id: id });
        } catch {}
        navigation.navigate('WalletFunded', { payment_intent_id: id, amount_cents: net_amount_cents || gross_amount_cents, currency });
        return;
      }
      navigation.navigate('WalletFunded', { amount_cents: net_amount_cents || gross_amount_cents, currency });
      // Adjust: Store the PI id from initial creation call in a ref.
    } catch (e: any) {
      setIsProcessing(false);
      showToast({ message: 'Payment failed. Please try again.', variant: 'error' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Secure Payment</Text>
        {/* <View style={styles.headerRight} /> */}
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {initializing ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingIconContainer}>
              <ActivityIndicator size="large" color="#3358FF" />
            </View>
            <Text style={styles.loadingText}>Preparing secure payment...</Text>
            <Text style={styles.loadingSubtext}>This will only take a moment</Text>
          </View>
        ) : (
          <>
            {/* Card Visual */}
            <View style={styles.cardVisual}>
              <View style={styles.cardIconContainer}>
                <CreditCard size={48} color="#3358FF" strokeWidth={1.5} />
              </View>
            </View>

            {/* Amount Section */}
            <View style={styles.amountSection}>
              <Text style={styles.amountLabel}>Total Amount</Text>
              <Text style={styles.amountValue}>
                {(gross_amount_cents/100).toLocaleString('en-US',{style:'currency',currency})}
              </Text>
              {net_amount_cents && net_amount_cents !== gross_amount_cents ? (
                <View style={styles.feeBreakdown}>
                  <View style={styles.feeRow}>
                    <Text style={styles.feeLabel}>Wallet credit</Text>
                    <Text style={styles.feeValue}>
                      {(net_amount_cents/100).toLocaleString('en-US',{style:'currency',currency})}
                    </Text>
                  </View>
                  <View style={styles.feeRow}>
                    <Text style={styles.feeLabel}>Processing fee (3%)</Text>
                    <Text style={styles.feeValue}>
                      {((gross_amount_cents - net_amount_cents)/100).toLocaleString('en-US',{style:'currency',currency})}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>

            {/* Security Features */}
            {/* <View style={styles.securitySection}>
              <View style={styles.securityItem}>
                <View style={styles.securityIconContainer}>
                  <Lock size={16} color="#10B981" />
                </View>
                <Text style={styles.securityText}>256-bit encryption</Text>
              </View>
              <View style={styles.securityItem}>
                <View style={styles.securityIconContainer}>
                  <Shield size={16} color="#10B981" />
                </View>
                <Text style={styles.securityText}>PCI DSS compliant</Text>
              </View>
              <View style={styles.securityItem}>
                <View style={styles.securityIconContainer}>
                  <Check size={16} color="#10B981" />
                </View>
                <Text style={styles.securityText}>Secure payment</Text>
              </View>
            </View> */}

            {/* Payment Button */}
            <TouchableOpacity
              style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
              onPress={onPay}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.payButtonText}>Processing...</Text>
                </>
              ) : (
                <>
                  <Lock size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.payButtonText}>Pay Securely</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Powered by Stripe */}
            <View style={styles.poweredByContainer}>
              <Text style={styles.poweredByText}>Secured by</Text>
              <Text style={styles.stripeText}>Stripe</Text>
            </View>
          </>
        )}
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
    // backgroundColor: '#FFFFFF',
    // borderBottomWidth: 1,
    // borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardVisual: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  cardIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  amountValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  feeBreakdown: {
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feeLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  feeValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
  securitySection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  securityIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  securityText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '500',
  },
  payButton: {
    backgroundColor: '#3358FF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#3358FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  poweredByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  poweredByText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginRight: 4,
  },
  stripeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366F1',
    letterSpacing: 0.5,
  },
});
