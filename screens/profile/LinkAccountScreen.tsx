import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ChevronLeft } from 'lucide-react-native';
import { apiGet, apiPost } from '../../lib/api';

export default function LinkAccountScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [bankName, setBankName] = useState('');
  const [holderName, setHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await apiGet('/api/wallet/bank-accounts').catch(()=>[]);
        setAccounts(Array.isArray(res) ? res : []);
      } finally { setLoading(false); }
    };
    const unsub = navigation.addListener('focus', load);
    load();
    return unsub;
  }, [navigation]);

  const handleAdd = async () => {
    if (!bankName || !holderName || !accountNumber) return;
    try {
      setSaving(true);
      await apiPost('/api/wallet/bank-accounts', {
        bank_name: bankName,
        account_holder_name: holderName,
        account_number: accountNumber,
        routing_number: routingNumber,
      });
      setModalVisible(false);
      setBankName(''); setHolderName(''); setAccountNumber(''); setRoutingNumber('');
      const res = await apiGet('/api/wallet/bank-accounts').catch(()=>[]);
      setAccounts(Array.isArray(res) ? res : []);
    } finally { setSaving(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <ChevronLeft width={24} height={24} color="#4D4845" />
            <Text style={styles.title}>Linked accounts</Text>
            </TouchableOpacity>
            <Text style={styles.subtitle}>Securely connect yout bank or wallet to get started</Text>
          </View>

          {loading ? <ActivityIndicator /> : accounts.length === 0 ? (
            <Text style={{ color: '#6B7280' }}>No linked accounts yet.</Text>
          ) : (
            <View style={{ gap: 12 }}>
              {accounts.map((a) => (
                <View key={a.id} style={styles.card}>
                  <View>
                    <Text style={styles.cardTitle}>{a.bank_name}</Text>
                    <Text style={styles.cardSubtitle}>{a.account_holder_name} • ••••{a.account_number_last4}</Text>
                  </View>
                  <Text style={{ color: '#4D4845' }}>{a.status === 'active' ? 'Active' : 'Inactive'}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={[styles.addBtn, saving && { opacity: 0.6 }]} onPress={() => setModalVisible(true)} disabled={saving}>
            <Text style={styles.addBtnText}>Add another account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={()=>setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
            <View style={styles.modalSheet}>
              <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 12 }}>
                <Text style={styles.modalTitle}>Add bank account</Text>
                <View style={styles.field}><Text style={styles.label}>Bank name</Text><TextInput style={styles.input} value={bankName} onChangeText={setBankName} returnKeyType="next" placeholder="e.g. Chase Bank" placeholderTextColor="#9CA3AF" /></View>
                <View style={styles.field}><Text style={styles.label}>Account holder</Text><TextInput style={styles.input} value={holderName} onChangeText={setHolderName} returnKeyType="next" placeholder="e.g. Eric Johnson" placeholderTextColor="#9CA3AF" /></View>
                <View style={styles.field}><Text style={styles.label}>Account number</Text><TextInput style={styles.input} value={accountNumber} onChangeText={(t)=>setAccountNumber(t.replace(/[^0-9]/g,'').slice(0,17))} keyboardType="number-pad" returnKeyType="next" placeholder="123456789012" placeholderTextColor="#9CA3AF" maxLength={17} /></View>
                <View style={styles.field}><Text style={styles.label}>Routing number (optional)</Text><TextInput style={styles.input} value={routingNumber} onChangeText={(t)=>setRoutingNumber(t.replace(/[^0-9]/g,'').slice(0,9))} keyboardType="number-pad" returnKeyType="done" placeholder="123456789" placeholderTextColor="#9CA3AF" maxLength={9} /></View>
                <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleAdd} disabled={saving}>
                  <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save account'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={()=>setModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollView: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 80, backgroundColor: '#ffffff' },
  header: { flexDirection: 'column', alignItems: 'flex-start', marginBottom: 24 },
  backButton: { padding: 4, flexDirection: 'row', alignItems: 'center', },
  title: { fontSize: 16, fontWeight: '500', color: '#4D4845', textAlign: 'center' },
  subtitle: { fontSize: 12, color: '#928F8B', lineHeight: 24, fontWeight: '400', marginLeft: 28 },
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#fff' },
  cardTitle: { fontSize: 14, fontWeight: '500', color: '#1C1C1C' },
  cardSubtitle: { fontSize: 12, color: '#6B7280' },
  addBtn: { marginTop: 16, backgroundColor: '#111111', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  addBtnText: { color: '#fff', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: '500', color: '#1C1C1C', marginBottom: 16 },
  field: { marginBottom: 10 },
  label: { fontSize: 12, color: '#4D4845', marginBottom: 8 },
  input: { backgroundColor: '#F2F2F2', borderWidth: 1, borderColor: '#DCDCDC', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, color: '#1C1C1C', marginBottom: 8 },
  saveBtn: { marginTop: 6, backgroundColor: '#000', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { color: '#fff' },
  cancelBtn: { marginTop: 8, alignItems: 'center' },
  cancelBtnText: { color: '#4D4845' },
});
