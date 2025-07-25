import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ChevronLeft } from 'lucide-react-native';

// Define navigation prop types
interface PrivacyPolicyScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'PrivacyPolicy'>;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ navigation }) => {
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Privacy Policy</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Use of the App</Text>
          <Text style={styles.sectionContent}>
            You must be at least 18 years old and legally able to enter into contracts. You agree to use AJo only for lawful purposes and not for any fraudulent or harmful activity.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Security</Text>
          <Text style={styles.sectionContent}>
            You are responsible for maintaining the confidentiality of your account credentials. AJo is not liable for any loss resulting from unauthorized access to your account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contribution Groups</Text>
          <Text style={styles.sectionContent}>
            All contributions are voluntary. You acknowledge that group members must follow agreed payment schedules, and failure to do so may affect fund distribution.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wallet & Transactions</Text>
          <Text style={styles.sectionContent}>
            By funding your wallet, you authorize AJo to process payments using your linked bank or card provider. Withdrawals may be subject to verification or delays due to security checks.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fees & Charges</Text>
          <Text style={styles.sectionContent}>
            Some transactions may include a small processing fee. These will be disclosed before completion.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Changes to the App</Text>
          <Text style={styles.sectionContent}>
            We reserve the right to modify or discontinue features at any time without prior notice.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Termination</Text>
          <Text style={styles.sectionContent}>
            We may suspend or terminate your access if you violate these terms, engage in fraud, or misuse the app.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Governing Law</Text>
          <Text style={styles.sectionContent}>
            These terms are governed by the laws of the United States. Any disputes will be handled in the appropriate U.S. jurisdiction.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 12,
    lineHeight: 22,
    color: '#444',
  },
});

export default PrivacyPolicyScreen;
