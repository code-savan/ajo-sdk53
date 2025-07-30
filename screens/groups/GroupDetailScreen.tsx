import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Users, DollarSign, Edit3, Pen, ChevronRight, X, Facebook, Instagram, MessageCircle, Copy, Link2 } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import Modal from 'react-native-modal';

type GroupDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GroupDetail'>;
type GroupDetailScreenRouteProp = RouteProp<RootStackParamList, 'GroupDetail'>;

// Avatar image URLs (reusing from RecentActivitiesScreen)
const femaleAvatarUrl = "https://images.unsplash.com/photo-1543085784-0b3c85b4e8ac?q=80&w=987";
const maleAvatarUrl = "https://images.unsplash.com/photo-1614248793396-944d024ec422?q=80&w=1064";
const maleAvatar2Url = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987";

export default function GroupDetailScreen() {
  const navigation = useNavigation<GroupDetailScreenNavigationProp>();
  const route = useRoute<GroupDetailScreenRouteProp>();
  
  // Extract parameters from route
  const { groupName, amount, memberCount, monthlyContribution, date } = route.params;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleViewAllActivities = () => {
    navigation.navigate('RecentActivities');
  };

  const handleViewAllMembers = () => {
    navigation.navigate('AllMembers');
  };

const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

  const handleInviteMember = () => {
    setBottomSheetVisible(true);
  };

  const handleMakeDeposit = () => {
    navigation.navigate('MakeDeposit');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      {/* Header with gradient background */}
      <View style={styles.headerContainer}>
        <View style={styles.gradientHeader}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleGoBack}
            // style={styles.backButton}
            >
              <ArrowLeft color="#000000" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Group details</Text>
            {/* <View style={styles.emptyView} /> */}
          </View>
          <View style={styles.groupIconContainer}>
            <View style={styles.groupIcon}>
              <Image source={require('../../assets/images/profile.png')} style={styles.groupIconImage} />
            </View>
            <TouchableOpacity style={styles.editIcon}>
              <Pen size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <View style={styles.groupInfo}>
            <Text style={styles.groupTitle}>{groupName}</Text>
            <View style={styles.groupStatusContainer}>
            <Text style={styles.groupStatus}>Group full</Text>
            </View>
          </View>
        </View>
      </View>

        {/* Group Icon and Info */}
        {/* <View style={styles.groupHeader}>
        </View> */}


        {/* Group Meta Info */}
        <View style={styles.body}>
        {/* Amount */}
        <Text style={styles.amount}>{amount}</Text>
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Calendar width={16} height={16} color="#6B7280" />
            <Text style={styles.metaText}>{date}</Text>
          </View>
          <View style={styles.metaItem}>
            <Users width={16} height={16} color="#6B7280" />
            <Text style={styles.metaText}>{memberCount}</Text>
          </View>
          <View style={styles.metaItem}>
            <DollarSign width={16} height={16} color="#6B7280" />
            <Text style={styles.metaText}>{monthlyContribution}</Text>
          </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            Save smart, travel better. This group helps members build up funds for a dream getaway to Hawaii — one contribution at a time.
          </Text>
        </View>

        {/* Next Pickup Info */}
        <View style={styles.pickupInfo}>
          <Text style={styles.pickupLabel}>Next Pickup info</Text>
          <View style={styles.pickupRow}>
            <Image source={{ uri: maleAvatar2Url }} style={styles.pickupAvatar} />
            <Text style={styles.pickupName}>Bryan Maddock</Text>
            <View style={styles.pickupDateContainer}>
              <Calendar width={16} height={16} color="#3358FF" />
              <Text style={styles.pickupDate}>1/07/2025</Text>
            </View>
          </View>
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
          </View>
        </Modal>

        {/* Recent Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent activities</Text>
          <Text style={styles.sectionSubtitle}>Here are your recent activities across your group.</Text>

          {/* Activity Items */}
          <View style={styles.activityItem}>
            <Image source={{ uri: femaleAvatarUrl }} style={styles.avatar} />
            <View style={styles.activityInfo}>
              <Text style={styles.personName}>Debbie</Text>
              <Text style={styles.actionText}>Deposited</Text>
            </View>
            <View style={styles.amountInfo}>
              <Text style={styles.amountPositive}>$100.0</Text>
              <Text style={styles.timeText}>12:45pm</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <Image source={{ uri: femaleAvatarUrl }} style={styles.avatar} />
            <View style={styles.activityInfo}>
              <Text style={styles.personName}>Debbie</Text>
              <Text style={styles.actionText}>Deposited</Text>
            </View>
            <View style={styles.amountInfo}>
              <Text style={styles.amountPositive}>$100.0</Text>
              <Text style={styles.timeText}>12:45pm</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <Image source={{ uri: maleAvatarUrl }} style={styles.avatar} />
            <View style={styles.activityInfo}>
              <Text style={styles.personName}>Angus</Text>
              <Text style={styles.actionText}>Collected</Text>
            </View>
            <View style={styles.amountInfo}>
              <Text style={styles.amountPositive}>$1500</Text>
              <Text style={styles.timeText}>1/6/2025</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllActivities}>
            <Text style={styles.viewAllText}>View all activities</Text>
          </TouchableOpacity>
        </View>

        {/* Group Members */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Group members</Text>
          <Text style={styles.sectionSubtitle}>Meet the members of your savings circle.</Text>

          {/* Member Items */}
          <View style={styles.memberItem}>
            <View style={styles.memberLeft}>
              <Image source={{ uri: femaleAvatarUrl }} style={styles.memberAvatar} />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>Marge</Text>
              <Text style={styles.memberRole}>Group Admin</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </View>

          <View style={styles.memberItem}>
            <View style={styles.memberLeft}>
              <Image source={{ uri: femaleAvatarUrl }} style={styles.memberAvatar} />
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>Debbie</Text>
              <Text style={styles.memberRole}>Member</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </View>

          <View style={styles.memberItem}>
            <View style={styles.memberLeft}>
              <Image source={{ uri: maleAvatar2Url }} style={styles.memberAvatar} />
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>Victor</Text>
              <Text style={styles.memberRole}>Member</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </View>

          <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllMembers}>
            <Text style={styles.viewAllText}>View all members</Text>
          </TouchableOpacity>
        </View>


      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.inviteButton} onPress={handleInviteMember}>
          <Text style={styles.inviteButtonText}>Invite member</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.depositButton} onPress={handleMakeDeposit}>
          <Text style={styles.depositButtonText}>Make a deposit</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    postion: "relative"
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
    justifyContent: "end",
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
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'start',
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
    alignSelf: 'start',
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
    fontWeight: "400",
    marginBottom: 15
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: 8,
    paddingVertical: 15
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
});
