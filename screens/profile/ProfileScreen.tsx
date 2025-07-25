import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import BottomNavigation from '../../components/BottomNavigation';
import { ChevronRight, Trash2 } from 'lucide-react-native';

// Define the navigation type for this screen
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [pin, setPin] = React.useState('');

  const handleNotificationsPress = () => {
    navigation.navigate('NotificationSettings');
  };

  const handleAccountInfoPress = () => {
    navigation.navigate('AccountInfo');
  };

  const handleWalletPress = () => {
    navigation.navigate('WalletAndPayment');
  };

  const handleSecurityPress = () => {
    navigation.navigate('Security');
  };

  const handleSupportHelpPress = () => {
    navigation.navigate('SupportHelp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.settingsTitle}>Settings</Text>

          <View style={styles.profileContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=987' }}
              style={styles.profileImage}
            />
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>Dean Winchester</Text>
              <Text style={styles.profileEmail}>deanwinchester@gmail.com</Text>
            </View>

          </View>

          <TouchableOpacity style={styles.section} onPress={handleAccountInfoPress}>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Account Information</Text>
              <Text style={styles.sectionDescription}>Update your personal details, contact info, and preferences.</Text>
            </View>
            <ChevronRight color="#4D4845" size={24} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.section} onPress={handleWalletPress}>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Wallet & Payments</Text>
              <Text style={styles.sectionDescription}>Manage your linked accounts, funding methods, and withdrawal settings.</Text>
            </View>
            <ChevronRight color="#4D4845" size={24} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.section} onPress={handleSecurityPress}>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Security</Text>
              <Text style={styles.sectionDescription}>Control your PIN, biometric settings, and account protection options.</Text>
            </View>
            <ChevronRight color="#4D4845" size={24} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.section} onPress={handleNotificationsPress}>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Notification</Text>
              <Text style={styles.sectionDescription}>Customize how and when you receive app alerts and updates.</Text>
            </View>
            <ChevronRight color="#4D4845" size={24} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.section} onPress={handleSupportHelpPress}>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Support & Help</Text>
              <Text style={styles.sectionDescription}>Need assistance? Find answers or contact our support team.</Text>
            </View>
            <ChevronRight color="#4D4845" size={24} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.section}>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Legal & Compliance</Text>
              <Text style={styles.sectionDescription}>Review terms, privacy policy, and important legal documents.</Text>
            </View>
            <ChevronRight color="#4D4845" size={24} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.section}>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>App Info</Text>
              <Text style={styles.sectionDescription}>View the app version, update logs, and general application information.</Text>
            </View>
            <ChevronRight color="#4D4845" size={24} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.section} onPress={() => setShowDeleteModal(true)}>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Delete Account</Text>
              <Text style={styles.sectionDescription}>Permanently close your account and erase associated data.</Text>
            </View>
            <ChevronRight color="#4D4845" size={24} />
          </TouchableOpacity>

        </View>
      </ScrollView>
      <Modal
        visible={showDeleteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <Text style={styles.modalTitle}>Delete account</Text>
            <TouchableOpacity
              onPress={() => setShowDeleteModal(false)}
              style={styles.closeButton}
            >
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
      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 80,
    backgroundColor: '#fff',
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'medium',
    color: '#111827',
    marginBottom: 24,
    paddingHorizontal: 16
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 32,
    marginRight: 16,
  },
  profileTextContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  profileName: {
    fontSize: 14,
    fontWeight: 'medium',
    color: '#111827',
  },
  profileEmail: {
    fontSize: 12,
    color: '#928F8B',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'semibold',
    color: '#111827',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 12,
    color: '#928F8B',
  },
});
