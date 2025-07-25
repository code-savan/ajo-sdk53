import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type RecentActivitiesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Avatar image URLs
const femaleAvatarUrl = "https://images.unsplash.com/photo-1543085784-0b3c85b4e8ac?q=80&w=987";
const maleAvatarUrl = "https://images.unsplash.com/photo-1614248793396-944d024ec422?q=80&w=1064";

export default function RecentActivitiesScreen() {
  const navigation = useNavigation<RecentActivitiesScreenNavigationProp>();

  const handleGoBack = () => {
    navigation.goBack();
  };
  
  const handleActivityPress = (person: string, type: string, amount: string) => {
    navigation.navigate('ActivityDetail', {
      activity: { person, type, amount }
    });
  };

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
        <Text style={styles.title}>Recent activities</Text>
          <Text style={styles.subtitle}>Here are your recent activities across your group.</Text>

          {/* Debbie - First transaction */}
          <TouchableOpacity 
            style={styles.activityItem}
            onPress={() => handleActivityPress('Debbie', 'deposit', '100')}
          >
            <Image source={{ uri: femaleAvatarUrl }} style={styles.avatar} />
            <View style={styles.activityInfo}>
              <Text style={styles.personName}>Debbie</Text>
              <Text style={styles.actionText}>Deposited</Text>
            </View>
            <View style={styles.amountInfo}>
              <Text style={styles.amountPositive}>$100.0</Text>
              <Text style={styles.timeText}>12:45pm</Text>
            </View>
          </TouchableOpacity>

          {/* Debbie - Second transaction */}
          <TouchableOpacity 
            style={styles.activityItem}
            onPress={() => handleActivityPress('Debbie', 'deposit', '100')}
          >
            <Image source={{ uri: femaleAvatarUrl }} style={styles.avatar} />
            <View style={styles.activityInfo}>
              <Text style={styles.personName}>Debbie</Text>
              <Text style={styles.actionText}>Deposited</Text>
            </View>
            <View style={styles.amountInfo}>
              <Text style={styles.amountPositive}>$100.0</Text>
              <Text style={styles.timeText}>12:45pm</Text>
            </View>
          </TouchableOpacity>

          {/* Angus transaction */}
          <TouchableOpacity 
            style={styles.activityItem}
            onPress={() => handleActivityPress('Angus', 'collection', '1500')}
          >
            <Image source={{ uri: maleAvatarUrl }} style={styles.avatar} />
            <View style={styles.activityInfo}>
              <Text style={styles.personName}>Angus</Text>
              <Text style={styles.actionText}>Collected</Text>
            </View>
            <View style={styles.amountInfo}>
              <Text style={styles.amountPositive}>$1500</Text>
              <Text style={styles.timeText}>1/6/2025</Text>
            </View>
          </TouchableOpacity>

          {/* System deposit transaction */}
          <TouchableOpacity 
            style={styles.activityItem}
            onPress={() => handleActivityPress('System', 'deposit', '100')}
          >
            <View style={styles.circleIcon}>
              <ChevronDown color="#4D4845" size={24} />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.personName}>Deposit</Text>
              <Text style={styles.actionText}>Contribution</Text>
            </View>
            <View style={styles.amountInfo}>
              <Text style={styles.amountNegative}>$100.0</Text>
              <Text style={styles.timeText}>12:45pm</Text>
            </View>
          </TouchableOpacity>

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
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: '#F2F2F2',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  circleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#F4F4F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#4D4845',
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#928F8B',
    fontWeight: '400',
  },
  amountInfo: {
    alignItems: 'flex-end',
  },
  amountPositive: {
    fontSize: 16,
    fontWeight: '500',
    color: '#04A73E',
    marginBottom: 4,
  },
  amountNegative: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF6262',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#928F8B',
  },
});
