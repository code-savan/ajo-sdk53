import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Users } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import Modal from 'react-native-modal';
import * as Clipboard from 'expo-clipboard';

export default function GroupCreatedScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleGoBack = () => {
    navigation.navigate('MainTabs', { screen: 'Groups' });
  };

  const handleInviteMembers = async () => {
    try {
      // In a real app, this would be a unique group invite link
      await Clipboard.setStringAsync('https://ajo.app/join/12345');
      setBottomSheetVisible(true);
      setCopySuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setCopySuccess(false);
        setBottomSheetVisible(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.successContent}>
          <Text style={styles.title}>Group Created</Text>
          <Text style={styles.subtitle}>
            Your group is ready! Invite members and start saving together.
          </Text>

          <TouchableOpacity
            style={styles.inviteButton}
            onPress={handleInviteMembers}
          >
            <Users width={16} height={16} color="#000000" style={styles.inviteIcon} />
            <Text style={styles.inviteButtonText}>Invite members</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet for Invite Link Copied */}
      <Modal
        isVisible={isBottomSheetVisible}
        onBackdropPress={() => setBottomSheetVisible(false)}
        backdropOpacity={0.4}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={styles.bottomSheet}>
          <Text style={styles.bottomSheetTitle}>
            Group invite link copied to clipboard!
          </Text>
          <Text style={styles.bottomSheetSubtitle}>
            Share this link with friends to invite them to your group.
          </Text>
        </View>
      </Modal>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  successContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    fontWeight: "400"
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F4',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    // borderWidth: 1,
    // borderColor: '#E5E5E5',
  },
  inviteIcon: {
    marginRight: 8,
  },
  inviteButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4D4845',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  bottomSheetSubtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});
