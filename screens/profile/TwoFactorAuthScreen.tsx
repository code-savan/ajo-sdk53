import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Animated,
  Dimensions,
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

// Define navigation prop types
interface TwoFactorAuthScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'TwoFactorAuth'>;
}

// Sample security questions
const securityQuestions = [
  "What was the name of your first pet?",
  "In what city were you born?",
  "What is your mother's maiden name?",
  "What was the make of your first car?"
];

const TwoFactorAuthScreen: React.FC<TwoFactorAuthScreenProps> = ({ navigation }) => {
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(securityQuestions[0]);
  const [questionDropdownOpen, setQuestionDropdownOpen] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [savedQuestion, setSavedQuestion] = useState('');
  const [savedAnswer, setSavedAnswer] = useState('');

  // Get screen dimensions for modal sizing
  const { height: screenHeight } = Dimensions.get('window');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const toggleTfa = () => {
    setTfaEnabled((previousState) => !previousState);
    // If disabling 2FA, also reset the security question and answer
    if (tfaEnabled) {
      setSavedQuestion('');
      setSavedAnswer('');
    }
  };

  const handleSecurityQuestionPress = () => {
    if (tfaEnabled) {
      // Show the modal
      setModalVisible(true);
    }
  };

const closeBottomSheet = () => {
    setModalVisible(false);
  };

  const toggleDropdown = () => {
    setQuestionDropdownOpen(!questionDropdownOpen);
  };

  const selectQuestion = (question: string) => {
    setSelectedQuestion(question);
    setQuestionDropdownOpen(false);
  };

  const handleSaveQuestion = () => {
    // Dismiss keyboard first
    Keyboard.dismiss();

    // Save the security question and answer
    if (selectedQuestion && securityAnswer) {
      setSavedQuestion(selectedQuestion);
      setSavedAnswer(securityAnswer);
      closeBottomSheet();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Security / Two-Factor authentication</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Enable Two-Factor authentication</Text>
          <Switch
            onValueChange={toggleTfa}
            value={tfaEnabled}
            trackColor={{ false: '#F2F2F2', true: '#4D7FFA' }}
            thumbColor="#FFFFFF"
          />
        </View>
        <Text style={styles.sectionDescription}>
          Enable 2FA to receive a unique code via text or authenticator app each time you log in.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.securityQuestionContainer, !tfaEnabled && styles.disabledContainer]}
        onPress={handleSecurityQuestionPress}
        disabled={!tfaEnabled}
      >
        <View style={styles.securityQuestionContent}>
          <Text style={[styles.securityQuestionTitle, !tfaEnabled && styles.disabledText]}>
            Set a security question
          </Text>
          <Text style={[styles.securityQuestionDescription, !tfaEnabled && styles.disabledText]}>
            {savedQuestion
              ? `Question: ${savedQuestion.length > 30 ? savedQuestion.substring(0, 30) + '...' : savedQuestion}`
              : 'Choose a question only you can answer to help recover your account.'}
          </Text>
        </View>
        <ChevronRight color={tfaEnabled ? "#4D4845" : "#C0C0C0"} size={24} />
      </TouchableOpacity>

      {/* Security Question Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeBottomSheet}
      >
        <TouchableWithoutFeedback onPress={closeBottomSheet}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Set a security question</Text>
                  <TouchableOpacity onPress={closeBottomSheet} style={styles.closeButton}>
                    <Text style={styles.closeButtonIcon}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Select question</Text>
                    <TouchableOpacity
                      style={styles.selectInput}
                      onPress={toggleDropdown}
                    >
                      <Text style={styles.selectInputText}>{selectedQuestion}</Text>
                      <Text style={styles.selectArrow}>▼</Text>
                    </TouchableOpacity>

                    {questionDropdownOpen && (
                      <View style={styles.dropdownList}>
                        {securityQuestions.map((question, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[styles.dropdownItem, index === securityQuestions.length - 1 && styles.lastDropdownItem]}
                            onPress={() => selectQuestion(question)}
                          >
                            <Text style={styles.dropdownItemText}>{question}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  <View style={styles.answerContainer}>
                    <Text style={styles.inputLabel}>Your answer</Text>
                    <TextInput
                      style={styles.textInput}
                      value={securityAnswer}
                      onChangeText={setSecurityAnswer}
                      placeholder="Enter answer"
                      placeholderTextColor="#C0C0C0"
                    />
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.saveButton, !securityAnswer && styles.disabledButton]}
                    onPress={handleSaveQuestion}
                    disabled={!securityAnswer}
                  >
                    <Text style={styles.saveButtonText}>Save question</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    color: '#1C1C1C',
  },
  section: {
    marginTop: 30,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1E1E1E',
  },
  sectionDescription: {
    fontSize: 12,
    color: '#928F8B',
    lineHeight: 18,
  },
  securityQuestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  securityQuestionContent: {
    flex: 1,
    marginRight: 16,
  },
  securityQuestionTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1E1E1E',
  },
  securityQuestionDescription: {
    fontSize: 12,
    color: '#928F8B',
    marginTop: 4,
    lineHeight: 18,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#C0C0C0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    minHeight: 400,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1C',
  },

  bottomSheetContent: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  dropdownContainer: {
    backgroundColor: '#F2F2F2',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6B7280',
  },
  dropdownList: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 16,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333333',
  },
  input: {
    backgroundColor: '#F2F2F2',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#4D7FFA',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#333333',
    opacity: 0.5,
    borderRadius: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CACACA",
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  closeButtonIcon: {
    fontSize: 18,
    color: '#333333',
  },
  modalBody: {
    paddingHorizontal: 24,
    flex: 1,
  },
  inputContainer: {
    position: 'relative',
    zIndex: 1,
    marginBottom: 40,
  },
  answerContainer: {
    marginBottom: 80,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 12,
  },
  selectInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectInputText: {
    fontSize: 16,
    color: '#333333',
  },
  selectArrow: {
    fontSize: 14,
    color: '#666666',
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    padding: 18,
    fontSize: 16,
    color: '#333333',
  },
  saveButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 30,
    paddingVertical: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TwoFactorAuthScreen;
