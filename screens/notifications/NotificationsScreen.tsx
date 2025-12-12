import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle, AlertCircle, InfoIcon, Calendar, DollarSign, Users, Wallet2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { apiGet, apiPut } from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from '../../contexts/ToastContext';
// import { Wallet } from 'lucide-react';

type NotificationsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function NotificationsScreen() {
  const navigation = useNavigation<NotificationsScreenNavigationProp>();
  const scrollViewRef = useRef<ScrollView>(null);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [hasCache, setHasCache] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const formatFriendlyDate = (iso: string) => {
    if (!iso) return '';
    const dt = new Date(iso);
    const now = new Date();
    const isToday = dt.toDateString() === now.toDateString();
    const y = new Date(now); y.setDate(now.getDate()-1);
    if (isToday) return dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (dt.toDateString() === y.toDateString()) return 'Yesterday';
    return dt.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getNotificationIcon = (n: any) => {
    const type: string = (n?.type || '').toString();
    const kind: string = (n?.data?.kind || '').toString();
    // Map DB types/kinds to icons
    if (type === 'transaction_update' || kind.includes('wallet') || kind.includes('withdrawal')) {
      return <Wallet2 size={24} color="#2563eb" />;
    }
    if (type === 'contribution_reminder' || kind.includes('contribution')) {
      return <Calendar size={24} color="#2563eb" />;
    }
    if (type === 'group_invite' || kind.includes('invite')) {
      return <Users size={24} color="#2563eb" />;
    }
    if (type === 'payout_available') {
      return <CheckCircle size={24} color="#04A73E" />;
    }
    if ((n?.data?.ui_type || '').toString() === 'success') {
      return <CheckCircle size={24} color="#04A73E" />;
    }
    if ((n?.data?.ui_type || '').toString() === 'alert') {
      return <AlertCircle size={24} color="#FF6262" />;
    }
    return <InfoIcon size={24} color="#2563eb" />;
  };

  useEffect(() => {
    const load = async () => {
      let usedCache = false;
      try {
        const cached = await AsyncStorage.getItem('notifications_list_cache_v1');
        if (cached) {
          try {
            const arr = JSON.parse(cached);
            if (Array.isArray(arr) && arr.length > 0) {
              setItems(arr);
              usedCache = true;
              setHasCache(true);
              setLoading(false);
            }
          } catch {}
        }
      } catch {}
      if (!usedCache) setLoading(true);
      try {
        const res = await apiGet('/api/notifications?page=1&limit=50');
        const list = res?.data || res?.data?.data || res?.data || [];
        const flat = Array.isArray(list) ? list : (Array.isArray(res?.data?.data) ? res.data.data : []);
        setItems(flat);
        try { await AsyncStorage.setItem('notifications_list_cache_v1', JSON.stringify(flat)); } catch {}
        // Update unread cache for badges
        try {
          const unreadCount = flat.filter((n: any) => !n.read).length;
          await AsyncStorage.setItem('main_unread_cache_v1', JSON.stringify(unreadCount));
        } catch {}
      } catch {
        setItems([]);
        showToast({ message: 'Failed to load notifications.', variant: 'error' });
      } finally {
        setLoading(false);
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
    try {
      const res = await apiGet('/api/notifications?page=1&limit=50');
      const list = res?.data || res?.data?.data || res?.data || [];
      const flat = Array.isArray(list) ? list : (Array.isArray(res?.data?.data) ? res.data.data : []);
      setItems(flat);
      try { await AsyncStorage.setItem('notifications_list_cache_v1', JSON.stringify(flat)); } catch {}
      // Update unread cache for badges
      try {
        const unreadCount = flat.filter((n: any) => !n.read).length;
        await AsyncStorage.setItem('main_unread_cache_v1', JSON.stringify(unreadCount));
      } catch {}
    } catch {
      showToast({ message: 'Failed to refresh notifications.', variant: 'error' });
    } finally {
      setRefreshing(false);
    }
  };

  const news = items.filter(n => !n.read);
  const earlier = items.filter(n => n.read);

  const markAsRead = async (id: string) => {
    try {
      await apiPut(`/api/notifications/${id}/read`, {});
      setItems(prev => {
        const next = prev.map(i => i.id === id ? { ...i, read: true } : i);
        // Persist to cache and update unread count quickly
        try {
          AsyncStorage.setItem('notifications_list_cache_v1', JSON.stringify(next));
          const unreadCount = next.filter((n: any) => !n.read).length;
          AsyncStorage.setItem('main_unread_cache_v1', JSON.stringify(unreadCount));
        } catch {}
        return next;
      });
    } catch {}
  };

  const handleOpen = async (n: any) => {
    if (!n.read) await markAsRead(n.id);
    navigation.navigate('NotificationDetail', {
      notification: {
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        created_at: n.created_at,
        data: n.data,
      }
    } as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft color="#000000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {/* <View style={styles.emptyView} /> */}
      </View>

      {loading ? (
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
          <Text style={styles.subtitle}>Stay up to date with your recent notifications.</Text>

            {[1,2,3,4].map(i => (
              <View key={i} style={styles.skelItem}>
                <View style={styles.skelIcon} />
                <View style={{ flex: 1 }}>
                  <View style={styles.skelBarLong} />
                  <View style={styles.skelBarShort} />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.content}>
            <Text style={styles.subtitle}>Stay up to date with your recent notifications.</Text>

            {news.length > 0 ? (
              <View style={styles.notificationGroup}>
                <Text style={styles.groupTitle}>New</Text>
                {news.map(n => (
                  <TouchableOpacity key={n.id} style={[styles.notificationItem, styles.softCard]} onPress={() => handleOpen(n)}>
                    <View style={styles.iconContainer}>{getNotificationIcon(n)}</View>
                    <View style={styles.notificationContent}>
                      <View style={styles.notificationHeader}>
                        <Text style={styles.notificationTitle}>{n.title}</Text>
                        <Text style={styles.notificationTime}>{formatFriendlyDate(n.created_at)}</Text>
                      </View>
                      <Text style={styles.notificationMessage}>{n.message}</Text>
                      {/* {Array.isArray(n?.data?.via) && n.data.via.length > 0 ? (
                        <Text style={styles.viaText}>via: {n.data.via.join(', ')}</Text>
                      ) : null} */}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}

            <View style={styles.notificationGroup}>
              <Text style={styles.groupTitle}>Earlier</Text>
              {earlier.length === 0 ? (
                <Text style={{ color: '#6B7280' }}>No earlier notifications.</Text>
              ) : earlier.map(n => (
                <TouchableOpacity key={n.id} style={[styles.notificationItem, styles.softCard]} onPress={() => handleOpen(n)}>
                  <View style={styles.iconContainer}>{getNotificationIcon(n)}</View>
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationTitle}>{n.title}</Text>
                      <Text style={styles.notificationTime}>{formatFriendlyDate(n.created_at)}</Text>
                    </View>
                    <Text style={styles.notificationMessage}>{n.message}</Text>
                    {/* {Array.isArray(n?.data?.via) && n.data.via.length > 0 ? (
                      <Text style={styles.viaText}>via: {n.data.via.join(', ')}</Text>
                    ) : null} */}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1C1C1C',
  },
  emptyView: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    marginTop: 8,
  },
  notificationGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4D4845',
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  softCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#EEF2F7',
    marginBottom: 8,
  },
  unreadItem: {
    backgroundColor: '#F9FAFB',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  notificationTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  viaText: { marginTop: 4, fontSize: 10, color: '#6b7280' },
  // skeletons
  skelItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  skelIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E5E7EB', marginRight: 16 },
  skelBarLong: { height: 14, backgroundColor: '#E5E7EB', borderRadius: 6, marginBottom: 8, width: '70%' },
  skelBarShort: { height: 12, backgroundColor: '#E5E7EB', borderRadius: 6, width: '40%' },
});
