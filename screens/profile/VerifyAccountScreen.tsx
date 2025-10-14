import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { apiGet, apiPost } from '../../lib/api';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import * as WebBrowser from 'expo-web-browser';
import { ShieldCheck, ExternalLink } from 'lucide-react-native';

export default function VerifyAccountScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { session, signOut, hasPin, isInSignupFlow } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'pending'|'verified'|'no_account'|'unknown'|'in_review'>('unknown');
  const [displayName, setDisplayName] = useState('');
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const loadProfileAndStatus = async () => {
    const profile = await apiGet('/api/users/profile').catch(() => null);
    const nameFromProfile = profile?.full_name || profile?.email || '';
    const nameFromSession = (session?.user as any)?.user_metadata?.full_name || session?.user?.email || '';
    setDisplayName(nameFromProfile || nameFromSession || '');

    const res = await apiGet('/api/kyc/status').catch(()=> null);
    if (res?.is_verified) {
      setStatus('verified');
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } else {
      const st = (res?.status as string | undefined) as typeof status | undefined;
      setStatus(st || 'pending');
    }
  };

  useEffect(() => {
    // If arriving here during signup but PIN not set, redirect to SetPin first
    if (isInSignupFlow && !hasPin) {
      navigation.reset({ index: 0, routes: [{ name: 'SetPin' as any }] });
      return;
    }
    loadProfileAndStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Background polling while pending/in_review
  useEffect(() => {
    if (status === 'pending' || status === 'in_review') {
      if (pollingRef.current) clearInterval(pollingRef.current as any);
      pollingRef.current = setInterval(async () => {
        const res = await apiGet('/api/kyc/status').catch(()=> null);
        if (res?.is_verified) {
          setStatus('verified');
          if (pollingRef.current) clearInterval(pollingRef.current as any);
          navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        } else {
          const st = (res?.status as string | undefined) as typeof status | undefined;
          setStatus(st || 'pending');
        }
      }, 3000);
      return () => {
        if (pollingRef.current) clearInterval(pollingRef.current as any);
      };
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current as any);
    };
  }, [status, navigation]);

  const handleStartVerification = async () => {
    try {
      setLoading(true);
      const data = await apiPost('/api/kyc/start', {});
      const url = data?.url as string | undefined;
      if (url) {
        await WebBrowser.openBrowserAsync(url);
        await loadProfileAndStatus();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(true);
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    } catch {}
  };

  const greetingName = displayName ? `, ${displayName}` : '';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerBlock}>
        <View style={styles.iconWrap}>
          <ShieldCheck width={64} height={64} color="#3B5AFE" />
        </View>
        <Text style={styles.title}>Complete Verification{'\n'}Process.</Text>
        <Text style={styles.subtitle}>To ensure a secure and trusted experience{greetingName}, we need to verify your identity.</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.primaryBtn, loading && { opacity: 0.7 }]} onPress={handleStartVerification} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.primaryContent}>
              <Text style={styles.primaryText}>Verify account</Text>
              <ExternalLink width={16} height={16} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={handleLogout}>
          <Text style={styles.secondaryText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 20, justifyContent: 'space-between' },
  centerBlock: { alignItems: 'center', paddingTop: 80 },
  iconWrap: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { textAlign: 'center', fontSize: 28, lineHeight: 34, color: '#111827', fontWeight: '700', marginBottom: 8 },
  subtitle: { textAlign: 'center', fontSize: 14, color: '#6B7280', marginHorizontal: 6 },
  actions: { paddingBottom: 24 },
  primaryBtn: { backgroundColor: '#111111', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  primaryContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginRight: 6 },
  secondaryBtn: { marginTop: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 16, alignItems: 'center', backgroundColor: '#FFFFFF' },
  secondaryText: { color: '#111827', fontSize: 16, fontWeight: '500' },
});
