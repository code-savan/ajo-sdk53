import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, RefreshControl } from 'react-native';
import { Users } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ChevronRight } from 'lucide-react-native';
import NotificationBell from '../../components/NotificationBell';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import BottomNavigation from '../../components/BottomNavigation';
import { apiGet, apiPost } from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GroupCard from '../../components/GroupCard';

export default function GroupsScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [pickupCount, setPickupCount] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [unread, setUnread] = useState<number>(0);
  const [invitesVisible, setInvitesVisible] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [invitesLoading, setInvitesLoading] = useState(false);
  const [invitesError, setInvitesError] = useState<string | null>(null);

  const CACHE_KEY = 'groups_cache_v1';
  const load = async (fromFocus = false) => {
      try {
        if (!fromFocus) {
          const cached = await AsyncStorage.getItem(CACHE_KEY);
          if (cached) {
            const grp = JSON.parse(cached);
            if (Array.isArray(grp)) {
              setGroups(grp);
              let act = grp.filter((g: any) => g?.status === 'active').length;
              if (act === 0 && grp.some((g: any) => g?.status === undefined)) act = grp.length;
              setActiveCount(act);
            }
            setLoading(false);
          }
        }
        if (!fromFocus && groups.length === 0) setLoading(true); else setRefreshing(true);
        const [groupData, txns, notif, invites] = await Promise.all([
          apiGet<any[]>('/api/groups').catch(() => []),
          apiGet<any[]>('/api/me/transactions?limit=500').catch(() => []),
          apiGet('/api/notifications?page=1&limit=1&unread_only=true').catch(()=>({ data: { total: 0 } })),
          apiGet('/api/me/invites?status=pending').catch(()=>({ data: [] })),
        ]);
        const grp = Array.isArray(groupData) ? groupData : [];
        setGroups(grp);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(grp)).catch(()=>{});
        let act = grp.filter((g: any) => g?.status === 'active').length;
        if (act === 0 && grp.some((g: any) => g?.status === undefined)) act = grp.length;
        setActiveCount(act);
        const t = Array.isArray(txns) ? txns : [];
        const pickups = t.filter((r: any) => r?.source === 'rotation_earning' && r?.direction === 'credit').length;
        setPickupCount(pickups);
        const totalUnread = (notif as any)?.data?.total ?? (notif as any)?.total ?? 0;
        setUnread(Number(totalUnread||0));
        setPendingInvites((invites as any)?.data || []);
      } catch (e: any) {
        setError('Failed to load groups');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  const onRefresh = async () => {
    setRefreshing(true);
    await load(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Scroll to top when screen comes into focus
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      load(true);
    });
    load(false);
    return unsubscribe;
  }, [navigation]);

  const openInvites = async () => {
    setInvitesVisible(true);
    try {
      setInvitesLoading(true);
      setInvitesError(null);
      const res = await apiGet('/api/me/invites?status=pending');
      setPendingInvites((res as any)?.data || (Array.isArray(res)?res:[]));
    } finally {
      setInvitesLoading(false);
    }
  };

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  const handleViewAllGroups = () => {
    navigation.navigate('AllGroups');
  };

  const handleNotificationsPress = () => {
    navigation.navigate('Notifications');
  };

  const handleGroupPress = (groupName: string, groupId: string, amount?: string, memberCount?: number, monthlyContribution?: string, date?: string) => {
    navigation.navigate('GroupDetail', { groupName, groupId, amount, memberCount, monthlyContribution, date });
  };

  const formatStat = (n: number) => {
    if (!n) return '0';
    return n < 10 ? `0${n}` : String(n);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Groups</Text>
          <View style={styles.notificationContainer}><NotificationBell /></View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Stats Row */}
          <View style={styles.statsRow}>
            {loading && groups.length === 0 ? (
              <>
                <View style={styles.statCard}>
                  <View style={styles.skelBarMedium} />
                  <View style={styles.skelBigNumber} />
                </View>
                <View style={styles.statCard}>
                  <View style={styles.skelBarMedium} />
                  <View style={styles.skelBigNumber} />
                </View>
              </>
            ) : (
              <>
                <View style={styles.statCard}>
                  <Text style={styles.statTop}>Your total active groups{"\n"}at a glance.</Text>
                  <Text style={styles.statValue}>{formatStat(activeCount)}</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statTop}>Total times you have{"\n"}collected.</Text>
                  <Text style={styles.statValue}>{formatStat(pickupCount)}</Text>
                </View>
              </>
            )}
          </View>

          {/* Pending Invites CTA */}
          <TouchableOpacity style={[styles.createGroupButton, { backgroundColor: '#111827' }]} onPress={openInvites}>
            <View>
              <Text style={styles.createGroupTitle}>Pending invites</Text>
              <Text style={styles.createGroupDescription}>{pendingInvites.length ? `${pendingInvites.length} invite${pendingInvites.length>1?'s':''} waiting` : 'View your group invites'}</Text>
            </View>
            <ChevronRight width={24} height={24} color="white" />
          </TouchableOpacity>

          {/* Create Group Button */}
          <TouchableOpacity style={styles.createGroupButton} onPress={handleCreateGroup}>
            <View>
              <Text style={styles.createGroupTitle}>Create group</Text>
              <Text style={styles.createGroupDescription}>Create a group and start saving smartly</Text>
            </View>
            <ChevronRight width={24} height={24} color="white" />
          </TouchableOpacity>

          {/* Groups Section */}
          <View style={styles.groupsSection}>
            <Text style={styles.groupsTitle}>Groups</Text>
            <Text style={styles.groupsDescription}>Take a look at your current groups.</Text>

            {loading && groups.length === 0 ? (
              <View style={{ marginTop: 16 }}>
                {[1,2,3].map(i => (
                  <View key={i} style={[styles.groupItem, { borderColor: '#E5E7EB' }]}>
                    <View style={styles.groupContent}>
                      <View style={styles.groupIcon}><View style={styles.groupIconBg} /></View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.skelBarLong} />
                        <View style={[styles.skelBarShort, { marginTop: 8 }]} />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : error ? (
              <Text style={styles.emptyText}>{error}</Text>
            ) : groups.length === 0 ? (
              <Text style={styles.emptyText}>No groups yet. Create your first group to get started.</Text>
            ) : (
              groups.map((g) => (
                <GroupCard key={g.id} group={g} onPress={() => handleGroupPress(g.name, g.id, undefined, g.size, `${(g.contribution_amount_cents/100).toLocaleString('en-US',{style:'currency',currency:(g.currency||'USD').toUpperCase()})} `, undefined)} />
              ))
            )}

            {groups.length > 0 && (
              <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllGroups}>
                <Text style={styles.viewAllText}>View all groups</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
      {/* Invites Modal */}
      <Modal visible={invitesVisible} animationType="slide" transparent onRequestClose={()=>setInvitesVisible(false)}>
        <View style={{ flex:1, justifyContent:'flex-end' }}>
          <View style={{ position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(0,0,0,0.35)' }} />
          <View style={{ minHeight:'50%', maxHeight:'70%', backgroundColor:'#fff', borderTopLeftRadius:16, borderTopRightRadius:16, padding:16 }}>
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <Text style={{ fontSize:16, color:'#1E1E1E', fontWeight:'500' }}>Pending invites</Text>
              <TouchableOpacity onPress={()=>setInvitesVisible(false)}><Text style={{ color:'#111827' }}>Close</Text></TouchableOpacity>
            </View>
            {invitesError ? (
              <Text style={{ color:'#EF4444', marginBottom:8 }}>{invitesError}</Text>
            ) : null}
            {invitesLoading ? (
              <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
                <Text style={{ color:'#6B7280' }}>Loading…</Text>
              </View>
            ) : pendingInvites.length === 0 ? (
              <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
                <Users color="#9CA3AF" size={40} />
                <Text style={{ color:'#6B7280', marginTop:10 }}>No invites yet</Text>
              </View>
            ) : (
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {pendingInvites.map((inv:any)=> (
                  <View key={inv.invite_code} style={{ paddingVertical:12, borderBottomWidth:1, borderColor:'#F3F4F6', flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
                    <View>
                      <Text style={{ color:'#1E1E1E', fontSize:14 }}>{inv.group_name || 'Group'}</Text>
                      <Text style={{ color:'#9CA3AF', fontSize:12, marginTop:2 }}>{inv.invite_code.slice(0,6)} • Expires {inv.expires_at ? new Date(inv.expires_at).toLocaleDateString() : '-'}</Text>
                    </View>
                    <View style={{ flexDirection:'row', gap: 12 }}>
                      <TouchableOpacity onPress={()=>{ setInvitesVisible(false); navigation.navigate('InviteLanding', { code: inv.invite_code } as any); }} style={{ paddingVertical:8, paddingHorizontal:12, backgroundColor:'#111827', borderRadius:8 }}>
                        <Text style={{ color:'#fff', fontSize:12 }}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={async()=>{
                        try {
                          await apiPost('/api/groups/invites/decline', { invite_code: inv.invite_code }).catch(()=>({}));
                          const res = await apiGet('/api/me/invites?status=pending').catch(()=>({ data: [] }));
                          setPendingInvites((res as any)?.data || []);
                        } catch {}
                      }} style={{ paddingVertical:8, paddingHorizontal:12, backgroundColor:'#F3F4F6', borderRadius:8 }}>
                        <Text style={{ color:'#1F2937', fontSize:12 }}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: '#ef4444', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  notificationText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    minHeight: 122,
  },
  statTop: {
    color: '#928F8B',
    fontSize: 12,
    fontWeight: '400',
  },
  statValue: {
    color: '#1E1E1E',
    fontSize: 64,
    fontWeight: '500',
    alignSelf: 'flex-end',
  },
  skelBarMedium: { width: '70%', height: 14, backgroundColor: '#E5E7EB', borderRadius: 6 },
  skelBigNumber: { width: 64, height: 40, backgroundColor: '#E5E7EB', borderRadius: 6, alignSelf: 'flex-end', marginTop: 12 },
  createGroupButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  createGroupTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  createGroupDescription: {
    color: '#D1D5DB',
    fontSize: 12,
    marginTop: 4,
  },
  groupsSection: {
    marginTop: 8,
  },
  groupsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  groupsDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
  },
  groupItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginBottom: 12,
  },
  groupContent: {
    flexDirection: 'row',
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupIconBg: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#DBEAFE',
  },
  groupInfo: {
    flex: 1,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  groupAmount: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  groupMeta: {
    flexDirection: 'row',
    marginTop: 8,
  },
  skelBarLong: { width: '60%', height: 12, backgroundColor: '#E5E7EB', borderRadius: 6 },
  skelBarShort: { width: '40%', height: 10, backgroundColor: '#E5E7EB', borderRadius: 6 },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#2563eb',
    marginLeft: 4,
  },
  viewAllButton: {
    width: '80%',
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#374151',
  },
});
