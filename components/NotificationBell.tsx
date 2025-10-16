import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useNavigation, CommonActions, useNavigationState } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGet } from '../lib/api';
import { eventBus } from '../lib/eventBus';

export default function NotificationBell() {
  const navigation = useNavigation<any>();
  const [unread, setUnread] = useState<number>(0);

  const syncFromCache = async () => {
    try {
      const cached = await AsyncStorage.getItem('main_unread_cache_v1');
      if (cached) {
        try { setUnread(Number(JSON.parse(cached)||0)); } catch { setUnread(Number(cached)||0); }
      }
    } catch {}
  };

  const refreshFromApi = async () => {
    try {
      const res = await apiGet('/api/notifications?page=1&limit=1&unread_only=true').catch(()=>({ data: { total: 0 } }));
      const total = (res?.data?.total ?? res?.total ?? 0) as number;
      setUnread(Number(total||0));
      await AsyncStorage.setItem('main_unread_cache_v1', JSON.stringify(Number(total||0))).catch(()=>{});
      eventBus.emit('unread:update', Number(total||0));
    } catch {}
  };

  useEffect(() => {
    syncFromCache();
    refreshFromApi();
    const onUpdate = (n: number) => setUnread(n);
    eventBus.on('unread:update', onUpdate);
    const unsubscribeFocus = navigation.addListener?.('focus', () => {
      // resync on focus for snappy updates
      syncFromCache();
      refreshFromApi();
    });
    return () => {
      eventBus.off('unread:update', onUpdate);
      unsubscribeFocus && unsubscribeFocus();
    };
  }, []);

  const handlePress = () => {
    navigation.dispatch(CommonActions.navigate('Notifications'));
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Bell width={24} height={24} color="#4D4845" />
      {unread > 0 && (
        <View style={styles.badge}>
          <Text style={styles.text}>{unread > 9 ? '9+' : String(unread)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 4, position: 'relative' },
  badge: { position: 'absolute', top: -2, right: -2, backgroundColor: '#ef4444', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  text: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
});
