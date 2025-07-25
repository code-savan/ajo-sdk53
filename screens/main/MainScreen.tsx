import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Calendar, Users, Plus, ChevronDown, ChevronUp, ChevronRight, DollarSign } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import BottomNavigation from '../../components/BottomNavigation';

const avatarImageUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1480";

export default function MainScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Welcome, Alex.</Text>
          <TouchableOpacity onPress={handleNotificationsPress}>
            <Bell color="#111827" size={24} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>Credit score health: <Text style={styles.goodText}>Good.</Text></Text>
            <TouchableOpacity>
              <Text style={styles.viewInfoText}>View info</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardInfo}>

          <Text style={styles.expectedAmountLabel}>Expected Amount</Text>
          <Text style={styles.expectedAmount}>$3,500.00</Text>
          </View>
          <View style={styles.cardBottom}>
          <View style={styles.divider} />
          <View style={styles.cardFooter}>
            <View style={styles.nextPickDate}>
              <Calendar color="#3358FF" size={16} />
              <Text style={styles.nextPickDateText}>Next Pick: 1/07/2025</Text>
            </View>
            <View style={styles.groupImages}>
              {[0, 1, 2].map((_, index) => (
                <Image key={index} source={{uri: avatarImageUrl}} style={[styles.groupImage, { marginLeft: index > 0 ? -10 : 0 }]} />
              ))}
              <Text style={styles.groupCount}>3 Groups</Text>
            </View>
          </View>
          </View>
        </View>

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My groups</Text>
          <Text style={styles.sectionSubtitle}>Stay in the loop. View all your groups.</Text>

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
            {/* Hawaii Vacation Group */}
            <View style={styles.groupItem}>
              <View style={styles.groupContent}>
                <View style={styles.groupIcon}>
                  {/* Simple map-like background with coin icon */}
                  <View style={styles.groupIconBg}>
                    <View style={styles.iconBadge}>
                      <Text style={styles.iconBadgeText}>5</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.groupInfo}>
                  <Text style={styles.groupTitle}>Hawaii Vacation</Text>
                  <Text style={styles.groupAmount}>$1,500.00</Text>
                  <View style={styles.groupMeta}>
                    <View style={styles.metaItem}>
                      <Calendar width={16} height={16} color="#2563eb" />
                      <Text style={styles.metaText}>1/07/2025</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Users width={16} height={16} color="#2563eb" />
                      <Text style={styles.metaText}>15</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <DollarSign width={16} height={16} color="#2563eb" />
                      <Text style={styles.metaText}>$100 / mnth</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Cooking Fees Group */}
            <View style={styles.groupItem}>
              <View style={styles.groupContent}>
                <View style={styles.groupIcon}>
                  <View style={styles.groupIconBg}>
                    <View style={styles.iconBadge}>
                      <Text style={styles.iconBadgeText}>5</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.groupInfo}>
                  <Text style={styles.groupTitle}>Cooking Fees</Text>
                  <Text style={styles.groupAmount}>$1,000.00</Text>
                  <View style={styles.groupMeta}>
                    <View style={styles.metaItem}>
                      <Calendar width={16} height={16} color="#2563eb" />
                      <Text style={styles.metaText}>1/07/2025</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Users width={16} height={16} color="#2563eb" />
                      <Text style={styles.metaText}>10</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <DollarSign width={16} height={16} color="#2563eb" />
                      <Text style={styles.metaText}>$100 / mnth</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* TV Prep Group */}
            <View style={styles.groupItem}>
              <View style={styles.groupContent}>
                <View style={styles.groupIcon}>
                  <View style={styles.groupIconBg}>
                    <View style={styles.iconBadge}>
                      <Text style={styles.iconBadgeText}>5</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.groupInfo}>
                  <Text style={styles.groupTitle}>TV Prep</Text>
                  <Text style={styles.groupAmount}>$1,000.00</Text>
                  <View style={styles.groupMeta}>
                    <View style={styles.metaItem}>
                      <Calendar width={16} height={16} color="#2563eb" />
                      <Text style={styles.metaText}>1/07/2025</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Users width={16} height={16} color="#2563eb" />
                      <Text style={styles.metaText}>10</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <DollarSign width={16} height={16} color="#2563eb" />
                      <Text style={styles.metaText}>$100 / mnth</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* View All Groups Button */}
            <TouchableOpacity style={styles.viewAllGroupsButton} onPress={handleViewAllGroups}>
              <Text style={styles.viewAllGroupsText}>View all groups</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent activities</Text>
          <Text style={styles.sectionSubtitle}>Here are your recent activities across your group.</Text>

          <TouchableOpacity
            style={styles.transaction}
            onPress={() => handleActivityPress('System', 'deposit', '100')}
          >
            <View style={styles.transactionIconContainer}>
              <ChevronDown width={24} height={24} color="#4D4845" />
            </View>
            <View style={styles.transactionInfo}>
              <View>
                <Text style={styles.transactionName}>Deposit</Text>
                <Text style={styles.transactionType}>Contribution</Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionAmount}>$100.0</Text>
                <Text style={styles.transactionTime}>12:45pm</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.transaction}
            onPress={() => handleActivityPress('Angus', 'collection', '1000')}
          >
            <View style={styles.transactionIconContainer}>
              <ChevronUp width={24} height={24} color="#4D4845" />
            </View>
            <View style={styles.transactionInfo}>
              <View>
                <Text style={styles.transactionName}>Pickup</Text>
                <Text style={styles.transactionType}>Contribution</Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={[styles.transactionAmount, styles.positive]}>$1000</Text>
                <Text style={styles.transactionTime}>Yesterday</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.transaction}
            onPress={() => handleActivityPress('System', 'withdrawal', '19.99')}
          >
            <View style={styles.transactionIconContainer}>
              <ChevronDown width={24} height={24} color="#4D4845" />
            </View>
            <View style={styles.transactionInfo}>
              <View>
                <Text style={styles.transactionName}>Withdrawal</Text>
                <Text style={styles.transactionType}>Wallet</Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionAmount}>$19.99</Text>
                <Text style={styles.transactionTime}>Feb 11</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllActivities}>
            <Text style={styles.viewAllText}>View all activities</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 24,
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
