import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Users, DollarSign, Pen, X, Facebook, Instagram, MessageCircle, Copy, Link2, Clock, ChevronRight } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import Modal from 'react-native-modal';
import { apiGet, apiPost } from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type GroupDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GroupDetail'>;
type GroupDetailScreenRouteProp = RouteProp<RootStackParamList, 'GroupDetail'>;

const femaleAvatarUrl = "https://images.unsplash.com/photo-1543085784-0b3c85b4e8ac?q=80&w=987";
const maleAvatarUrl = "https://images.unsplash.com/photo-1614248793396-944d024ec422?q=80&w=1064";
const maleAvatar2Url = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987";

export default function GroupDetailScreen() {
  const navigation = useNavigation<GroupDetailScreenNavigationProp>();
  const route = useRoute<GroupDetailScreenRouteProp>();
  const { groupName, groupId } = route.params;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<any | null>(null);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [activating, setActivating] = useState(false);
  const [paying, setPaying] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState<boolean>(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviting, setInviting] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleViewAllActivities = () => {
    (navigation as any).navigate('RecentActivities' as any, { groupId, groupName } as any);
  };

  const handleViewAllMembers = () => {
    navigation.navigate('AllMembers');
  };

  const handleInviteMember = () => {
    setBottomSheetVisible(true);
  };

  const handleMakeDeposit = () => {
    (navigation as any).navigate('MakeDeposit' as any, { groupId, groupName } as any);
  };

  const handleActivate = async () => {
    try {
      setActivating(true);
      await apiPost(`/api/groups/${groupId}/activate`, {});
    } catch {}
    finally {
      setActivating(false);
      try {
        const data = await apiGet(`/api/groups/${groupId}/summary`);
        setSummary(data);
      } catch {}
    }
  };

  const handlePayContribution = async () => {
    try {
      setPaying(true);
      const res = await apiPost(`/api/groups/${groupId}/contributions/pay`, {});
      // Optimistically bump available by contribution amount if backend returned debited_cents
      const bumped = Number((res as any)?.debited_cents || 0);
      if (bumped > 0) {
        setSummary((prev: any) => prev ? { ...prev, availableBalanceCents: Number(prev.availableBalanceCents || 0) + bumped } : prev);
      }
      // Then refresh from server to stay accurate
      const data = await apiGet(`/api/groups/${groupId}/summary`).catch(()=>null);
      if (data) setSummary(data);
    } catch (e: any) {
      // Optionally display a toast if available in app context
      // no toast context here; UI will remain unchanged
    } finally { setPaying(false); }
  };

  useEffect(() => {
    const CACHE_KEY = `group_summary_${groupId}`;
    let unsub: any = null;
    const load = async (fromFocus = false) => {
      try {
        if (!fromFocus) {
          // Try cache first
          const cached = await AsyncStorage.getItem(CACHE_KEY);
          if (cached) {
            try { setSummary(JSON.parse(cached)); } catch {}
            setLoading(false);
          }
        }
        // Always refresh in background
        if (!fromFocus && !summary) setLoading(true); else setRefreshing(true);
        const data = await apiGet(`/api/groups/${groupId}/summary`);
        setSummary(data);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data)).catch(()=>{});
        // Load recent activities (top 3)
        try {
          const ACT_CACHE = `group_activities_${groupId}`;
          const cachedActs = await AsyncStorage.getItem(ACT_CACHE);
          if (cachedActs) {
            try { setActivities(JSON.parse(cachedActs)); } catch {}
            setActivitiesLoading(false);
          } else {
            setActivitiesLoading(true);
          }
          const acts = await apiGet(`/api/groups/${groupId}/activities?limit=3`).catch(()=>[]);
          const arr = Array.isArray(acts) ? acts : [];
          setActivities(arr);
          await AsyncStorage.setItem(ACT_CACHE, JSON.stringify(arr)).catch(()=>{});
        } finally { setActivitiesLoading(false); }
        // Load pending invites
        try {
          const inv = await apiGet(`/api/groups/${groupId}/invites?status=pending`).catch(()=>[]);
          setPendingInvites(Array.isArray(inv?.data) ? inv.data : (Array.isArray(inv) ? inv : []));
        } catch {}
      } catch (e) {
        if (!summary) setSummary(null);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    load(false);
    unsub = navigation.addListener('focus', () => load(true));
    return () => { if (unsub) unsub(); };
  }, [groupId]);

  const group = summary?.group;
  const available = summary?.availableBalanceCents ?? 0;
  const totalContributed = summary?.totalContributedCents ?? available;
  const durationMonths = summary?.duration_months ?? null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <View style={styles.gradientHeader}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleGoBack}>
                <ArrowLeft color="#000000" size={24} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Group details</Text>
            </View>
            <View style={styles.groupIconContainer}>
              <View style={styles.groupIcon}>
                <Image source={require('../../assets/images/profile.png')} style={styles.groupIconImage as any} />
              </View>
              <TouchableOpacity style={styles.editIcon}>
                <Pen size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <View style={styles.groupInfo}>
              <Text style={styles.groupTitle}>{groupName}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {/* Availability badge only */}
                {loading ? (
                  <View style={styles.openBadge}>
                    <Text style={styles.openBadgeText}></Text>
                  </View>
                ) : (
                  <View style={[styles.openBadge, (Number(summary?.memberCount || 0) >= Number(group?.size || 0)) ? styles.closedBadge : styles.openBadge]}>
                    <Text style={[styles.openBadgeText, (Number(summary?.memberCount || 0) >= Number(group?.size || 0)) ? styles.closedBadgeText : styles.openBadgeText]}>
                      {Number(summary?.memberCount || 0) >= Number(group?.size || 0) ? 'Group full' : 'Group open'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {loading && !summary ? (
            <View>
              <View style={styles.skelAmount} />
              <View style={styles.metaContainer}>
                <View style={styles.metaItem}><View style={styles.skelIcon} /><View style={styles.skelBarSmall} /></View>
                <View style={styles.metaItem}><View style={styles.skelIcon} /><View style={styles.skelBarSmall} /></View>
                <View style={styles.metaItem}><View style={styles.skelIcon} /><View style={styles.skelBarSmall} /></View>
              </View>
            </View>
          ) : !group ? (
            <Text style={{ color: '#6B7280' }}>No data available.</Text>
          ) : (
            <>
              {/* Top amount shows total contributed amount from DB */}
              <Text style={styles.amount}>{(Number(totalContributed || 0)/100).toLocaleString('en-US',{style:'currency',currency:(group.currency||'USD').toUpperCase()})}</Text>
              <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                  <Calendar width={16} height={16} color="#6B7280" />
                  <Text style={styles.metaText}>{group.created_at ? new Date(group.created_at).toLocaleDateString('en-US', { month: 'numeric', day: '2-digit', year: 'numeric' }) : '-'}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Users width={16} height={16} color="#6B7280" />
                  <Text style={styles.metaText}>{`${Math.max(1, Number(summary?.memberCount || 0))}/${Number(group.size || 0)}`}</Text>
                </View>
                <View style={styles.metaItem}>
                  <DollarSign width={16} height={16} color="#6B7280" />
                  <Text style={styles.metaText}>
                    {(group.contribution_amount_cents/100).toLocaleString('en-US',{style:'currency',currency:(group.currency||'USD').toUpperCase()})} / mth
                  </Text>
                </View>
              </View>

            </>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {group?.description || 'No description provided.'}
          </Text>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent activities</Text>
          <Text style={styles.sectionSubtitle}>Here are your recent activities across your group.</Text>
          {activitiesLoading ? (
            <View style={{ paddingVertical: 16 }}>
              {[1,2,3].map(i => (
                <View key={i} style={styles.activityItem}>
                  <View style={styles.avatar}><View style={{flex:1,backgroundColor:'#E5E7EB',borderRadius:20}} /></View>
            <View style={styles.activityInfo}>
                    <View style={{ width: 120, height: 14, backgroundColor: '#E5E7EB', borderRadius: 6, marginBottom: 6 }} />
                    <View style={{ width: 80, height: 12, backgroundColor: '#E5E7EB', borderRadius: 6 }} />
                  </View>
                  <View style={styles.amountInfo}>
                    <View style={{ width: 72, height: 14, backgroundColor: '#E5E7EB', borderRadius: 6, marginBottom: 6 }} />
                    <View style={{ width: 80, height: 12, backgroundColor: '#E5E7EB', borderRadius: 6 }} />
                  </View>
                </View>
              ))}
            </View>
          ) : activities.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 32 }}>
              <View style={{ width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Clock width={36} height={36} color="#9CA3AF" />
              </View>
              <Text style={{ color: '#6B7280', textAlign: 'center' }}>You currently have no{"\n"}recent activities.</Text>
            </View>
          ) : (
            <>
              {activities.map((a, idx) => {
                const isCredit = String(a.direction) === 'credit'
                const amountStr = (Number(a.amount_cents || 0)/100).toLocaleString('en-US',{ style:'currency', currency: (a.currency||'USD').toUpperCase() })
                const timeStr = new Date(a.occurred_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                const subtitle = a.source === 'deposit' ? 'Deposited' : (a.source === 'rotation_payout' ? 'Collected' : (isCredit ? 'Credited' : 'Debited'))
                const avatar = a.avatar_url || femaleAvatarUrl
                const name = a.person_name || 'Member'
                const activityPayload = {
                  person: name,
                  avatar_url: a.avatar_url || null,
                  type: subtitle.toLowerCase().includes('collect') ? 'collection' : (subtitle.toLowerCase().includes('deposit') ? 'deposit' : 'other'),
                  amount_cents: a.amount_cents,
                  currency: a.currency,
                  occurred_at: a.occurred_at,
                  source: a.source,
                  direction: a.direction,
                  group_name: groupName,
                }
                return (
                  <TouchableOpacity key={idx} style={styles.activityItem} onPress={() => (navigation as any).navigate('ActivityDetail' as any, { activity: activityPayload } as any)}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                    <View style={styles.activityInfo}>
                      <Text style={styles.personName}>{name}</Text>
                      <Text style={styles.actionText}>{subtitle}</Text>
            </View>
            <View style={styles.amountInfo}>
                      <Text style={[styles.amountPositive]}>{amountStr}</Text>
                      <Text style={styles.timeText}>{timeStr}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
              <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllActivities}>
                <Text style={styles.viewAllText}>View all activities</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Group members section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Group members</Text>
          <Text style={styles.sectionSubtitle}>Meet the members of your savings circle.</Text>
          <TouchableOpacity style={styles.memberItem} onPress={handleViewAllMembers}>
            <View style={styles.memberLeft}>
              <Image source={{ uri: summary?.profile_image_url || femaleAvatarUrl }} style={styles.memberAvatar} />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{summary?.owner_name || 'You'}</Text>
              <Text style={styles.memberRole}>Group Admin</Text>
          </View>
            <ChevronRight width={18} height={18} color="#4B5563" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.invitePill} onPress={handleInviteMember}>
            <Text style={styles.invitePillText}>Invite member</Text>
          </TouchableOpacity>
        </View>

        {/* Invite Member Bottom Sheet */}
        <Modal
          isVisible={isBottomSheetVisible}
          onBackdropPress={() => setBottomSheetVisible(false)}
          backdropOpacity={0.4}
          style={styles.modal}
          animationIn="slideInUp"
          animationOut="slideOutDown"
        >
          <View style={styles.bottomSheet}>
            <View style={styles.titleContainer}>
              <Text style={styles.bottomSheetTitle}>Invite member</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setBottomSheetVisible(false)}>
                <X color="#000" size={20} />
              </TouchableOpacity>
            </View>
            <View style={styles.bodyContainer}>
              <Text style={styles.bottomSheetSubtitle}>Invite members to your group</Text>
              <View style={styles.inviteDescription}>
                <Text style={styles.inviteText}>• Bring your circle together, invite friends to join and start saving as a team.</Text>
                <Text style={styles.inviteText}>• Invite friends, family, or contacts you trust to contribute and follow through.</Text>
                <Text style={styles.inviteText}>• Make sure you don’t exceed the group’s maximum member limit.</Text>
              </View>
              {/* Invite form */}
              <View style={{ gap: 8, marginBottom: 12 }}>
                <Text style={{ fontSize: 12, color: '#3B3B3B' }}>Email</Text>
                <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 8 }}>
                  <TextInput
                    style={{ paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 }}
                    placeholder="member@example.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={inviteEmail}
                    onChangeText={setInviteEmail}
                  />
                </View>
                <Text style={{ fontSize: 12, color: '#3B3B3B' }}>Phone (optional)</Text>
                <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 8 }}>
                  <TextInput
                    style={{ paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 }}
                    placeholder="+1 555 555 5555"
                    keyboardType="phone-pad"
                    value={invitePhone}
                    onChangeText={setInvitePhone}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.inviteSendButton, inviting && { opacity: 0.6 }]}
                  onPress={async () => {
                    try {
                      setInviting(true);
                      await apiPost(`/api/groups/${groupId}/invites`, { email: inviteEmail || null, phone: invitePhone || null });
                      const inv = await apiGet(`/api/groups/${groupId}/invites?status=pending`).catch(()=>[]);
                      setPendingInvites(Array.isArray(inv?.data) ? inv.data : (Array.isArray(inv) ? inv : []));
                      setInviteEmail('');
                      setInvitePhone('');
                    } finally { setInviting(false); }
                  }}
                  disabled={inviting}
                >
                  <Text style={[styles.primaryButtonText, { color: '#fff' }]}>{inviting ? 'Sending...' : 'Send invite'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.sendInviteVia}>Send invite link via</Text>
            <View style={styles.socialIcons}>
              <View style={styles.socialIconContainer}>
                <TouchableOpacity style={styles.socialIcon}><Facebook color="#3358FF" size={24} /></TouchableOpacity>
                <Text style={styles.socialIconText}>Facebook</Text>
              </View>
              <View style={styles.socialIconContainer}>
                <TouchableOpacity style={styles.socialIcon}><Instagram color="#3358FF" size={24} /></TouchableOpacity>
                <Text style={styles.socialIconText}>Instagram</Text>
              </View>
              <View style={styles.socialIconContainer}>
                <TouchableOpacity style={styles.socialIcon}><X color="#3358FF" size={24} /></TouchableOpacity>
                <Text style={styles.socialIconText}>X</Text>
              </View>
              <View style={styles.socialIconContainer}>
                <TouchableOpacity style={styles.socialIcon}><MessageCircle color="#3358FF" size={24} /></TouchableOpacity>
                <Text style={styles.socialIconText}>WhatsApp</Text>
              </View>
              <View style={styles.socialIconContainer}>
                <TouchableOpacity style={styles.socialIcon}><Link2 color="#3358FF" size={24} /></TouchableOpacity>
                <Text style={styles.socialIconText}>Copy link</Text>
              </View>
            </View>
            {/* Pending invites */}
            <Text style={styles.sendInviteVia}>Pending invites</Text>
            <View style={{ gap: 10 }}>
              {pendingInvites.length === 0 ? (
                <Text style={{ color: '#7E7E7E', fontSize: 12 }}>No pending invites.</Text>
              ) : (
                pendingInvites.map((inv: any) => (
                  <View key={inv.invite_code} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 }}>
                    <Text style={{ color: '#1E1E1E', fontSize: 12 }}>{inv.invited_email || inv.invited_phone || inv.invite_code}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity onPress={async () => {
                        await apiPost('/api/groups/invites/revoke', { invite_code: inv.invite_code });
                        const iv = await apiGet(`/api/groups/${groupId}/invites?status=pending`).catch(()=>[]);
                        setPendingInvites(Array.isArray(iv?.data) ? iv.data : (Array.isArray(iv) ? iv : []));
                      }}>
                        <Text style={{ color: '#B91C1C', fontSize: 12 }}>Revoke</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </Modal>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.inviteMemberButton} onPress={handleInviteMember}>
            <Text style={styles.secondaryButtonText}>Invite member</Text>
          </TouchableOpacity>
          {group?.status === 'draft' ? (
            <TouchableOpacity style={styles.primaryButton} onPress={handleActivate}>
              <Text style={styles.primaryButtonText}>{activating ? 'Activating...' : 'Activate group'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.primaryButton, paying && { opacity: 0.6 }]} onPress={handlePayContribution} disabled={paying}>
              <Text style={styles.primaryButtonText}>{paying ? 'Processing…' : 'Make a deposit'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: "relative"
  },
  headerContainer: {
    // zIndex: 1,
    // backgroundColor: "red"
  },
  gradientHeader: {
    backgroundColor: '#F0D4C7', // Adjusted background to match screenshot gradient
    paddingBottom: 60,
    paddingTop: 20,
    marginBottom: 100
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
//   backButton: {
//     padding: 4,
//   },
  headerTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  emptyView: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingTop: 0,
  },
//   groupHeader: {
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     marginTop: -40,
//     marginBottom: 20,
//     zIndex: 2
//   },
  groupIconContainer: {
    position: 'absolute',
    marginBottom: 16,
    borderWidth: 15,
    borderColor: "white",
    borderRadius: 999,
    left: 20,
    top: 90
    // zIndex: 1,
  },
  groupIcon: {
    width: 90,
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupIconImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  iconBadge: {
    width: 30,
    height: 30,
    backgroundColor: '#F4A460', // Sandy brown for the badge
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
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    backgroundColor: '#000000',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 2,
    // borderColor: '#ffffff',
  },
  groupInfo: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    position: "absolute",
    right: 15,
    top: 150,
  },
  groupStatusContainer: {
    backgroundColor: '#DEFFBF',
    alignItems: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  openBadge: {
    backgroundColor: '#E7F8EE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  openBadgeText: {
    color: '#0B7A38',
    fontSize: 12,
  },
  closedBadge: {
    backgroundColor: '#FFE4E6',
  },
  closedBadgeText: {
    color: '#B91C1C',
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#1C1C1C',
    marginBottom: 12,
  },
  groupStatus: {
    fontSize: 14,
    color: '#007828',
  },
  body: {
    paddingHorizontal: 20
  },
  amount: {
    fontSize: 24,
    fontWeight: '500',
    color: '#1E1E1E',
    textAlign: 'left',
    marginBottom: 16,
  },
  skelAmount: { width: 160, height: 24, backgroundColor: '#E5E7EB', borderRadius: 6, marginBottom: 16 },
  skelIcon: { width: 16, height: 16, backgroundColor: '#E5E7EB', borderRadius: 8 },
  skelBarSmall: { width: 80, height: 12, backgroundColor: '#E5E7EB', borderRadius: 6 },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 24,
    marginBottom: 32,
    // paddingHorizontal: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1C',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#928F8B',
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: '#9A9A9A',
    lineHeight: 20,
  },
  pickupInfo: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#CACACA",
    borderStyle: "dashed"
  },
  pickupLabel: {
    fontSize: 10,
    color: '#9A9A9A',
    marginBottom: 12,
    // alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",

  },
  pickupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25
  },
  pickupAvatar: {
    width: 24,
    height: 24,
    borderRadius: 16,
    marginRight: 12,
  },
  pickupName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4D4845',
    flex: 1,
  },
  pickupDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,

  },
  pickupDate: {
    fontSize: 12,
    color: '#4D4845',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  actionText: {
    fontSize: 12,
    color: '#6B7280',
  },
  amountInfo: {
    alignItems: 'flex-end',
  },
  amountPositive: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  memberLeft: {
    position: 'relative',
    marginRight: 12,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    backgroundColor: '#10B981',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 12,
    color: '#6B7280',
  },
  viewAllButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4D4845',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#ffffff',
    // borderTopWidth: 1,
    // borderTopColor: '#F3F4F6',
  },
  inviteButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  inviteButtonText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#1E1E1E',
  },
  invitePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12
  },
  invitePillText: {
    color: '#4B5563',
    fontSize: 14,
  },
  depositButton: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  depositButtonText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#ffffff',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  closeButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight: 16,
    borderWidth: 1,
    borderColor: "#CACACA"
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: "#4D4845"
  },
  bodyContainer: {
    backgroundColor: '#F2F2F2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16
  },
  bottomSheetSubtitle: {
    fontSize: 14,
    color: '#3B3B3B',
    marginBottom: 8,
    textAlign: 'left'
  },
  inviteDescription: {
    marginBottom: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#EBEBEB",
    paddingTop: 10
  },
  inviteText: {
    fontSize: 14,
    color: '#5D5D5D',
    marginBottom: 4,
  },
  sendInviteVia: {
    fontSize: 14,
    color: '#3B3B3B',
    textAlign: 'left',
    fontWeight: "500",
    marginBottom: 12,
    marginTop: 12
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: 8,
    paddingBottom: 15
  },
  socialIconContainer: {
    alignItems: 'center',
    // marginHorizontal: 4
  },
  socialIcon: {
    backgroundColor: '#E2E7FF',
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  socialIconText: {
    color: '#000000',
    fontSize: 12,
    textAlign: 'center'
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#ffffff',
    // borderTopWidth: 1,
    // borderTopColor: '#F3F4F6',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteSendButton: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    // height: 32,
  },
  primaryButtonText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#ffffff',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  inviteMemberButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#1E1E1E',
  },
});
