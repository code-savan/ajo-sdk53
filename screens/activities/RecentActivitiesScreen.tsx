import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { apiGet } from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RecentActivitiesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Avatar image URLs
const femaleAvatarUrl = "https://images.unsplash.com/photo-1543085784-0b3c85b4e8ac?q=80&w=987";
const maleAvatarUrl = "https://images.unsplash.com/photo-1614248793396-944d024ec422?q=80&w=1064";

type RouteP = RouteProp<RootStackParamList, 'RecentActivities'>;

export default function RecentActivitiesScreen() {
  const navigation = useNavigation<RecentActivitiesScreenNavigationProp>();
  const route = useRoute<RouteP>();
  const groupId = (route.params as any)?.groupId;
  const groupName = (route.params as any)?.groupName;
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleActivityPress = (activity: any) => {
    navigation.navigate('ActivityDetail', { activity });
  };

  useEffect(() => {
    const load = async () => {
      try {
        const CACHE_KEY = `group_activities_all_${groupId}`;
        // Try cache first
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          try { setActivities(JSON.parse(cached)); } catch {}
          setLoading(false);
        } else {
          setLoading(true);
        }
        // Refresh in background
        const res = await apiGet(`/api/groups/${groupId}/activities?limit=50`).catch(()=>[]);
        const arr = Array.isArray(res) ? res : [];
        setActivities(arr);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(arr)).catch(()=>{});
      } finally { setLoading(false); }
    };
    load();
  }, [groupId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft color="#000000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recent activities</Text>
        {/* <View style={styles.emptyView} /> */}
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
        <Text style={styles.title}>Recent activities</Text>
          <Text style={styles.subtitle}>Here are your recent activities across your group.</Text>

          {loading ? (
            <View>
              {[1,2,3,4,5].map(i => (
                <View key={i} style={styles.activityItem}>
                  <View style={styles.avatar}><View style={{flex:1,backgroundColor:'#E5E7EB',borderRadius:24}} /></View>
                  <View style={styles.activityInfo}>
                    <View style={{ width: 140, height: 14, backgroundColor: '#E5E7EB', borderRadius: 6, marginBottom: 6 }} />
                    <View style={{ width: 100, height: 12, backgroundColor: '#E5E7EB', borderRadius: 6 }} />
                  </View>
                  <View style={styles.amountInfo}>
                    <View style={{ width: 90, height: 14, backgroundColor: '#E5E7EB', borderRadius: 6, marginBottom: 6 }} />
                    <View style={{ width: 80, height: 12, backgroundColor: '#E5E7EB', borderRadius: 6 }} />
                  </View>
                </View>
              ))}
            </View>
          ) : activities.length === 0 ? (
            <Text style={styles.subtitle}>No recent activities yet.</Text>
          ) : (
            activities.map((a, idx) => {
              const isCredit = String(a.direction) === 'credit'
              const amountStr = (Number(a.amount_cents || 0)/100).toLocaleString('en-US',{ style:'currency', currency: (a.currency||'USD').toUpperCase() })
              const timeStr = new Date(a.occurred_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
              const subtitle = a.source === 'deposit' ? 'Deposited' : (a.source === 'rotation_payout' ? 'Collected' : (isCredit ? 'Credited' : 'Debited'))
              const avatar = a.avatar_url || femaleAvatarUrl
              const name = a.person_name || 'Member'
              const payload = { person: name, avatar_url: avatar, type: subtitle.toLowerCase().includes('collect') ? 'collection' : 'deposit', amount_cents: a.amount_cents, currency: a.currency, occurred_at: a.occurred_at, source: a.source, direction: a.direction, group_name: groupName }
              return (
                <TouchableOpacity key={idx} style={styles.activityItem} onPress={() => handleActivityPress(payload)}>
                  <Image source={{ uri: avatar }} style={styles.avatar} />
                  <View style={styles.activityInfo}>
                    <Text style={styles.personName}>{name}</Text>
                    <Text style={styles.actionText}>{subtitle}</Text>
                  </View>
                  <View style={styles.amountInfo}>
                    <Text style={styles.amountPositive}>{amountStr}</Text>
                    <Text style={styles.timeText}>{timeStr}</Text>
                  </View>
                </TouchableOpacity>
              )
            })
          )}

        </View>
      </ScrollView>
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
    color: '#000000',
  },
  emptyView: {
    width: 24, // Same width as back button for balanced centering
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 16,
    marginBottom: 8,

  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: '#F2F2F2',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  circleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#F4F4F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#4D4845',
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#928F8B',
    fontWeight: '400',
  },
  amountInfo: {
    alignItems: 'flex-end',
  },
  amountPositive: {
    fontSize: 16,
    fontWeight: '500',
    color: '#04A73E',
    marginBottom: 4,
  },
  amountNegative: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF6262',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#928F8B',
  },
});
