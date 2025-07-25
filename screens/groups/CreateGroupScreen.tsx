import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

export default function CreateGroupScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [groupName, setGroupName] = useState('Hawaii Vacation');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupSize, setGroupSize] = useState('12');
  const [goalAmount, setGoalAmount] = useState('2400');
  const [contributionAmount, setContributionAmount] = useState('200');
  const [frequency, setFrequency] = useState('Monthly');
  const [showFrequencyOptions, setShowFrequencyOptions] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCreateGroup = () => {
    // Handle group creation logic here
    console.log('Creating group...');
    navigation.navigate('GroupCreated');
  };

  const selectFrequency = (selectedFrequency: string) => {
    setFrequency(selectedFrequency);
    setShowFrequencyOptions(false);
  };

  const calculateDuration = () => {
    const goal = parseFloat(goalAmount);
    const contribution = parseFloat(contributionAmount);
    if (goal && contribution) {
      const months = Math.ceil(goal / contribution);
      return `Duration: ${months} months`;
    }
    return 'Duration: -- months';
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft width={24} height={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create group</Text>
            {/* <View style={styles.headerSpacer} /> */}
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.titleSection}>
              <Text style={styles.title}>Create group</Text>
              <Text style={styles.subtitle}>
                Start a new savings circle by setting your rules, inviting members,
                and building toward your financial goals.
              </Text>
            </View>

            {/* Group Name */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Group name</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter group name"
                  value={groupName}
                  onChangeText={setGroupName}
                />
              </View>
            </View>

            {/* Group Description */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Group description</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Description"
                  value={groupDescription}
                  onChangeText={setGroupDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Group Size */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Group size</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter group size"
                  value={groupSize}
                  onChangeText={setGroupSize}
                  keyboardType="number-pad"
                />
              </View>
              <Text style={styles.hintText}>Min ~ 3 | Max ~ 30</Text>
            </View>

            {/* Contribution Details Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Contribution details</Text>
              <Text style={styles.sectionSubtitle}>
                Set how much each member will contribute and how often.
              </Text>
            </View>

            {/* Goal Amount */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Goal amount</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter goal amount"
                  value={goalAmount}
                  onChangeText={setGoalAmount}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* Contribution Amount */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Contribution amount</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter contribution amount"
                  value={contributionAmount}
                  onChangeText={setContributionAmount}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* Frequency */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Frequency</Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => {
                  setShowFrequencyOptions(!showFrequencyOptions);
                  Keyboard.dismiss();
                }}
              >
                <Text style={styles.input}>{frequency}</Text>
                <ChevronRight width={16} height={16} color="#000000" />
              </TouchableOpacity>

              {showFrequencyOptions && (
                <View style={styles.frequencyOptions}>
                  <TouchableOpacity
                    style={styles.frequencyOption}
                    onPress={() => selectFrequency('Weekly')}
                  >
                    <Text style={styles.frequencyOptionText}>Weekly</Text>
                  </TouchableOpacity>
                  <View style={styles.optionDivider} />
                  <TouchableOpacity
                    style={styles.frequencyOption}
                    onPress={() => selectFrequency('Monthly')}
                  >
                    <Text style={styles.frequencyOptionText}>Monthly</Text>
                  </TouchableOpacity>
                  <View style={styles.optionDivider} />
                  <TouchableOpacity
                    style={styles.frequencyOption}
                    onPress={() => selectFrequency('Quarterly')}
                  >
                    <Text style={styles.frequencyOptionText}>Quarterly</Text>
                  </TouchableOpacity>
                </View>
              )}

              <Text style={styles.durationText}>{calculateDuration()}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateGroup}
              >
                <Text style={styles.createButtonText}>Create group</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0,
  },
  backButton: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
//   headerSpacer: {
//     flex: 1,
//   },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
    // flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 120,
  },
  titleSection: {
    marginBottom: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#928F8B',
    lineHeight: 20,
    paddingRight: 20,
    fontWeight: '400',
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    color: '#4D4845',
    marginBottom: 8,
    fontWeight: '400',
  },
  inputContainer: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderColor: '#DCDCDC',
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textAreaContainer: {
    minHeight: 120,
    alignItems: 'flex-start',
  },
  input: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '400',
    flex: 1,
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  hintText: {
    fontSize: 11,
    color: '#928F8B',
    marginTop: 8,
    textAlign: 'right',
  },
  sectionHeader: {
    marginBottom: 24,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#928F8B',
    lineHeight: 20,
  },
  frequencyOptions: {
    position: 'absolute',
    top: 84,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    zIndex: 100,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  frequencyOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  frequencyOptionText: {
    fontSize: 14,
    color: '#000000',
  },
  optionDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  durationText: {
    fontSize: 11,
    color: '#928F8B',
    marginTop: 8,
    textAlign: 'right',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginTop: 40,
    marginBottom: 40,
  },
  createButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
