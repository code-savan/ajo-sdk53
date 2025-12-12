import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import BottomNavigation from '../../components/BottomNavigation';
import { Bell, Settings, ChevronDown, ChevronUp } from 'lucide-react-native';
import NotificationBell from '../../components/NotificationBell';
import { apiGet, apiPost } from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';

const recentKeyFor = (uid?: string|null) => `wallet_recent_txns_v1:${uid || 'anon'}`;

export default function WalletScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [balanceCents, setBalanceCents] = useState(0);
  const [pendingCents, setPendingCents] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unread, setUnread] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession().catch(()=>({ data: { session: null } as any }))
      const uid = data?.session?.user?.id || null
      const CACHE_KEY = recentKeyFor(uid)

      // Hydrate cached txns immediately; only show skeleton if no cache
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
      setTransactionsLoading(!hadCache)

      try {
        // Hydrate balance/pending from cache immediately to avoid showing 0
        try {
          const [balCache, pendCache] = await Promise.all([
            AsyncStorage.getItem('wallet_balance_cache_v1'),
            AsyncStorage.getItem('wallet_pending_cache_v1')
          ])
          if (balCache) {
            try { setBalanceCents(Number(JSON.parse(balCache)||0)); } catch { setBalanceCents(Number(balCache)||0); }
          }
          if (pendCache) {
            try { setPendingCents(Number(JSON.parse(pendCache)||0)); } catch { setPendingCents(Number(pendCache)||0); }
          }
        } catch {}
        // Always refresh balance/pending
        const [balance, pending] = await Promise.all([
          apiGet('/api/wallet/balance').catch(()=>({ balanceCents: 0 })),
          apiGet('/api/wallet/pending').catch(()=>({ pending_cents: 0 })),
        ]);
        setBalanceCents(Number(balance?.balanceCents || 0));
        setPendingCents(Number((pending as any)?.pending_cents || 0));
        try {
          await AsyncStorage.setItem('wallet_balance_cache_v1', JSON.stringify(Number(balance?.balanceCents || 0)));
          await AsyncStorage.setItem('wallet_pending_cache_v1', JSON.stringify(Number((pending as any)?.pending_cents || 0)));
        } catch {}

        // Unread notifications (hydrate from cache first)
        try {
          const cachedUnread = await AsyncStorage.getItem('main_unread_cache_v1');
          if (cachedUnread) {
            try { setUnread(Number(JSON.parse(cachedUnread) || 0)); } catch { setUnread(Number(cachedUnread)||0); }
          }
        } catch {}
        try {
          const notif = await apiGet('/api/notifications?page=1&limit=1&unread_only=true').catch(()=>({ data: { total: 0 } }));
          const totalUnread = (notif?.data?.total ?? notif?.total ?? 0) as number;
          setUnread(Number(totalUnread||0));
          await AsyncStorage.setItem('main_unread_cache_v1', JSON.stringify(Number(totalUnread||0))).catch(()=>{});
        } catch {}

        // Incremental fetch
        const latest = (transactions && transactions.length>0) ? transactions[0].occurred_at : undefined
        const params = latest ? `?since=${encodeURIComponent(latest)}&limit=20` : `?limit=20`
        const fresh = await apiGet(`/api/me/transactions${params}`).catch(()=>([]))
        let merged: any[]
        if (Array.isArray(fresh) && fresh.length > 0) {
          const existingById = new Map((transactions||[]).map(t=>[t.id, t]))
          for (const f of fresh) existingById.set(f.id, f)
          merged = Array.from(existingById.values()).sort((a,b)=> new Date(b.occurred_at).getTime()-new Date(a.occurred_at).getTime())
        } else {
          merged = transactions || []
        }
        const filtered = (merged || []).filter((t:any) => t.source !== 'fee')
        const preview = filtered.slice(0,4)
        setTransactions(preview)
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(preview)).catch(()=>{})
      } finally {
        setTransactionsLoading(false);
      }
    };

    const unsub = navigation.addListener('focus', () => {
      // Scroll to top when screen comes into focus
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      load();
    });
    load();
    return unsub;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    const { data } = await supabase.auth.getSession().catch(()=>({ data: { session: null } as any }))
    const uid = data?.session?.user?.id || null
    const CACHE_KEY = recentKeyFor(uid)

    try {
      const [balRes, txnRes, notifRes] = await Promise.all([
        apiGet('/api/wallet/balance').catch(()=>({ balanceCents: 0, pendingBalanceCents: 0 })),
        apiGet('/api/me/transactions?limit=100').catch(()=>[]),
        apiGet('/api/notifications?page=1&limit=1&unread_only=true').catch(()=>({ data: { total: 0 } }))
      ])
      setBalanceCents(Number(balRes?.balanceCents || 0))
      setPendingCents(Number(balRes?.pendingBalanceCents || 0))
      await AsyncStorage.setItem('wallet_balance_cache_v1', JSON.stringify(balRes?.balanceCents || 0)).catch(()=>{})
      await AsyncStorage.setItem('wallet_pending_cache_v1', JSON.stringify(balRes?.pendingBalanceCents || 0)).catch(()=>{})
      const txnArr = Array.isArray(txnRes) ? txnRes : []
      const filtered = txnArr.filter((t:any) => t.source !== 'fee')
      setTransactions(filtered)
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(filtered)).catch(()=>{})
      const totalUnread = (notifRes as any)?.data?.total ?? (notifRes as any)?.total ?? 0
      setUnread(Number(totalUnread||0))
    } finally {
      setRefreshing(false)
    }
  };

  const handleNotificationsPress = () => {
    navigation.dispatch(CommonActions.navigate('Notifications'));
  };

  const handleWalletAndPaymentPress = () => {
    navigation.dispatch(CommonActions.navigate('WalletAndPayment'));
  };

  const renderTxn = ({ item }: { item: any }) => {
    const isPositive = item.direction === 'credit';
    const amount = (Number(item.amount_cents)/100).toLocaleString('en-US',{ style: 'currency', currency: (item.currency||'USD').toUpperCase() });
    const title = item.source === 'deposit' ? 'Deposit' : item.source === 'withdrawal' ? 'Withdrawal' : item.source === 'rotation_earning' ? 'Pickup' : item.source === 'contribution' ? 'Deposit' : item.source;
    const subtitle = item.source === 'contribution' ? 'Contribution' : 'Wallet';
    const dt = new Date(item.occurred_at);
    const now = new Date();
    const isToday = dt.toDateString() === now.toDateString();
    const yesterday = new Date(now); yesterday.setDate(now.getDate()-1);
    const rightTime = isToday ? dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : (dt.toDateString() === yesterday.toDateString() ? 'Yesterday' : dt.toLocaleDateString([], { month: 'short', day: 'numeric' }));
    return (
      <TouchableOpacity style={styles.txnRow} onPress={() => navigation.dispatch(CommonActions.navigate('TransactionDetail' as any, { txn: item } as any))}>
        {/* <View style={styles.txnIcon} /> */}
        <View style={styles.transactionIconContainer}>
        {isPositive ? (
          <ChevronUp width={24} height={24} color="#4D4845" />
        ) : (
          <ChevronDown width={24} height={24} color="#4D4845" />
        )}
      </View>
        <View style={styles.txnLeft}>
          <Text style={styles.txnTitle}>{title}</Text>
          <Text style={styles.txnSub}>{subtitle}</Text>
        </View>
        <View style={styles.txnRight}>
          <Text style={[styles.txnAmount, isPositive ? styles.positive : styles.negative]}>{amount}</Text>
          <Text style={styles.txnRightTime}>{rightTime}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTxnSkeleton = () => (
    <>
      {[1,2,3,4].map(i => (
        <View key={i} style={styles.txnRow}>
          <View style={[styles.txnIcon, { backgroundColor: '#F3F4F6' }]} />
          <View style={styles.txnInfo}>
            <View>
              <View style={styles.skelBarShort} />
              <View style={styles.skelBarTiny} />
            </View>
            <View style={styles.skelBarAmount} />
          </View>
        </View>
      ))}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>My Wallet</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.settingsButton} onPress={handleWalletAndPaymentPress}>
                <Settings width={22} height={22} color="#4D4845" />
              </TouchableOpacity>
              <NotificationBell />
            </View>
          </View>

          <Text style={styles.balanceLabel}>Wallet Balance</Text>
          <Text style={styles.balanceAmount}>{(balanceCents/100).toLocaleString('en-US',{style:'currency',currency:'USD'})}</Text>

          <View style={styles.pendingPill}>
            <Text style={styles.pendingText}>Pending Funds: {(pendingCents/100).toLocaleString('en-US',{style:'currency',currency:'USD'})}</Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.dispatch(CommonActions.navigate('FundWallet'))}>
              <Text style={styles.primaryBtnText}>Fund Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.dispatch(CommonActions.navigate('WithdrawFunds'))}>
              <Text style={styles.primaryBtnText}>Withdraw funds</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionSection}>
            <Text style={styles.transactionTitle}>Transaction history</Text>
            <Text style={styles.transactionSubtitle}>Here are your recent transactions on the app.</Text>
            {/* <TouchableOpacity style={[styles.viewAllBtn, { alignSelf: 'flex-end', marginBottom: 8 }]} onPress={()=>navigation.dispatch(CommonActions.navigate('WithdrawFunds'))}>
              <Text style={styles.viewAllText}>Withdrawals</Text>
            </TouchableOpacity> */}
            {transactionsLoading ? (
              renderTxnSkeleton()
            ) : transactions.length === 0 ? (
              <Text style={styles.transactionSubtitle}>No transactions yet.</Text>
            ) : (
              <>
                <FlatList data={transactions} renderItem={renderTxn} keyExtractor={(i)=>i.id} scrollEnabled={false} />
                <TouchableOpacity style={styles.viewAllBtn} onPress={()=>navigation.dispatch(CommonActions.navigate('Transactions'))}>
                  <Text style={styles.viewAllText}>View all transactions</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollView: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 80, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  settingsButton: { padding: 4 },
  notificationContainer: { padding: 4 },
  notificationBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: '#ef4444', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  notificationText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  title: { fontSize: 14, fontWeight: '500', color: '#4D4845' },

  balanceLabel: { textAlign: 'center', fontSize: 18, color: '#A3A3A3', marginTop: 16 },
  balanceAmount: { textAlign: 'center', fontSize: 56, color: '#4A4643', fontWeight: '400', marginTop: 8 },

  pendingPill: { alignSelf: 'center', backgroundColor: '#F3F4F6', borderRadius: 28, paddingVertical: 12, paddingHorizontal: 18, marginTop: 16 },
  pendingText: { color: '#4B5563', fontSize: 16 },
  transactionIconContainer: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#ffffff', borderStyle: 'solid', borderWidth: 1, borderColor: '#F4F4F2', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  actionsRow: { flexDirection: 'row', gap: 16, marginTop: 28 },
  primaryBtn: { flex: 1, backgroundColor: '#111111', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16 },

  transactionSection: { marginTop: 24 },
  transactionTitle: { fontSize: 16, fontWeight: '500', color: '#111827' },
  transactionSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 4 , marginBottom: 16},

  txnRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  txnIcon: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#F4F4F2', backgroundColor: '#ffffff', marginRight: 12 },
  txnInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  txnTitle: { fontSize: 14, fontWeight: '500', color: '#4D4845', marginBottom: 4 },
  txnSub: { fontSize: 12, color: '#928F8B' },
  txnAmount: { fontSize: 14, fontWeight: '500', color: '#FF6262' },
  positive: { color: '#04A73E' },
  negative: { color: '#FF6262' },
  txnLeft: { flex: 1 },
  txnRight: { alignItems: 'flex-end' },
  txnRightTime: { fontSize: 12, color: '#928F8B' },

  viewAllBtn: { alignSelf: 'flex-start', backgroundColor: '#F3F3F3', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginTop: 12 },
  viewAllText: { color: '#4B5563', fontSize: 14 },

  skelBarShort: { width: 120, height: 12, backgroundColor: '#E5E7EB', borderRadius: 6, marginBottom: 8 },
  skelBarTiny: { width: 80, height: 10, backgroundColor: '#E5E7EB', borderRadius: 5 },
  skelBarAmount: { width: 60, height: 12, backgroundColor: '#E5E7EB', borderRadius: 6, alignSelf: 'flex-end' },
});
