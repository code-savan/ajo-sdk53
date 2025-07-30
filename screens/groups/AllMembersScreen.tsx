import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight, Users, X, Calendar, DollarSign } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import Modal from 'react-native-modal';

type AllMembersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AllMembers'>;

// Member data with payment status
const allMembers = [
  {
    id: 1,
    name: 'Me',
    image: require('../../assets/images/me.png'),
    role: 'Member',
    hasPaid: true,
  },
  {
    id: 2,
    name: 'Marge',
    image: require('../../assets/images/user1.png'),
    role: 'Group Admin',
    hasPaid: true,
  },
  {
    id: 3,
    name: 'Debbie',
    image: require('../../assets/images/user2.png'),
    role: 'Member',
    hasPaid: true,
  },
  {
    id: 4,
    name: 'Victor',
    image: require('../../assets/images/user3.png'),
    role: 'Member',
    hasPaid: true,
  },
  {
    id: 5,
    name: 'Paul',
    image: require('../../assets/images/user4.png'),
    role: 'Member',
    hasPaid: false,
  },
  {
    id: 6,
    name: 'Frenkie',
    image: require('../../assets/images/user5.png'),
    role: 'Member',
    hasPaid: true,
  },
  {
    id: 7,
    name: 'Juniper',
    image: require('../../assets/images/user1.png'),
    role: 'Member',
    hasPaid: true,
  },
  {
    id: 8,
    name: 'Victor',
    image: require('../../assets/images/user2.png'),
    role: 'Member',
    hasPaid: true,
  },
  {
    id: 9,
    name: 'Sarah',
    image: require('../../assets/images/user3.png'),
    role: 'Member',
    hasPaid: true,
  },
  {
    id: 10,
    name: 'Louisa',
    image: require('../../assets/images/user4.png'),
    role: 'Member',
    hasPaid: false,
  },
  {
    id: 11,
    name: 'Jerome',
    image: require('../../assets/images/user5.png'),
    role: 'Member',
    hasPaid: true,
  },
  {
    id: 12,
    name: 'Uma',
    image: require('../../assets/images/user1.png'),
    role: 'Member',
    hasPaid: true,
  },
  {
    id: 13,
    name: 'Kate',
    image: require('../../assets/images/user2.png'),
    role: 'Member',
    hasPaid: true,
  },
  {
    id: 14,
    name: 'Hira',
    image: require('../../assets/images/user3.png'),
    role: 'Member',
    hasPaid: true,
  },
  {
    id: 15,
    name: 'Sam',
    image: require('../../assets/images/user4.png'),
    role: 'Member',
    hasPaid: true,
  },
  {
    id: 16,
    name: 'Norman',
    image: require('../../assets/images/user5.png'),
    role: 'Member',
    hasPaid: true,
  },
];

export default function AllMembersScreen() {
  const navigation = useNavigation<AllMembersScreenNavigationProp>();
  const [isGroupInfoVisible, setGroupInfoVisible] = useState(false);
  const [isMemberDetailsVisible, setMemberDetailsVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleViewGroupInfo = () => {
    setGroupInfoVisible(true);
  };

  const handleMemberPress = (member: any) => {
    setSelectedMember(member);
    setMemberDetailsVisible(true);
  };

  const currentUserMember = allMembers.find(m => m.name === 'Me');
  const otherMembers = allMembers.filter(m => m.name !== 'Me');
  const adminCount = allMembers.filter(m => m.role === 'Group Admin').length;
  const memberCount = allMembers.filter(m => m.role === 'Member').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft color="#000000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group members</Text>
        {/* <View style={styles.emptyView} /> */}
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Group Info Section */}
        <View style={styles.groupHeader}>
          <View style={styles.groupHeaderLeft}>
            <Text style={styles.groupTitle}>Group members</Text>
            <Text style={styles.groupSubtitle}>Meet the members of your savings circle.</Text>
          </View>
          <View style={styles.memberCountBadge}>
            <Users size={16} color="#3358FF" />
            <Text style={styles.memberCountText}>15</Text>
          </View>
        </View>

        {/* Current User Section */}
        {currentUserMember && (
          <TouchableOpacity style={styles.memberItem} onPress={() => handleMemberPress(currentUserMember)}>
            <View style={styles.memberLeft}>
              <Image source={currentUserMember.image} style={styles.memberAvatar} />
              {/* <View style={[styles.onlineIndicator, { backgroundColor: currentUserMember.hasPaid ? '#34A853' : '#EF4444' }]} /> */}
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{currentUserMember.name}</Text>
              <Text style={styles.memberRole}>{currentUserMember.role}</Text>
            </View>
            <ChevronRight size={20} color="#4D4845" />
          </TouchableOpacity>
        )}

        {/* Members Section Label */}
        <Text style={styles.sectionLabel}>Members</Text>

        {/* Other Members List */}
        <View style={styles.membersContainer}>
          {otherMembers.map((member) => (
            <TouchableOpacity key={member.id} style={styles.memberItem} onPress={() => handleMemberPress(member)}>
              <View style={styles.memberLeft}>
                <Image source={member.image} style={styles.memberAvatar} />
                <View style={[styles.onlineIndicator, { backgroundColor: member.hasPaid ? '#34A853' : '#FF4346' }]} />
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
              </View>
              <ChevronRight size={20} color="#4D4845" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Footer */}
        <View style={styles.summaryContainer}>
          <Users size={20} color="#3358FF" />
          <Text style={styles.summaryText}>
            {memberCount} members & {adminCount} Admin.
          </Text>
        </View>

        {/* View Group Info Button */}
        <TouchableOpacity style={styles.viewGroupButton} onPress={handleViewGroupInfo}>
          <Text style={styles.viewGroupButtonText}>View group info</Text>
        </TouchableOpacity>
        {/* Group Info Modal */}
        <Modal
          isVisible={isGroupInfoVisible}
          onBackdropPress={() => setGroupInfoVisible(false)}
          backdropOpacity={0.5}
          style={styles.modal}
        >
          <View style={styles.groupInfoSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.groupInfoTitle}>Group info</Text>
              <TouchableOpacity onPress={() => setGroupInfoVisible(false)}>
                <X color="#000" size={24} />
              </TouchableOpacity>
            </View>
            <View style={styles.statusContainer}>
              <View style={styles.statusItem}>
                <Text style={styles.statusText}>Paid Status</Text>
                <View style={styles.paidStatus} />
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusText}>Not paid Status</Text>
                <View style={styles.notPaidStatus} />
              </View>
            </View>
            <Text style={styles.groupInfoDescription}>
              Track who has paid and who’s yet to contribute in the current cycle. This helps keep the group accountable and ensures payouts are released fairly. Members who miss contributions may affect the group’s payout schedule.
            </Text>
            <Text style={styles.tipsTitle}>Tips</Text>
            <View style={styles.tipsContainer}>
              <Text style={styles.tip}>• Tap on a member to view their payment history and performance in past cycles.</Text>
              <Text style={styles.tip}>• Statuses update in real-time as members pay through linked methods.</Text>
              <Text style={styles.tip}>• You’ll receive a reminder if your payment is due soon or overdue.</Text>
            </View>
          </View>
        </Modal>
      </ScrollView>

      {/* Member Details Modal */}
      <Modal
        isVisible={isMemberDetailsVisible}
        onBackdropPress={() => setMemberDetailsVisible(false)}
        backdropOpacity={0.5}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        {selectedMember && (
          <View style={styles.memberDetailsSheet}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMemberDetailsVisible(false)}
            >
              <X color="#1E1E1E" size={20} />
            </TouchableOpacity>

            {/* Avatar and Name */}
            <View style={styles.memberDetailsHeader}>
              <Image source={selectedMember.image} style={styles.memberDetailsAvatar} />
              <Text style={styles.memberDetailsName}>{selectedMember.name}</Text>
              <Text style={styles.memberDetailsRole}>{selectedMember.role}</Text>
            </View>

            {/* Meta Info */}
            <View style={styles.memberMetaContainer}>
              <View style={styles.memberMetaItem}>
                <Calendar size={16} color="#3358FF" />
                <Text style={styles.memberMetaText}>1/09/2024</Text>
              </View>
              <View style={styles.memberMetaItem}>
                <Users size={16} color="#3358FF" />
                <Text style={styles.memberMetaText}>15</Text>
              </View>
              <View style={styles.memberMetaItem}>
                <DollarSign size={16} color="#3358FF" />
                <Text style={styles.memberMetaText}>$100 / mnth</Text>
              </View>
            </View>

            {/* Next Payment Card */}
            <View style={styles.nextPaymentCard}>
              <View>
                <Text style={styles.nextPaymentLabel}>Next payment is</Text>
                <Text style={styles.nextPaymentDate}>1/09/2025</Text>
              </View>
              <Calendar size={24} color="#5A5A5A" />
            </View>

            {/* Details Section */}
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Group name</Text>
                <Text style={styles.detailValue}>Hawaii Vacation</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Pickup date</Text>
                <Text style={styles.detailValue}>1/07/2025</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount contributed</Text>
                <Text style={styles.detailValue}>$100</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Contribution status</Text>
                <Text style={[styles.detailValue, { color: selectedMember.hasPaid ? '#34A853' : '#FF4346' }]}>
                  {selectedMember.hasPaid ? 'Paid' : 'Not Paid'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  groupHeaderLeft: {
    flex: 1,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  groupSubtitle: {
    fontSize: 12,
    color: '#928F8B',
    lineHeight: 20,
    fontWeight: '400',
  },
  memberCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: "#F2F2F2",
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12
  },
  memberCountText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4D4845',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E1E1E',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  membersContainer: {
    paddingHorizontal: 0,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  memberLeft: {
    position: 'relative',
    marginRight: 12,
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    // borderWidth: 3,
    // borderColor: '#ffffff',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4D4845',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 12,
    color: '#928F8B',
    fontWeight: '400',
  },
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 40,
    marginBottom: 32,
    backgroundColor: "#F2F2F2",
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
  },
  viewGroupButton: {
    backgroundColor: '#000000',
    marginHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewGroupButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  groupInfoSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  groupInfoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4D4845',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
    marginBottom: 24,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paidStatus: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#34D399',
  },
  notPaidStatus: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#4D4845',
  },
  groupInfoDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1E1E1E',
    lineHeight: 20,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4D4845',
    marginBottom: 16,
  },
  tipsContainer: {
    gap: 12,
  },
  tip: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1E1E1E',
    lineHeight: 20,
    marginBottom: 8,
  },
  memberDetailsSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 999,
    backgroundColor: '#fff',
    padding: 8,
    borderWidth: 1,
    borderColor: "#CACACA"
  },
  memberDetailsHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberDetailsAvatar: {
    width: 93,
    height: 93,
    borderRadius: 40,
    marginBottom: 16,
  },
  memberDetailsName: {
    fontSize: 24,
    fontWeight: '400',
    color: '#4D4845',
    marginBottom: 10,
  },
  memberDetailsRole: {
    fontSize: 12,
    fontWeight: '400',
    color: '#928F8B',
  },
  memberMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    alignSelf: "center",
    gap: 15
  },
  memberMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberMetaText: {
    fontSize: 12,
    color: '#4D4845',
    marginLeft: 5,
  },
  nextPaymentCard: {
    backgroundColor: '#FFE9E9',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  nextPaymentLabel: {
    fontSize: 14,
    color: '#4D4845',
    marginBottom: 4,
    fontWeight: '400',
  },
  nextPaymentDate: {
    fontSize: 12,
    fontWeight: '500',
    color: '#727272',
  },
  detailsSection: {
    paddingVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9A9A9A',
  },
  detailValue: {
    fontSize: 12,
    color: '#4D4845',
  },
  contributionPaid: {
    color: '#34A853',
  },
});
