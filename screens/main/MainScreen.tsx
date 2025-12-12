import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Calendar, Users, Plus, ChevronDown, ChevronUp, ChevronRight, DollarSign } from 'lucide-react-native';
import NotificationBell from '../../components/NotificationBell';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import BottomNavigation from '../../components/BottomNavigation';
import { apiGet } from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const avatarImageUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1480";

export default function MainScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [name, setName] = useState<string>('');
  const [unread, setUnread] = useState<number>(0);
  const [groups, setGroups] = useState<any[]>([]);
  const [txns, setTxns] = useState<any[]>([]);
  const [hasCache, setHasCache] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await load(false);
    setRefreshing(false);
  };

  const load = async (background = false) => {
    if (!background && !refreshing) setLoading(true);
    try {
        // hydrate from cache to avoid flicker
        const [p, g1, g2, t, u] = await Promise.all([
          AsyncStorage.getItem('profile_cache_v1'),
          AsyncStorage.getItem('groups_cache_v1'),
          AsyncStorage.getItem('groups_list_cache_v1'),
          AsyncStorage.getItem('main_txns_cache_v1'),
          AsyncStorage.getItem('main_unread_cache_v1'),
        ]);
        let anyCache = false;
        let cachedProfile: any = null;
        if (p) {
          try { cachedProfile = JSON.parse(p); setName(cachedProfile?.full_name || (cachedProfile?.email ? cachedProfile.email.split('@')[0] : '')); anyCache = true; } catch {}
        }
        // Use user-scoped cache keys to avoid bleeding data across accounts
        const userIdForCache = cachedProfile?.id ? String(cachedProfile.id) : null;
        let cachedGroups: any[] = [];
        if (userIdForCache) {
          const scopedGroups = await AsyncStorage.getItem(`groups_cache_u_${userIdForCache}`).catch(()=>null);
          if (scopedGroups) { try { cachedGroups = JSON.parse(scopedGroups) || []; } catch {} }
        }
        if (Array.isArray(cachedGroups) && cachedGroups.length) { setGroups(cachedGroups); anyCache = true; }
        if (userIdForCache) {
          const scopedTxns = await AsyncStorage.getItem(`main_txns_cache_u_${userIdForCache}`).catch(()=>null);
          if (scopedTxns) { try { const arr = JSON.parse(scopedTxns) || []; setTxns(Array.isArray(arr) ? arr : []); anyCache = true; } catch {} }
        } else if (t) { try { const arr = JSON.parse(t) || []; setTxns(Array.isArray(arr) ? arr : []); anyCache = true; } catch {} }
        if (u) { try { setUnread(Number(JSON.parse(u)||0)); anyCache = true; } catch { setUnread(Number(u)||0); } }
        setHasCache(anyCache);

        // fetch fresh
        const [profile, notif, grp, txn] = await Promise.all([
          apiGet('/api/users/profile').catch(()=>({})),
          apiGet('/api/notifications?page=1&limit=1&unread_only=true').catch(()=>({ data: { total: 0 } })),
          apiGet('/api/groups').catch(()=>[]),
          apiGet('/api/me/transactions').catch(()=>[]),
        ]);
        const nm = profile?.full_name || (profile?.email ? profile.email.split('@')[0] : '');
        setName(nm);
        await AsyncStorage.setItem('profile_cache_v1', JSON.stringify(profile || {})).catch(()=>{});
        const totalUnread = notif?.data?.total ?? notif?.total ?? 0;
        setUnread(Number(totalUnread||0));
        await AsyncStorage.setItem('main_unread_cache_v1', JSON.stringify(Number(totalUnread||0))).catch(()=>{});
        const grpArr = Array.isArray(grp) ? grp : [];
        setGroups(grpArr);
        // Save user-scoped caches
        const pid = profile?.id ? String(profile.id) : null;
        if (pid && grpArr.length) await AsyncStorage.setItem(`groups_cache_u_${pid}`, JSON.stringify(grpArr)).catch(()=>{});
        const filtered = Array.isArray(txn) ? (txn.filter((r:any)=> r?.source==='contribution' || r?.source==='rotation_earning')).slice(0,3) : [];
        setTxns(filtered);
        if (pid) await AsyncStorage.setItem(`main_txns_cache_u_${pid}`, JSON.stringify(filtered)).catch(()=>{});
      } finally {
        if (!background && !refreshing) setLoading(false);
      }
    };

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      // Scroll to top when screen comes into focus
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      load(true);
    });
    load(false);
    return unsub;
  }, [navigation]);

  const expectedAmount = useMemo(() => {
    // Sum of positive rotation earnings in the last period as sample; default 0
    const credits = txns.filter(t=>t.source==='rotation_earning' && t.direction==='credit').reduce((s,t)=>s+Number(t.amount_cents||0),0);
    return credits/100;
  }, [txns]);

  const nextPick = useMemo(() => {
    const active = groups.find((g:any)=>g.status==='active' && g.next_charge_at);
    return active?.next_charge_at ? new Date(active.next_charge_at).toLocaleDateString() : 'not set';
  }, [groups]);

  const groupCount = groups.length;
  const showUpcoming = false; // hidden per requirement

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  const handleViewAllGroups = () => {
    navigation.navigate('AllGroups');
  };

  const handleViewAllActivities = () => {
    navigation.navigate('RecentActivities');
  };

  const handleActivityPress = (person: string, type: string, amount: string) => {
    navigation.navigate('ActivityDetail', {
      activity: { person, type, amount }
    });
  };

  const handleNotificationsPress = () => {
    navigation.navigate('Notifications');
  };

  const handleGroupPress = (groupData: any) => {
    navigation.navigate('GroupDetail', {
      groupName: groupData.name,
      groupId: groupData.id,
      amount: groupData.amount,
      memberCount: groupData.memberCount,
      monthlyContribution: groupData.monthlyContribution,
      date: groupData.date
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          {loading && !hasCache && !name ? (
            <View style={styles.skelHeaderBar} />
          ) : (
            <Text style={styles.headerText}>{`Welcome${name?`, ${name}.`:`.`}`}</Text>
          )}
          <NotificationBell />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            {loading && !hasCache ? (
              <View style={{ height: 12, width: 180, backgroundColor: '#E5E7EB', borderRadius: 6 }} />
            ) : (
              <Text style={styles.cardHeaderText}>Your savings overview</Text>
            )}
            {/* Credit Score temporarily disabled
            <TouchableOpacity onPress={() => navigation.navigate('CreditScore')}>
              {loading && !hasCache ? (
                <View style={{ height: 12, width: 60, backgroundColor: '#E5E7EB', borderRadius: 6 }} />
              ) : (
                <Text style={styles.viewInfoText}>View info</Text>
              )}
            </TouchableOpacity>
            */}
          </View>
          <View style={styles.cardInfo}>
          {loading && !hasCache ? (
            <>
              <View style={{ height: 12, width: 120, backgroundColor: '#E5E7EB', borderRadius: 6, marginBottom: 8 }} />
              <View style={{ height: 40, width: 180, backgroundColor: '#E5E7EB', borderRadius: 8 }} />
            </>
          ) : (
            <>
              <Text style={styles.expectedAmountLabel}>Expected Amount</Text>
              <Text style={styles.expectedAmount}>{(expectedAmount || 0).toLocaleString('en-US',{style:'currency',currency:'USD'})}</Text>
            </>
          )}
          </View>
          <View style={styles.cardBottom}>
          <View style={styles.divider} />
          <View style={styles.cardFooter}>
            {loading && !hasCache ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <View style={{ height: 12, width: 140, backgroundColor: '#E5E7EB', borderRadius: 6 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {[0,1,2].map(i=> (<View key={i} style={[styles.groupImage, { marginLeft: i>0?-10:0, backgroundColor: '#E5E7EB' }]} />))}
                  <View style={{ height: 14, width: 60, backgroundColor: '#E5E7EB', borderRadius: 6, marginLeft: 8 }} />
                </View>
              </View>
            ) : (
              <>
                <View style={styles.nextPickDate}>
                  <Calendar color="#3358FF" size={16} />
                  <Text style={styles.nextPickDateText}>Next Pick: {nextPick}</Text>
                </View>
                <View style={styles.groupImages}>
                  {groupCount === 0 ? null : groups.slice(0,3).map((g:any, index:number) => (
                    <Image key={g.id} source={{uri: avatarImageUrl}} style={[styles.groupImage, { marginLeft: index > 0 ? -10 : 0 }]} />
                  ))}
                  <Text style={styles.groupCount}>{groupCount === 0 ? 'no Groups' : `${Math.min(groupCount, 99)} Groups`}</Text>
                </View>
              </>
            )}
          </View>
          </View>
        </View>

        {showUpcoming ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming payment</Text>
            <Text style={styles.sectionSubtitle}>Your next group payment is around the corner.</Text>
            <View style={styles.paymentCard}>
              <View>
                <Text style={styles.paymentText}>Your next payment is</Text>
                <Text style={styles.paymentDate}>1/07/2025</Text>
              </View>
              <Calendar color="#111827" size={24} />
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My groups</Text>
          <Text style={styles.sectionSubtitle}>{groupCount===0 ? 'No groups yet. Create your first group.' : 'Stay in the loop. View all your groups.'}</Text>

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
            {groupCount === 0 ? null : groups.slice(0,3).map((g:any) => (
              <TouchableOpacity
                key={g.id}
                style={styles.groupItem}
                onPress={() => handleGroupPress({
                  name: g.name,
                  id: g.id,
                  amount: (g.goal_amount_cents/100).toLocaleString('en-US',{style:'currency',currency:(g.currency||'USD').toUpperCase()}),
                  memberCount: g.size,
                  monthlyContribution: `${(g.contribution_amount_cents/100).toLocaleString('en-US',{style:'currency',currency:(g.currency||'USD').toUpperCase()})} / ${String(g.frequency||'').toLowerCase().includes('month')?'M':String(g.frequency||'').toLowerCase().includes('week')?'W':String(g.frequency||'').toLowerCase().includes('day')?'D':String(g.frequency||'').toLowerCase().includes('biweek')?'BW':String(g.frequency||'').toLowerCase().includes('quarter')?'Q':String(g.frequency||'').toLowerCase().includes('year')?'Y':(String(g.frequency||'').charAt(0).toUpperCase())}`,
                  date: g.next_charge_at ? new Date(g.next_charge_at).toLocaleDateString() : '-'
                })}
              >
                <View style={styles.groupContent}>
                  <View style={styles.groupIcon}>
                    <View style={styles.groupIconBg}>
                      <View style={styles.iconBadge}>
                        <Text style={styles.iconBadgeText}>{String(g.size)}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.groupInfo}>
                    <Text style={styles.groupTitle}>{g.name}</Text>
                    <Text style={styles.groupAmount}>{(g.goal_amount_cents/100).toLocaleString('en-US',{style:'currency',currency:(g.currency||'USD').toUpperCase()})}</Text>
                    <View style={styles.groupMeta}>
                      <View style={styles.metaItem}>
                        <Calendar width={16} height={16} color="#2563eb" />
                        <Text style={styles.metaText}>{g.next_charge_at ? new Date(g.next_charge_at).toLocaleDateString() : '-'}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Users width={16} height={16} color="#2563eb" />
                        <Text style={styles.metaText}>{g.size}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <DollarSign width={16} height={16} color="#2563eb" />
                        <Text style={styles.metaText}>{(g.contribution_amount_cents/100).toLocaleString('en-US',{style:'currency',currency:(g.currency||'USD').toUpperCase()})}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {groupCount > 0 && (
              <TouchableOpacity style={styles.viewAllGroupsButton} onPress={handleViewAllGroups}>
                <Text style={styles.viewAllGroupsText}>View all groups</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent activities</Text>
          <Text style={styles.sectionSubtitle}>Here are your recent activities across your group.</Text>

          {txns.length === 0 ? (
            <Text style={{ color: '#6B7280' }}>No recent activities.</Text>
          ) : txns.map((t:any, idx:number)=>{
            const isPositive = t.direction === 'credit';
            const amount = (Number(t.amount_cents)/100).toLocaleString('en-US',{ style: 'currency', currency: (t.currency||'USD').toUpperCase() });
            const title = t.source === 'deposit' ? 'Deposit' : t.source === 'withdrawal' ? 'Withdrawal' : t.source === 'rotation_earning' ? 'Pickup' : t.source === 'contribution' ? 'Deposit' : t.source;
            const subtitle = t.source === 'contribution' ? 'Contribution' : 'Wallet';
            const dt = new Date(t.occurred_at);
            const now = new Date();
            const isToday = dt.toDateString() === now.toDateString();
            const yesterday = new Date(now); yesterday.setDate(now.getDate()-1);
            const rightTime = isToday ? dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : (dt.toDateString() === yesterday.toDateString() ? 'Yesterday' : dt.toLocaleDateString([], { month: 'short', day: 'numeric' }));
            return (
              <TouchableOpacity
                key={t.id}
                style={styles.transaction}
                onPress={() => handleActivityPress('System', title.toLowerCase(), String(Number(t.amount_cents)/100))}
              >
                <View style={styles.transactionIconContainer}>
                  {isPositive ? (
                    <ChevronUp width={24} height={24} color="#4D4845" />
                  ) : (
                    <ChevronDown width={24} height={24} color="#4D4845" />
                  )}
                </View>
                <View style={styles.transactionInfo}>
                  <View>
                    <Text style={styles.transactionName}>{title}</Text>
                    <Text style={styles.transactionType}>{subtitle}</Text>
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={[styles.transactionAmount, isPositive ? styles.positive : undefined]}>{amount}</Text>
                    <Text style={styles.transactionTime}>{rightTime}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {txns.length > 0 && (
            <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllActivities}>
              <Text style={styles.viewAllText}>View all activities</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={handleCreateGroup}>
        <Plus color="#ffffff" size={24} />
      </TouchableOpacity>
      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingBottom: 50
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    marginBottom: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'medium',
    color: '#111827',
  },
  skelHeaderBar: { height: 20, width: 160, backgroundColor: '#E5E7EB', borderRadius: 6 },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#F2F2F2',
    borderRadius: 16,
    // padding: 24,
    marginBottom: 24,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#CACACA",
    height: 237,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 15,
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA"
  },
  cardHeaderText: {
    fontSize: 12,
    color: '#4D4845',
  },
  goodText: {
    color: '#04AC9E',
  },
  viewInfoText: {
    fontSize: 12,
    color: '#4D4845',
    textDecorationLine: 'underline',
  },
  cardInfo: {
    paddingHorizontal: 24
  },
  expectedAmountLabel: {
    fontSize: 12,
    color: '#928F8B',
    fontWeight: 'regular',
  },
  expectedAmount: {
    fontSize: 40,
    fontWeight: 'regular',
    color: '#4D4845',
    marginBottom: 16,
  },
  cardBottom: {
    backgroundColor: "white",
    borderBottomEndRadius: 16,
    borderBottomStartRadius: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#CACACA',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    // backgroundColor: "#ffffff",
    paddingBottom: 15,

  },
  nextPickDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextPickDateText: {
    fontSize: 12,
    color: '#4D4845',
    marginLeft: 6,
  },
  groupImages: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupImage: {
    width: 24,
    height: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  groupCount: {
    fontSize: 14,
    color: '#4D4845',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'medium',
    color: '#4D4845',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#928F8B',
    marginBottom: 16,
    fontWeight: "400"
  },
  createGroupButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  createGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  createGroupDescription: {
    fontSize: 14,
    color: '#d1d5db',
  },
  groupsSection: {
    marginTop: 8,
  },
  paymentCard: {
    backgroundColor: '#FFE9E9',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#FCE0E0"
  },
  paymentText: {
    fontSize: 14,
    color: '#4D4845',
  },
  paymentDate: {
    fontSize: 12,
    fontWeight: 'regular',
    color: '#727272',
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
  viewAllGroupsButton: {
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
  viewAllGroupsText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#374151',
  },
  viewAllButton: {
    backgroundColor: '#F2F2F2',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  viewAllButtonText: {
    fontSize: 12,
    fontWeight: 'regular',
    color: '#111827',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  activitySource: {
    fontSize: 14,
    color: '#6b7280',
  },
  activityAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  activityDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  transactionSection: {
    marginBottom: 24,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4D4845',
    marginBottom: 8,
  },
  transactionSubtitle: {
    fontSize: 12,
    color: '#928F8B',
    marginBottom: 24,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  transactionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: "#F4F4F2",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4D4845',
    marginBottom: 4,
  },
  transactionType: {
    fontSize: 12,
    color: '#928F8B',
  },
  transactionDetails: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6262',
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 12,
    color: '#928F8B',
  },
  positive: {
    color: '#04A73E',
  },
  viewAllText: {
    fontSize: 14,
    color: '#4D4845',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    backgroundColor: '#111827',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});
