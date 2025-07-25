import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ChevronRight, Calendar, Users, DollarSign } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import BottomNavigation from '../../components/BottomNavigation';

export default function GroupsScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  const handleViewAllGroups = () => {
    navigation.navigate('AllGroups');
  };
  
  const handleNotificationsPress = () => {
    navigation.navigate('Notifications');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Groups</Text>
          <View style={styles.notificationContainer}>
            <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationsPress}>
              <Bell width={24} height={24} color="#6b7280" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            {/* Active Groups Card */}
            <View style={styles.statCard}>
              <Text style={styles.statDescription}>
                Your total active groups{"\n"}at a glance.
              </Text>
              <Text style={styles.statNumber}>03</Text>
            </View>

            {/* Collections Card */}
            <View style={styles.statCard}>
              <Text style={styles.statDescription}>Total times you have{"\n"}collected.</Text>
              <Text style={styles.statNumber}>12</Text>
            </View>
          </View>

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
            <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllGroups}>
              <Text style={styles.viewAllText}>View all groups</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationButton: {
    padding: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
    height: 200,
    justifyContent: 'space-between',
  },
  statDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
  statNumber: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'right',
    lineHeight: 72,
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
  groupsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  groupsDescription: {
    fontSize: 12,
    color: '#928F8B',
    marginBottom: 16,
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
    fontWeight: '500',
    color: '#374151',
  },
});
