import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { apiGet, apiPost } from '../../lib/api';

export default function WithdrawFundsScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [amount, setAmount] = useState('$100');
  const [loading, setLoading] = useState(true);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [availableCents, setAvailableCents] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // pick first group the user belongs to (MVP)
        const groups = await apiGet<any[]>('/api/groups');
        const g = groups?.[0];
        if (g) {
          setGroupId(g.id);
          const bal = await apiGet(`/api/groups/${g.id}/balance`);
          // in MVP, get current user's id net from perUserNetCents
          const me = await apiGet('/api/users/profile');
          const net = bal?.perUserNetCents?.[me?.id] || 0;
          setAvailableCents(net);
        } else {
          setGroupId(null);
          setAvailableCents(0);
        }
      } catch {
        setError('Failed to load balance');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleProceed = async () => {
    if (!groupId) {
      Alert.alert('No group', 'Join or create a group first.');
      return;
    }
    const cents = Math.round(parseFloat(amount.replace('$', '')) * 100);
    if (cents <= 0) {
      Alert.alert('Invalid amount', 'Enter a valid amount.');
      return;
    }
    if (cents > availableCents) {
      Alert.alert('Insufficient funds', 'Amount exceeds your available credits.');
      return;
    }
    try {
      setSubmitting(true);
      await apiPost(`/api/groups/${groupId}/withdraw`, { amount_cents: cents });
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
          {groupId ? (
            <Text style={{ marginTop: 8, color: '#6B7280' }}>
              Available: ${(availableCents/100).toFixed(2)}
            </Text>
          ) : (
            <Text style={{ marginTop: 8, color: '#ef4444' }}>No group found.</Text>
          )}
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
          <View style={styles.inputContainer}>
            <Text style={styles.paymentMethod}>Bank Transfer</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.proceedButton, submitting && { opacity: 0.6 }]} onPress={handleProceed} disabled={submitting || loading || !groupId}>
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
