import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle, AlertCircle, InfoIcon, Calendar } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { apiGet } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

type NotificationsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function NotificationsScreen() {
  const navigation = useNavigation<NotificationsScreenNavigationProp>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'success':
        return <CheckCircle size={24} color="#04A73E" />;
      case 'alert':
        return <AlertCircle size={24} color="#FF6262" />;
      case 'calendar':
        return <Calendar size={24} color="#2563eb" />;
      case 'info':
      default:
        return <InfoIcon size={24} color="#2563eb" />;
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await apiGet('/api/notifications?page=1&limit=50');
        const list = res?.data || res?.data?.data || res?.data || [];
        const flat = Array.isArray(list) ? list : (Array.isArray(res?.data?.data) ? res.data.data : []);
        setItems(flat);
      } catch {
        setItems([]);
        showToast({ message: 'Failed to load notifications.', variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    const unsub = navigation.addListener('focus', load);
    load();
    return unsub;
  }, [navigation]);

  const news = items.filter(n => !n.read);
  const earlier = items.filter(n => n.read);

  const handleOpen = (n: any) => {
    navigation.navigate('NotificationDetail' as never, { notification: { id: n.id, title: n.title, message: n.message, type: n.type } } as never);
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
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.subtitle}>Stay up to date with your recent notifications.</Text>

            <View style={styles.notificationGroup}>
              <Text style={styles.groupTitle}>New</Text>
              {news.length === 0 ? (
                <Text style={{ color: '#6B7280' }}>No new notifications.</Text>
              ) : news.map(n => (
                <TouchableOpacity key={n.id} style={[styles.notificationItem, !n.read && styles.unreadItem]} onPress={() => handleOpen(n)}>
                  <View style={styles.iconContainer}>
                    {getNotificationIcon(n.type)}
                  </View>
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationTitle}>{n.title}</Text>
                      <Text style={styles.notificationTime}>{new Date(n.created_at).toLocaleString()}</Text>
                    </View>
                    <Text style={styles.notificationMessage}>{n.message}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.notificationGroup}>
              <Text style={styles.groupTitle}>Earlier</Text>
              {earlier.length === 0 ? (
                <Text style={{ color: '#6B7280' }}>No earlier notifications.</Text>
              ) : earlier.map(n => (
                <TouchableOpacity key={n.id} style={styles.notificationItem} onPress={() => handleOpen(n)}>
                  <View style={styles.iconContainer}>
                    {getNotificationIcon(n.type)}
                  </View>
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationTitle}>{n.title}</Text>
                      <Text style={styles.notificationTime}>{new Date(n.created_at).toLocaleString()}</Text>
                    </View>
                    <Text style={styles.notificationMessage}>{n.message}</Text>
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
});
