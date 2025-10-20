import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ChevronLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGet, apiPut } from '../../lib/api';
import { apiPost } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

// Define navigation prop types
interface NotificationSettingsScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'NotificationSettings'>;
}

const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({ navigation }) => {
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [smsAlerts, setSmsAlerts] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const { showToast } = useToast();

  const handleGoBack = () => {
    navigation.goBack();
  };

  React.useEffect(() => {
    const load = async () => {
      const cached = await AsyncStorage.getItem('profile_cache_v1');
      if (cached) {
        try {
          const p = JSON.parse(cached);
          if (typeof p.push_notifications === 'boolean') setPushNotifications(p.push_notifications);
          if (typeof p.email_notifications === 'boolean') setEmailNotifications(p.email_notifications);
          if (typeof p.sms_alerts === 'boolean') setSmsAlerts(p.sms_alerts);
        } catch {}
      }
      const fresh = await apiGet('/api/users/profile').catch(()=>null);
      if (fresh) {
        if (typeof fresh.push_notifications === 'boolean') setPushNotifications(fresh.push_notifications);
        if (typeof fresh.email_notifications === 'boolean') setEmailNotifications(fresh.email_notifications);
        if (typeof fresh.sms_alerts === 'boolean') setSmsAlerts(fresh.sms_alerts);
        await AsyncStorage.setItem('profile_cache_v1', JSON.stringify(fresh)).catch(()=>{});
      }
    };
    load();
  }, []);

  const persist = async (changes: Partial<{ push_notifications: boolean; email_notifications: boolean; sms_alerts: boolean }>) => {
    try {
      setSaving(true);
      const updated = await apiPut('/api/users/profile', changes);
      await AsyncStorage.setItem('profile_cache_v1', JSON.stringify(updated)).catch(()=>{});
      showToast({ message: 'Preferences updated', variant: 'success' });
    } finally { setSaving(false); }
  };

  const togglePushNotifications = () => {
    const next = !pushNotifications;
    setPushNotifications(next);
    persist({ push_notifications: next });
  };

  const toggleEmailNotifications = () => {
    const next = !emailNotifications;
    setEmailNotifications(next);
    persist({ email_notifications: next });
  };

  const toggleSmsAlerts = () => {
    const next = !smsAlerts;
    setSmsAlerts(next);
    persist({ sms_alerts: next });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notification</Text>
      </View>

      <Text style={styles.description}>
        Customize how and when you receive app alerts and updates.
      </Text>

      <View style={styles.option}>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Push notification</Text>
          <Text style={styles.optionDescription}>Stay updated on payments, contributions, and group activity in real-time.</Text>
        </View>
        <Switch
          onValueChange={togglePushNotifications}
          value={pushNotifications}
        />
      </View>

      {/* Removed test registration button for production */}

      <View style={styles.option}>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Email Notifications</Text>
          <Text style={styles.optionDescription}>Receive detailed updates, confirmations, and reminders right in your inbox</Text>
        </View>
        <Switch
          onValueChange={toggleEmailNotifications}
          value={emailNotifications}
        />
      </View>

      <View style={styles.option}>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>SMS Alerts</Text>
          <Text style={styles.optionDescription}>Quick, real-time updates delivered straight to your phone.</Text>
        </View>
        <Switch
          onValueChange={toggleSmsAlerts}
          value={smsAlerts}
        />
      </View>
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
});

export default NotificationSettingsScreen;
