import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { apiGet } from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';

const allKeyFor = (uid?: string|null) => `wallet_all_txns_v1:${uid || 'anon'}`;

interface TxnItem {
  id: string;
  direction: 'credit' | 'debit';
  amount_cents: number;
  currency: string;
  source: 'deposit' | 'contribution' | 'rotation_earning' | 'withdrawal' | 'fee' | 'adjustment';
  occurred_at: string;
  external_ref?: string | null;
}

export default function TransactionsScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<TxnItem[]>([]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession().catch(()=>({ data: { session: null } as any }))
      const uid = data?.session?.user?.id || null
      const CACHE_KEY = allKeyFor(uid)

      let hadCache = false
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY)
        if (cached) {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTransactions(parsed)
            hadCache = true
          }
        }
      } catch {}
      setLoading(!hadCache)

      try {
        const latest = (hadCache && transactions.length>0) ? transactions[0].occurred_at : undefined
        const params = latest ? `?since=${encodeURIComponent(latest)}&limit=200` : `?limit=200`
        const fresh = await apiGet(`/api/me/transactions${params}`).catch(()=>([]))
        let merged: TxnItem[]
        if (Array.isArray(fresh) && fresh.length > 0) {
          const byId = new Map((transactions||[]).map(t=>[t.id,t]))
          for (const f of fresh) byId.set(f.id, f as TxnItem)
          merged = Array.from(byId.values()).sort((a,b)=> new Date(b.occurred_at).getTime()-new Date(a.occurred_at).getTime())
        } else {
          merged = transactions
        }
        setTransactions(merged)
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(merged)).catch(()=>{})
      } finally {
        setLoading(false)
      }
    };
    const unsub = navigation.addListener('focus', load);
    load();
    return unsub;
  }, [navigation]);

  const sections = useMemo(() => groupByMonth(transactions), [transactions]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction history</Text>
        {/* <View style={styles.headerSpacer} /> */}
      </View>

      <View style={styles.filtersRow}>
        <TouchableOpacity style={styles.filterPill}>
          <Text style={styles.filterText}>All dates</Text>
          <ChevronDown width={16} height={16} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterPill}>
          <Text style={styles.filterText}>All transactions</Text>
          <ChevronDown width={16} height={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {loading ? (
        renderSkeleton()
      ) : sections.length === 0 ? (
        <Text style={{ color: '#6B7280', paddingHorizontal: 20 }}>No transactions yet.</Text>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderTxnRow(item)}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          contentContainerStyle={styles.transactionsContentContainer}
        />
      )}
    </SafeAreaView>
  );
}

function mapTxnLabels(t: TxnItem): { title: string; subtitle: string; isPositive: boolean } {
  const isPositive = t.direction === 'credit';
  switch (t.source) {
    case 'deposit':
      return { title: 'Deposit', subtitle: 'Wallet', isPositive };
    case 'withdrawal':
      return { title: 'Withdrawal', subtitle: 'Wallet', isPositive };
    case 'rotation_earning':
      return { title: 'Pickup', subtitle: 'Contribution', isPositive };
    case 'contribution':
      return { title: 'Deposit', subtitle: 'Contribution', isPositive };
    case 'fee':
      return { title: 'Fee', subtitle: 'Platform', isPositive };
    default:
      return { title: 'Adjustment', subtitle: 'Wallet', isPositive };
  }
}

function formatRightTime(d: Date): string {
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  if (isToday) {
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  if (isYesterday) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function groupByMonth(items: TxnItem[]): { title: string; data: TxnItem[] }[] {
  const map = new Map<string, TxnItem[]>();
  for (const t of items) {
    const d = new Date(t.occurred_at);
    const key = `${d.toLocaleString('en-US', { month: 'short' })} ${d.getFullYear()}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  }
  return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
}

function renderTxnRow(item: TxnItem) {
  const { title, subtitle, isPositive } = mapTxnLabels(item);
  const amount = (Number(item.amount_cents)/100).toLocaleString('en-US',{ style: 'currency', currency: (item.currency||'USD').toUpperCase() });
  const dt = new Date(item.occurred_at);
  const rightTime = formatRightTime(dt);
  return (
    <View style={styles.transaction}>
      <View style={styles.transactionIconContainer}>
        {isPositive ? (
          <ChevronUp width={24} height={24} color="#4D4845" />
        ) : (
          <ChevronDown width={24} height={24} color="#4D4845" />
        )}
      </View>
      <View style={styles.leftCol}>
        <Text style={styles.transactionName}>{title}</Text>
        <Text style={styles.transactionType}>{subtitle}</Text>
      </View>
      <View style={styles.rightCol}>
        <Text style={[styles.transactionAmount, isPositive ? styles.positive : styles.negative]}>{amount}</Text>
        <Text style={styles.rightTime}>{rightTime}</Text>
      </View>
    </View>
  );
}

function renderSkeleton() {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      {[...Array(8)].map((_, idx) => (
        <View key={idx} style={styles.transaction}>
          <View style={styles.leftCol}>
            <View style={{ width: 120, height: 14, backgroundColor: '#E5E7EB', borderRadius: 6, marginBottom: 8 }} />
            <View style={{ width: 100, height: 12, backgroundColor: '#E5E7EB', borderRadius: 6 }} />
          </View>
          <View style={styles.rightCol}>
            <View style={{ width: 72, height: 14, backgroundColor: '#E5E7EB', borderRadius: 6, marginBottom: 6 }} />
            <View style={{ width: 80, height: 12, backgroundColor: '#E5E7EB', borderRadius: 6 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { width: 24, height: 24 },
  headerTitle: { fontSize: 16, fontWeight: '400', color: '#000000' },
  headerSpacer: { width: 24 },

  filtersRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 15 },
  filterPill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  filterText: { color: '#4B5563', fontSize: 14 },

  transactionsContentContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  sectionHeader: { fontSize: 14, fontWeight: '400', color: '#111827', marginTop: 16, marginBottom: 8 },

  transaction: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  transactionIconContainer: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#ffffff', borderStyle: 'solid', borderWidth: 1, borderColor: '#F4F4F2', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  leftCol: { flex: 1 },
  rightCol: { alignItems: 'flex-end' },
  transactionName: { fontSize: 14, fontWeight: '500', color: '#4D4845', marginBottom: 4 },
  transactionType: { fontSize: 12, color: '#928F8B' },
  transactionAmount: { fontSize: 14, fontWeight: '500' },
  rightTime: { fontSize: 12, color: '#928F8B' },
  positive: { color: '#04A73E' },
  negative: { color: '#FF6262' },
});
