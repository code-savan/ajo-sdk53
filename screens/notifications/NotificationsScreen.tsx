import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle, AlertCircle, InfoIcon, Calendar } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type NotificationsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Avatar image URLs for notification avatars
const femaleAvatarUrl = "https://images.unsplash.com/photo-1543085784-0b3c85b4e8ac?q=80&w=987";
const maleAvatarUrl = "https://images.unsplash.com/photo-1614248793396-944d024ec422?q=80&w=1064";

// Sample notification data
const notifications = [
  {
    id: '1',
    type: 'success',
    title: 'Payment successful',
    message: 'Your payment of $100 to Hawaii Vacation has been processed successfully.',
    time: '2 mins ago',
    read: false
  },
  {
    id: '2',
    type: 'alert',
    title: 'Payment due soon',
    message: 'Your monthly contribution of $100 for Cooking Fees is due in 2 days.',
    time: '1 hour ago',
    read: false
  },
  {
    id: '3',
    type: 'info',
    title: 'Debbie joined your group',
    message: 'Debbie has joined your Hawaii Vacation group.',
    time: 'Yesterday',
    read: true,
    avatar: femaleAvatarUrl
  },
  {
    id: '4',
    type: 'success',
    title: 'Group created',
    message: 'Your TV Prep group has been created successfully.',
    time: '2 days ago',
    read: true
  },
  {
    id: '5',
    type: 'info',
    title: 'Angus joined your group',
    message: 'Angus has joined your Hawaii Vacation group.',
    time: '3 days ago',
    read: true,
    avatar: maleAvatarUrl
  },
  {
    id: '6',
    type: 'alert',
    title: 'Collection time',
    message: 'It\'s your turn to collect funds from the Hawaii Vacation group.',
    time: '5 days ago',
    read: true
  },
  {
    id: '7',
    type: 'calendar',
    title: 'Payment reminder',
    message: 'Your next payment for TV Prep is scheduled for tomorrow.',
    time: '1 week ago',
    read: true
  }
];

export default function NotificationsScreen() {
  const navigation = useNavigation<NotificationsScreenNavigationProp>();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'success':
        return <CheckCircle size={24} color="#04A73E" />;
      case 'alert':
        return <AlertCircle size={24} color="#FF6262" />;
      case 'calendar':
        return <Calendar size={24} color="#2563eb" />;
      case 'info':
      default:
        return <InfoIcon size={24} color="#2563eb" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft color="#000000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {/* <View style={styles.emptyView} /> */}
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>Stay up to date with your recent notifications.</Text>

          <View style={styles.notificationGroup}>
            <Text style={styles.groupTitle}>New</Text>
            {notifications.filter(n => !n.read).map(notification => (
              <TouchableOpacity key={notification.id} style={[styles.notificationItem, !notification.read && styles.unreadItem]}>
                <View style={styles.iconContainer}>
                  {notification.avatar ? (
                    <Image source={{ uri: notification.avatar }} style={styles.avatar} />
                  ) : (
                    getNotificationIcon(notification.type)
                  )}
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationTime}>{notification.time}</Text>
                  </View>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.notificationGroup}>
            <Text style={styles.groupTitle}>Earlier</Text>
            {notifications.filter(n => n.read).map(notification => (
              <TouchableOpacity key={notification.id} style={styles.notificationItem}>
                <View style={styles.iconContainer}>
                  {notification.avatar ? (
                    <Image source={{ uri: notification.avatar }} style={styles.avatar} />
                  ) : (
                    getNotificationIcon(notification.type)
                  )}
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationTime}>{notification.time}</Text>
                  </View>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1C1C1C',
  },
  emptyView: {
    width: 24, // Same width as back button for balanced centering
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    marginTop: 8,
  },
  notificationGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4D4845',
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: '#F2F2F2',
  },
  unreadItem: {
    backgroundColor: '#F9FAFB',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  notificationTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
});
