import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Lock, LogOut } from 'lucide-react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useAuth as useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LogoutMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function LogoutMenu({ visible, onClose }: LogoutMenuProps) {
  // const { signOut } = useAuth();
  const { signOut } = useSupabaseAuth();
  const lockApp = () => {};
  const navigation = useNavigation();

  const handleLockApp = () => {
    // Set app_unlocked to false
    lockApp();
    
    // Close menu
    onClose();
    
    // Navigate to LockGate
    navigation.reset({
      index: 0,
      routes: [{ name: 'LockGate' as never }],
    });
  };

  const handleFullSignOut = () => {
    Alert.alert(
      'Sign Out',
      'This will sign you out completely. You will need to verify your email again to sign back in.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // Sign out from Clerk
              await signOut();
              
              // Keep stored_email for convenience but clear app_unlocked
              await AsyncStorage.setItem('@ajo/app_unlocked', 'false');
              
              // Close menu
              onClose();
              
              // Navigate to Email OTP
              navigation.reset({
                index: 0,
                routes: [{ name: 'EmailOTP' as never }],
              });
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.menu}>
          <Text style={styles.menuTitle}>Sign out options</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLockApp}
          >
            <Lock size={20} color="#000" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Lock app</Text>
              <Text style={styles.menuItemDescription}>
                Quick lock. Your session remains active.
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemLast]}
            onPress={handleFullSignOut}
          >
            <LogOut size={20} color="#D73527" />
            <View style={styles.menuItemContent}>
              <Text style={[styles.menuItemTitle, styles.signOutText]}>
                Full sign out
              </Text>
              <Text style={styles.menuItemDescription}>
                End your session. Email verification required to sign back in.
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menu: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 24,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 16,
  },
  menuItemLast: {
    borderBottomWidth: 0,
    marginBottom: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  signOutText: {
    color: '#D73527',
  },
  cancelButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    marginTop: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
});
