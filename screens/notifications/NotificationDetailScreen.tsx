import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ArrowLeft, CheckCircle, AlertCircle, InfoIcon, Calendar, Wallet, Users } from 'lucide-react-native';
import { apiPut, apiGet } from '../../lib/api';

export type NotificationDetailParams = {
  id: string;
  title: string;
  message: string;
  created_at?: string;
  type?: string;
  data?: any;
};

type Nav = StackNavigationProp<RootStackParamList, 'Notifications'>;

type DetailRoute = RouteProp<RootStackParamList, 'Notifications'>;

export default function NotificationDetailScreen({ route }: any) {
  const navigation = useNavigation<Nav>();
  const notif = ((route?.params || {}) as any).notification as NotificationDetailParams || ({} as NotificationDetailParams);
  const [related, setRelated] = React.useState<any | null>(null);

  useEffect(() => {
    // Mark as read (best-effort)
    if (notif?.id) {
      apiPut(`/api/notifications/${notif.id}/read`, {}).catch(()=>{});
    }
  }, [notif?.id]);

  useEffect(() => {
    // Load related transaction/action if available
    const loadRelated = async () => {
      try {
        const src = (notif?.data?.source || '').toString();
        const ref = (notif?.data?.external_ref || '').toString();
        if (src === 'deposit' && ref) {
          const details = await apiGet(`/api/me/transactions/find?external_ref=${encodeURIComponent(ref)}&source=deposit`);
          setRelated(details || null);
        } else if (src === 'contribution' && ref) {
          // Fetch group ledger/contribution summary if needed (placeholder endpoint)
          const details = await apiGet(`/api/me/transactions/find?external_ref=${encodeURIComponent(ref)}&source=contribution`).catch(()=>null);
          setRelated(details || null);
        } else {
          setRelated(null);
        }
      } catch { setRelated(null); }
    };
    loadRelated();
  }, [notif?.data?.external_ref]);

  const formatFriendlyDate = (iso?: string) => {
    if (!iso) return '';
    const dt = new Date(iso);
    const now = new Date();
    const isToday = dt.toDateString() === now.toDateString();
    const y = new Date(now); y.setDate(now.getDate()-1);
    if (isToday) return dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (dt.toDateString() === y.toDateString()) return 'Yesterday';
    return dt.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getIcon = (n: NotificationDetailParams) => {
    const type = (n?.type || '').toString();
    const kind = (n?.data?.kind || '').toString();
    if (type === 'transaction_update' || kind.includes('wallet') || kind.includes('withdrawal')) return <Wallet size={24} color="#2563eb" />;
    if (type === 'contribution_reminder' || kind.includes('contribution')) return <Calendar size={24} color="#2563eb" />;
    if (type === 'group_invite' || kind.includes('invite')) return <Users size={24} color="#2563eb" />;
    if (type === 'payout_available') return <CheckCircle size={24} color="#04A73E" />;
    const ui = (n?.data?.ui_type || '').toString();
    if (ui === 'success') return <CheckCircle size={24} color="#04A73E" />;
    if (ui === 'alert') return <AlertCircle size={24} color="#FF6262" />;
    return <InfoIcon size={24} color="#2563eb" />;
  };

  const handleBack = () => {
    try {
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' as any }] as any });
    } catch {
      navigation.navigate('MainTabs' as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft color="#000000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll}>
        <View style={styles.content}>
          {/* Top-centered icon */}
          <View style={styles.centerIcon}>{getIcon(notif)}</View>

          {/* Invoice-like card */}
          <View>
            <Text style={styles.titleCenter}>{notif?.title || 'Notification'}</Text>
            <Text style={styles.timeFull}>{new Date(notif?.created_at || Date.now()).toLocaleString()}</Text>

            {/* ID */}
            {notif?.id ? (
              <View style={styles.section}>
                <Text style={styles.label}>Notification ID</Text>
                <Text style={styles.value}>{notif.id}</Text>
              </View>
            ) : null}

            {/* Message */}
            {notif?.message ? (
              <View style={styles.section}>
                <Text style={styles.label}>Message</Text>
                <Text style={styles.message}>{notif.message}</Text>
              </View>
            ) : null}

            {/* Delivery channels */}
            {Array.isArray(notif?.data?.via) && notif.data.via.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.label}>Delivered via</Text>
                <Text style={styles.value}>{notif.data.via.join(', ')}</Text>
              </View>
            ) : null}

            {/* Raw data */}
            {notif?.data ? (
              <View style={styles.section}>
                <Text style={styles.label}>Data</Text>
                {Object.keys(notif.data).filter(k => k !== 'via').length === 0 ? (
                  <Text style={styles.value}>No extra data</Text>
                ) : (
                  Object.entries(notif.data).filter(([k])=>k!=='via').map(([k,v]) => (
                    <View key={String(k)} style={styles.kvRow}>
                      <Text style={styles.kvKey}>{String(k)}</Text>
                      <Text style={styles.kvVal}>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</Text>
                    </View>
                  ))
                )}
              </View>
            ) : null}

          {/* Related action */}
          {related ? (
            <View style={styles.section}>
              <Text style={styles.label}>Related</Text>
              {Object.entries(related).map(([k,v]) => (
                <View key={String(k)} style={styles.kvRow}>
                  <Text style={styles.kvKey}>{String(k)}</Text>
                  <Text style={styles.kvVal}>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</Text>
                </View>
              ))}
            </View>
          ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '400', color: '#1C1C1C' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24 },
  centerIcon: { alignSelf: 'center', width: 56, height: 56, borderRadius: 28, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  invoiceCard: { },
  titleCenter: { fontSize: 18, fontWeight: '600', color: '#111827', textAlign: 'center', marginBottom: 6 },
  timeFull: { fontSize: 12, color: '#6B7280', textAlign: 'center', marginBottom: 16 },
  section: { marginTop: 12 },
  label: { fontSize: 12, color: '#6B7280', marginBottom: 6 },
  value: { fontSize: 14, color: '#111827' },
  message: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  via: { fontSize: 12, color: '#6B7280', marginTop: 8 },
  kvRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 6 },
  kvKey: { fontSize: 12, color: '#6B7280', marginRight: 12, flexShrink: 0, minWidth: 100 },
  kvVal: { fontSize: 12, color: '#111827', flex: 1, flexWrap: 'wrap' },
});
