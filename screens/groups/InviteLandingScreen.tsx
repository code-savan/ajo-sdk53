import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { apiPost } from '../../lib/api';

type RouteP = RouteProp<RootStackParamList, 'InviteLanding'>;

export default function InviteLandingScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteP>();
  const code = (route.params as any)?.code;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const accept = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!code) { setError('Invalid invite'); setLoading(false); return; }
        const res = await apiPost('/api/groups/invites/accept', { invite_code: code });
        setAccepted(true);
        // Navigate to GroupDetail after short delay if group_id returned
        const gid = (res as any)?.group_id || (res as any)?.data?.group_id;
        setTimeout(() => {
          if (gid) (navigation as any).navigate('GroupDetail' as any, { groupId: gid, groupName: 'Group' } as any);
          else navigation.goBack();
        }, 1200);
      } catch (e: any) {
        setError('Unable to accept invite');
      } finally {
        setLoading(false);
      }
    };
    accept();
  }, [code]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {loading ? (
          <>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.text}>Accepting invite…</Text>
          </>
        ) : error ? (
          <>
            <Text style={styles.text}>{error}</Text>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
              <Text style={styles.btnText}>Go back</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.text}>{accepted ? 'Invite accepted!' : 'Done'}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  text: { marginTop: 16, color: '#1E1E1E' },
  btn: { marginTop: 16, backgroundColor: '#000', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  btnText: { color: '#fff' },
});
