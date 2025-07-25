import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react-native';

// Define navigation prop types
interface SecurityScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Security'>;
}

const SecurityScreen: React.FC<SecurityScreenProps> = ({ navigation }) => {
  const [biometricsEnabled, setBiometricsEnabled] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [pin, setPin] = React.useState('');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const toggleBiometrics = () => {
    setBiometricsEnabled((previousState) => !previousState);
  };

  const handleChangePinPress = () => {
    navigation.navigate('ChangePin');
  };

  const handleTwoFactorAuthPress = () => {
    navigation.navigate('TwoFactorAuth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Security</Text>
      </View>

      <Text style={styles.description}>
        Control your PIN, biometric settings, and account protection options.
      </Text>

      <TouchableOpacity style={styles.option} onPress={handleChangePinPress}>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Change security pin</Text>
          <Text style={styles.optionDescription}>Set a 4-digit PIN to secure your account.</Text>
        </View>
        <ChevronRight color={"#4D4845"}  />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={handleTwoFactorAuthPress}>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Two-Factor authentication</Text>
          <Text style={styles.optionDescription}>Add an extra layer of security to your account login.</Text>
        </View>
        <ChevronRight color={"#4D4845"}  />
      </TouchableOpacity>

      <View style={styles.option}>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Enable biometrics</Text>
          <Text style={styles.optionDescription}>Enable/disable biometric authentication (Face/Touch ID)</Text>
        </View>
        <Switch
          onValueChange={toggleBiometrics}
          value={biometricsEnabled}
        />
      </View>

      <TouchableOpacity style={styles.option} onPress={() => setShowDeleteModal(true)}>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Delete Account</Text>
          <Text style={styles.optionDescription}>Permanently close your account and erase associated data.</Text>
        </View>
        <ChevronRight color={"#4D4845"} />
      </TouchableOpacity>

      <Modal
        visible={showDeleteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <Text style={styles.modalTitle}>Delete account</Text>
            <TouchableOpacity onPress={() => setShowDeleteModal(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.deleteIconContainer}>
              <View style={styles.deleteIconWrapper}>
                <Trash2 size={32} color="#D73527" />
              </View>
            </View>

            <Text style={styles.modalText}>Input pin to delete account</Text>

            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={setPin}
              placeholder="****"
              placeholderTextColor="#999"
              secureTextEntry={true}
              keyboardType="numeric"
              maxLength={4}
            />

            <TouchableOpacity
              style={styles.saveButton}
              disabled={pin.length !== 4}
            >
              <Text style={styles.saveButtonText}>Delete account</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    fontSize: 18,
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4D4845',
    marginBottom: 40,
    alignSelf: 'flex-start',
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
  closeButtonText: {
    fontSize: 16,
    color: '#6B6B6B',
    fontWeight: '500',
  },
  deleteIconContainer: {
    marginBottom: 30,
  },
  deleteIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FDD8D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#6B6B6B',
    marginBottom: 20,
    textAlign: 'left',
    alignSelf: 'flex-start',
    width: '100%',
  },
  pinInput: {
    width: '100%',
    height: 60,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    paddingHorizontal: 15,
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    color: '#1C1C1C',
  },
  saveButton: {
    width: '100%',
    height: 56,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default SecurityScreen;
