import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Users, DollarSign } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type AllGroupsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function AllGroupsScreen() {
  const navigation = useNavigation<AllGroupsScreenNavigationProp>();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft color="#000000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My groups</Text>
        {/* <View style={styles.emptyView} /> */}
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
        <Text style={styles.title}>My groups</Text>
          <Text style={styles.subtitle}>Stay in the loop. View all your groups.</Text>

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
