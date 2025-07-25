import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react-native';

// Define navigation prop types
interface SupportHelpScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'SupportHelp'>;
}

const SupportHelpScreen: React.FC<SupportHelpScreenProps> = ({ navigation }) => {
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePrivacyPolicyPress = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const handleTermsConditionsPress = () => {
    navigation.navigate('TermsConditions');
  };

  const handleContactSupportPress = () => {
    // Open email client or in-app chat support
    console.log('Contact Support pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Support & Help</Text>
      </View>

      <Text style={styles.description}>
        Need assistance? Find answers or contact our support team.
      </Text>

      <TouchableOpacity style={styles.option} onPress={handlePrivacyPolicyPress}>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Privacy Policy</Text>
          <Text style={styles.optionDescription}>We respect your privacy. See how your data is handled and safeguarded.</Text>
        </View>
        <ChevronRight color={"#4D4845"} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={handleTermsConditionsPress}>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Terms & Conditions</Text>
          <Text style={styles.optionDescription}>Understand the rules and responsibilities for using this app.</Text>
        </View>
        <ChevronRight color={"#4D4845"} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={handleContactSupportPress}>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Contact Support</Text>
          <Text style={styles.optionDescription}>Reach out to our support team for quick help and guidance.</Text>
        </View>
        <ExternalLink color={"#4D4845"} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginVertical: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  optionContent: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1E1E1E',
  },
  optionDescription: {
    fontSize: 12,
    color: '#928F8B',
    marginTop: 4,
  },
});

export default SupportHelpScreen;
