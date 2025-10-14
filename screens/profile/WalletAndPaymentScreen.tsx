import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import BottomNavigation from '../../components/BottomNavigation';
import { ChevronLeft } from 'lucide-react-native';

export default function WalletAndPaymentScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <ChevronLeft width={24} height={24} color="#4D4845" />
            </TouchableOpacity>
            <Text style={styles.title}>Wallet & Payment</Text>
            {/* <View style={styles.placeholderForAlignment} /> */}
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Manage your linked accounts, funding methods, and withdrawal settings.
            </Text>
          </View>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('LinkAccount' as never)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Manage linked account</Text>
              <Text style={styles.cardSubtitle}>Securely connect your bank or wallet to get started.</Text>
            </View>
            <Text style={{ color: '#4D4845' }}>›</Text>
          </TouchableOpacity>

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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80, // Add bottom padding to avoid content being hidden behind the navigation bar
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4D4845',
    textAlign: 'center',
  },
  placeholderForAlignment: {
    width: 24, // Same width as the back button for proper alignment
  },
  descriptionContainer: {
    marginBottom: 32,
  },
  description: {
    fontSize: 12,
    lineHeight: 20,
    fontWeight: "regular",
    color: '#303030',
  },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16 },
  cardTitle: { fontSize: 16, color: '#1C1C1C', marginBottom: 6 },
  cardSubtitle: { fontSize: 12, color: '#9CA3AF' },
});
