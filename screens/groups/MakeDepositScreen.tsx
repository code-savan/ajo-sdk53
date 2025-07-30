import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import Modal from 'react-native-modal';

export default function MakeDepositScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [amount, setAmount] = useState('$100');
  const [isModalVisible, setModalVisible] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleProceed = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleConfirmPayment = () => {
    setModalVisible(false);
    navigation.navigate('GroupFunded', {
      amount: amount,
      groupName: 'Hawaii Vacation'
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowLeft width={24} height={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fund Group</Text>
          {/* <View style={styles.headerSpacer} /> */}
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Fund a group</Text>
            <Text style={styles.subtitle}>
              Contribute now to avoid delays and maintain your group trust score.
            </Text>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Select group</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.input}>Hawaii Vacation</Text>
              <Text style={styles.inputNote}>Next payment date: 1/07/2025</Text>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Payment method</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.input}>Wallet</Text>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Enter amount</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="$100"
                keyboardType="decimal-pad"
                defaultValue="$100"
                onChangeText={(text) => setAmount(text.startsWith('$') ? text : `$${text}`)}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
            <Text style={styles.proceedButtonText}>Proceed</Text>
          </TouchableOpacity>
        </View>

        {/* Confirmation Modal */}
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={handleCloseModal}
          backdropOpacity={0.4}
          style={styles.modalContainer}
          animationIn="slideInUp"
          animationOut="slideOutDown"
        >
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Confirm Payment</Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <X width={24} height={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.sheetBody}>
              <View style={styles.sheetRow}>
                <Text style={styles.sheetLabel}>Group name</Text>
                <Text style={styles.sheetValue}>Hawaii Vacation</Text>
              </View>
              <View style={styles.sheetRow}>
                <Text style={styles.sheetLabel}>Contribution amount</Text>
                <Text style={styles.sheetValue}>{amount}</Text>
              </View>
              <View style={styles.sheetRow}>
                <Text style={styles.sheetLabel}>Payment method</Text>
                <Text style={styles.sheetValue}>Wallet</Text>
              </View>
              <View style={styles.sheetDivider} />
              <View style={styles.sheetRow}>
                <Text style={styles.sheetLabel}>Total amount</Text>
                <Text style={styles.sheetValue}>${parseFloat(amount.replace('$', '')).toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.confirmPaymentButton} onPress={handleConfirmPayment}>
              <Text style={styles.confirmPaymentButtonText}>Confirm payment</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 24,
    height: 24,
  },
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 80,
  },
  titleSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 12,
    color: '#928F8B',
    lineHeight: 24,
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
    borderColor: "#DCDCDC",
    borderStyle: "solid",
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '400',
  },
  inputNote: {
    fontSize: 12,
    color: '#928F8B',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  proceedButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  // Modal styles
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  sheetContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4D4845',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#CACACA"
  },
  sheetBody: {
    marginBottom: 24,
  },
  sheetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  sheetLabel: {
    fontSize: 12,
    color: '#9A9A9A',
    fontWeight: '500',
  },
  sheetValue: {
    fontSize: 12,
    color: '#4D4845',
    fontWeight: '500',
  },
  sheetDivider: {
    borderWidth: 1,
    borderColor: '#CACACA',
    borderStyle: 'dashed',
    marginVertical: 16,
    // backgroundColor: "red"
  },
  confirmPaymentButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmPaymentButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
