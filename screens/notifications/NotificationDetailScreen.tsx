import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ArrowLeft } from 'lucide-react-native';
import { apiGet } from '../../lib/api';

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
  const params = (route?.params || {}) as NotificationDetailParams;

  useEffect(() => {
    // Mark as read (best-effort)
    if (params?.id) {
      fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/notifications/${params.id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': '' },
      }).catch(()=>{});
    }
  }, [params?.id]);

  const handleBack = () => navigation.goBack();

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
          <Text style={styles.title}>{params?.title || 'Notification'}</Text>
          <Text style={styles.time}>{params?.created_at ? new Date(params.created_at).toLocaleString() : ''}</Text>
          <Text style={styles.message}>{params?.message}</Text>
          {Array.isArray(params?.data?.via) && params.data.via.length > 0 ? (
            <Text style={styles.via}>Delivered via: {params.data.via.join(', ')}</Text>
          ) : null}
          {params?.data ? (
            <View style={styles.metaBox}>
              <Text style={styles.metaTitle}>Details</Text>
              <Text style={styles.metaText}>{JSON.stringify(params.data, null, 2)}</Text>
            </View>
          ) : null}
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
  title: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 },
  time: { fontSize: 12, color: '#6B7280', marginBottom: 12 },
  message: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  via: { fontSize: 12, color: '#6B7280', marginTop: 8 },
  metaBox: { marginTop: 16, backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  metaTitle: { fontSize: 12, color: '#6B7280', marginBottom: 6 },
  metaText: { fontSize: 12, color: '#111827' },
});
