import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Pressable, KeyboardAvoidingView, Platform, Keyboard, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ChevronLeft, Pencil } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGet, apiPut } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/SupabaseAuthContext';

type AccountInfoScreenProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

export default function AccountInfoScreen({ navigation }: AccountInfoScreenProps) {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{ name: string; code: string; dial: string; flag: string }>(COUNTRIES[0]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const normalized = toE164(selectedCountry.dial, phoneNumber);
      const updated = await apiPut('/api/users/profile', { full_name: fullName, phone: normalized });
      await AsyncStorage.setItem('profile_cache_v1', JSON.stringify(updated)).catch(()=>{});
      showToast({ message: 'Profile updated', variant: 'success' });
      navigation.goBack();
    } catch (e: any) {
      showToast({ message: 'Update failed', variant: 'error' });
    } finally { setSaving(false); }
  };

  // Set up keyboard listeners to track keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    // Clean up listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      const cached = await AsyncStorage.getItem('profile_cache_v1');
      if (cached) {
        try {
          const obj = JSON.parse(cached);
          setFullName(obj?.full_name || '');
          setEmail(obj?.email || '');
          setPhoneNumber(obj?.phone || '');
          setProfileImageUrl(obj?.profile_image_url || 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_11.png');
        } catch {}
      }
      const fresh = await apiGet('/api/users/profile').catch(()=>null);
      if (fresh) {
        setFullName(fresh?.full_name || '');
        setEmail(fresh?.email || '');
        setPhoneNumber(fresh?.phone || '');
        setProfileImageUrl(fresh?.profile_image_url || 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_11.png');
        await AsyncStorage.setItem('profile_cache_v1', JSON.stringify(fresh)).catch(()=>{});
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!avatarModalVisible) return;
    (async () => {
      try {
        const perm = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          const req = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!req.granted) {
            showToast({ message: 'Media library permission is required', variant: 'error' });
          }
        }
      } catch {}
    })();
  }, [avatarModalVisible]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <ChevronLeft color="#000" size={24} />
        </Pressable>
        <Text style={styles.headerText}>Account info</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 30}
        enabled={keyboardVisible}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollViewContent, keyboardVisible && styles.keyboardActiveContent]}>
        <Text style={styles.subHeader}>Update your personal details, contact info, and preferences.</Text>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: profileImageUrl || 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_11.png' }}
            style={styles.profileImage}
          />
          {uploadingAvatar && (
            <View style={styles.avatarLoadingOverlay}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          )}
          <TouchableOpacity style={styles.editIcon} onPress={() => setAvatarModalVisible(true)}>
            <Pencil color="#fff" size={16} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Full name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Mobile No.</Text>
        <View style={styles.phoneInputContainer}>
          <TouchableOpacity style={styles.countryCodeContainer} onPress={() => setCountryPickerVisible(true)}>
            <Text style={styles.flagEmoji}>{selectedCountry.flag}</Text>
            <Text style={styles.arrowDown}>▼</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={(t) => setPhoneNumber(t.replace(/[^0-9]/g, ''))}
          keyboardType="phone-pad"
        />
      </View>
      </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save changes</Text>
      </TouchableOpacity>

      {/* Avatar Picker Modal */}
      <Modal
        visible={avatarModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <View style={styles.modalOverlayAvatar}>
          <View style={styles.avatarSheet}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#1C1C1C' }}>Choose an avatar</Text>
              <TouchableOpacity onPress={() => setAvatarModalVisible(false)} style={styles.closeAvatarButton}><Text style={{ color: '#6B6B6B' }}>✕</Text></TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{ backgroundColor: '#111827', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginBottom: 12 }}
              onPress={async () => {
                try {
                  // Permissions first
                  const perm = await ImagePicker.getMediaLibraryPermissionsAsync();
                  if (!perm.granted) {
                    const req = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (!req.granted) { showToast({ message: 'Permission denied', variant: 'error' }); return; }
                  }

                  // Compute mediaTypes compatible across versions
                  const mediaTypes: any = (ImagePicker as any).MediaType?.Images ?? (ImagePicker as any).MediaTypeOptions?.Images;
                  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes, quality: 0.8 } as any);
                  if ((result as any)?.cancelled === true || result.canceled || !result.assets?.length) { return; }

                  // Begin loading state and close modal only after selection
                  setAvatarModalVisible(false);
                  setUploadingAvatar(true);

                  const asset = result.assets[0];
                  const uri = asset.uri;
                  const resp = await fetch(uri);
                  const arrayBuffer = await resp.arrayBuffer();
                  const ext = (asset.fileName?.split('.').pop() || (asset as any).mimeType?.split('/')?.pop() || asset.type?.split('/')?.pop() || 'jpg').toLowerCase();
                  const filename = `${user?.id || 'anon'}/${Date.now()}.${ext}`;
                  const contentType = (asset as any).mimeType || asset.type || (ext === 'png' ? 'image/png' : 'image/jpeg');
                  const { data: upData, error: upErr } = await supabase.storage.from('avatars').upload(filename, arrayBuffer, { upsert: true, contentType });
                  if (upErr || !upData?.path) { showToast({ message: `Upload failed${upErr?.message ? `: ${upErr.message}` : ''}`, variant: 'error' }); setUploadingAvatar(false); return; }
                  const { data: pub } = supabase.storage.from('avatars').getPublicUrl(upData.path);
                  const publicUrl = pub.publicUrl;

                  setProfileImageUrl(publicUrl);
                  const updated = await apiPut('/api/users/profile', { profile_image_url: publicUrl });
                  await AsyncStorage.setItem('profile_cache_v1', JSON.stringify(updated)).catch(()=>{});
                } catch (e: any) {
                  const msg = e?.message || 'Upload error';
                  showToast({ message: msg, variant: 'error' });
                } finally {
                  setUploadingAvatar(false);
                }
              }}
            >
              <Text style={{ color: '#fff', fontSize: 14 }}>Upload from device</Text>
            </TouchableOpacity>
            <View style={styles.avatarGrid}>
              {AVATARS.map((url) => (
                <TouchableOpacity
                  key={url}
                  style={[styles.avatarItem, profileImageUrl === url && styles.avatarItemSelected]}
                  onPress={async () => {
                    try {
                      setProfileImageUrl(url);
                  const updated = await apiPut('/api/users/profile', { profile_image_url: url });
                  await AsyncStorage.setItem('profile_cache_v1', JSON.stringify(updated)).catch(()=>{});
                  setAvatarModalVisible(false);
                    } catch {}
                  }}
                >
                  <Image source={{ uri: url }} style={styles.avatarThumb} />
                </TouchableOpacity>
              ))}
            </View>
            {/* TODO: optional image picker from device in future; for now presets only */}
          </View>
        </View>
      </Modal>

      {/* Country Picker Modal */}
      <Modal
        visible={countryPickerVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCountryPickerVisible(false)}
      >
        <View style={styles.modalOverlayAvatar}>
          <View style={styles.avatarSheet}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#1C1C1C' }}>Select country</Text>
              <TouchableOpacity onPress={() => setCountryPickerVisible(false)} style={styles.closeAvatarButton}><Text style={{ color: '#6B6B6B' }}>✕</Text></TouchableOpacity>
            </View>
            {COUNTRIES.map((c) => (
              <TouchableOpacity
                key={c.code}
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}
                onPress={() => { setSelectedCountry(c); setCountryPickerVisible(false); }}
              >
                <Text style={{ fontSize: 20, marginRight: 10 }}>{c.flag}</Text>
                <Text style={{ fontSize: 14, color: '#1C1C1C' }}>{c.name}  <Text style={{ color: '#6B7280' }}>({c.dial})</Text></Text>
              </TouchableOpacity>
            ))}
          </View>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    color: "#1E1E1E"
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  keyboardActiveContent: {
    paddingBottom: 40, // Reduced padding as the button is now outside the ScrollView
  },
  keyboardAvoidView: {
    flex: 1,
  },
  subHeader: {
    fontSize: 12,
    color: '#303030',
    marginBottom: 24,
    marginTop: 8,
  },
  imageContainer: {
    alignItems: 'flex-start',
    marginVertical: 16,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
  },
  avatarLoadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 60,
    width: 120,
    height: 120,
  },
  editIcon: {
    position: 'absolute',
    left: 80,
    bottom: 0,
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 8,
  },
  label: {
    fontSize: 12,
    color: '#303030',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    height: 56,
    width: '100%',
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 16,
    borderRadius: 16,
    borderColor: "#DCDCDC",
    borderWidth: 1,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "400"
  },
  phoneInputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
    height: 56,
    borderRadius: 16,
    borderColor: "#DCDCDC",
    borderWidth: 1,
    overflow: "hidden"
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 12,
    // marginRight: 2,
    height: 56,
    width: 80,
  },
  flagEmoji: {
    fontSize: 24,
    marginRight: 4,
  },
  arrowDown: {
    fontSize: 10,
    color: '#555',
    marginLeft: 4,
  },
  phoneInput: {
    flex: 1,
    height: 56,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 16,
    fontSize: 12,
    fontWeight: "400"
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
    marginTop: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlayAvatar: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  avatarSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  closeAvatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#CACACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarItem: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatarItemSelected: {
    borderColor: '#1C1C1C',
  },
  avatarThumb: {
    width: '100%',
    height: '100%',
  },
});

// Simple preset avatars
const AVATARS = [
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_11.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_35.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/bear_09.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/bauhaus_32.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/figma_17.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/badger_09.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/paint_16.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memoji_26.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memoji_17.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memoji_19.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memoji_23.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memoji_07.png',
];

// Minimal country list and E.164 normalization
const COUNTRIES = [
  { name: 'United States', code: 'US', dial: '+1', flag: '🇺🇸' },
  { name: 'Nigeria', code: 'NG', dial: '+234', flag: '🇳🇬' },
  { name: 'United Kingdom', code: 'GB', dial: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', dial: '+1', flag: '🇨🇦' },
];

function toE164(dial: string, localDigits: string) {
  const digits = String(localDigits || '').replace(/[^0-9]/g, '');
  const dialDigits = dial.replace(/[^0-9]/g, '');
  if (!digits) return '';
  return `+${dialDigits}${digits}`;
}
