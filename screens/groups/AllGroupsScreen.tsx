import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGet } from '../../lib/api';
import GroupCard from '../../components/GroupCard';

type AllGroupsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function AllGroupsScreen() {
  const navigation = useNavigation<AllGroupsScreenNavigationProp>();
  const [groups, setGroups] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const CACHE_KEY = 'groups_list_cache_v1';

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGroupPress = (g: any) => {
    navigation.navigate('GroupDetail', {
      groupName: g.name,
      groupId: g.id,
      amount: undefined,
      memberCount: g.size,
      monthlyContribution: g.contribution_amount_cents ? `$${(Number(g.contribution_amount_cents)/100).toFixed(0)} / mnth` : undefined,
      date: g.created_at ? new Date(g.created_at).toLocaleDateString('en-US') : undefined,
    });
  };

  const load = async (useBackground = false) => {
    if (!useBackground) setLoading(true);
    try {
      // Show cache first
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached && !useBackground) {
        try { setGroups(JSON.parse(cached)); } catch {}
      }
      // Fetch fresh
      const fresh = await apiGet('/api/groups').catch(() => []);
      if (Array.isArray(fresh)) {
        setGroups(fresh);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fresh)).catch(()=>{});
      }
    } finally {
      if (!useBackground) setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    const unsub = (navigation as any).addListener?.('focus', () => load(true));
    load(false);
    return unsub;
  }, [navigation]);

  const renderGroup = (g: any, idx: number) => (
    <GroupCard key={g.id || idx} group={g} onPress={() => handleGroupPress(g)} />
  );

  const Skeleton = ({ keyIdx }: { keyIdx: number }) => (
    <View key={`sk-${keyIdx}`} style={styles.groupItem}>
      <View style={styles.groupContent}>
        <View style={styles.groupIcon}>
          <View style={[styles.groupIconBg, { backgroundColor: '#f3f4f6' }]} />
        </View>
        <View style={styles.groupInfo}>
          <View style={{ height: 14, backgroundColor: '#f3f4f6', borderRadius: 6, marginBottom: 8 }} />
          <View style={{ height: 16, width: 120, backgroundColor: '#f3f4f6', borderRadius: 6, marginBottom: 12 }} />
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ height: 12, width: 80, backgroundColor: '#f3f4f6', borderRadius: 6 }} />
            <View style={{ height: 12, width: 40, backgroundColor: '#f3f4f6', borderRadius: 6 }} />
            <View style={{ height: 12, width: 100, backgroundColor: '#f3f4f6', borderRadius: 6 }} />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft color="#000000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My groups</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(false); }} />}
      >
        <View style={styles.content}>
          <Text style={styles.title}>My groups</Text>
          <Text style={styles.subtitle}>Stay in the loop. View all your groups.</Text>

          {loading && groups.length === 0 ? (
            <>
              {[0,1,2,3].map(i => <Skeleton keyIdx={i} key={`s-${i}`} />)}
            </>
          ) : groups.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 24 }}>
              <Text style={{ color: '#928F8B' }}>No groups yet.</Text>
            </View>
          ) : (
            groups.map((g, idx) => renderGroup(g, idx))
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
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 16,
    marginBottom: 8,

  },
  subtitle: {
    fontSize: 12,
    color: '#928F8B',
    marginBottom: 24,
  },
  groupItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  groupContent: {
    flexDirection: 'row',
    gap: 16,
  },
  groupIcon: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  groupIconBg: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0f2e9',
    borderRadius: 8,
    position: 'relative',
    // Map-like background styling
    borderWidth: 0.5,
    borderColor: '#c2d6b8',
  },
  iconBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -15,
    marginLeft: -15,
    width: 30,
    height: 30,
    backgroundColor: '#e7c08c',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  iconBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  groupInfo: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "space-between",
    paddingVertical: 10
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  groupAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9A9A9A',
    marginBottom: 12,
  },
  groupMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#4D4845',
    fontWeight: "400"
  },
});
