import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
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
        <Text style={styles.headerTitle}>Processing payment</Text>
      </View>

      <View style={styles.content}>
        {initializing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Preparing payment…</Text>
          </View>
        ) : (
          <>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 16, color: '#000' }}>Charge amount</Text>
              <Text style={{ fontSize: 24, fontWeight: '600', color: '#000' }}>{(gross_amount_cents/100).toLocaleString('en-US',{style:'currency',currency})}</Text>
              {net_amount_cents ? (
                <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 6 }}>
                  Includes 3% platform fee. Wallet credit: {(net_amount_cents/100).toLocaleString('en-US',{style:'currency',currency})}
                </Text>
              ) : null}
            </View>
            <TouchableOpacity style={[styles.payButton, isProcessing && { opacity: 0.6 }]} onPress={onPay} disabled={isProcessing}>
              <Text style={styles.payButtonText}>{isProcessing ? 'Processing…' : 'Pay now'}</Text>
            </TouchableOpacity>
          </>
        )}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#000000',
    marginTop: 16,
  },
  payButton: { backgroundColor: '#000000', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 24, alignItems: 'center', minWidth: 200 },
  payButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '500' },
});
