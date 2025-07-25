import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type ActivityDetailRouteProps = RouteProp<RootStackParamList, 'ActivityDetail'>;
type ActivityDetailNavigationProp = StackNavigationProp<RootStackParamList>;

// Avatar image URLs
const femaleAvatarUrl = "https://images.unsplash.com/photo-1543085784-0b3c85b4e8ac?q=80&w=987";
const maleAvatarUrl = "https://images.unsplash.com/photo-1614248793396-944d024ec422?q=80&w=1064";

export default function ActivityDetailScreen() {
  const navigation = useNavigation<ActivityDetailNavigationProp>();
  const route = useRoute<ActivityDetailRouteProps>();
  const { activity } = route.params;

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Determine if this is a collection or deposit
  const isCollection = activity.type === 'collection';

  // Choose the correct avatar based on the person
  const avatarUrl = activity.person === 'Debbie' ? femaleAvatarUrl : maleAvatarUrl;

  // Set the correct badge text
  const badgeText = isCollection ? 'Collection' : 'Group funded';

  // Set the amount label
  const amountLabel = isCollection ? 'Collection amount' : 'Contribution amount';

  // Format the amount
  const formattedAmount = isCollection ? '$1500' : '$100';

  // Format the total amount
  const totalAmount = isCollection ? '$1500.00' : '$100.00';

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
          {/* User Profile */}
          <View style={styles.profileSection}>
            <Image source={{ uri: avatarUrl }} style={styles.profileImage} />
            <Text style={styles.userName}>{activity.person}</Text>
            <Text style={styles.userRole}>Member</Text>
          </View>

          {/* Activity Badge */}
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeText}</Text>
            </View>
          </View>

          {/* Amount */}
          <View style={styles.amountCard}>
            <Text style={styles.amount}>{formattedAmount}</Text>
            <Text style={styles.amountLabel}>{amountLabel}</Text>
          </View>

          {/* Activity Details */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Activity type</Text>
              <Text style={styles.detailValue}>{isCollection ? 'Collection' : 'Deposit'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Group name</Text>
              <Text style={styles.detailValue}>Hawaii Vacation</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date contributed</Text>
              <Text style={styles.detailValue}>12/05/25</Text>
            </View>
          </View>

          {/* Total Amount */}
          <View style={styles.totalCard}>
            <Text style={styles.detailLabel}>Total amount</Text>
            <Text style={styles.detailValue}>{totalAmount}</Text>
          </View>
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
    color: '#1C1C1C',
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
  profileSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '500',
    color: '#4D4845',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 12,
    color: '#928F8B',
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badge: {
    backgroundColor: '#111827',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  amountCard: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  amount: {
    fontSize: 40,
    fontWeight: '500',
    color: '#34A853',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 12,
    color: '#9A9A9A',
  },
  detailsCard: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  detailLabel: {
    fontSize: 12,
    color: '#9A9A9A',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4D4845',
  },
  totalCard: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 16,
    paddingVertical: 24,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
