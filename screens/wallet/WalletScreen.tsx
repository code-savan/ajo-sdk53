import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import BottomNavigation from '../../components/BottomNavigation';
import { Bell, ChevronDown, ChevronUp, Settings } from 'lucide-react-native';

export default function WalletScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  const handleNotificationsPress = () => {
    navigation.dispatch(CommonActions.navigate('Notifications'));
  };
  
  const handleWalletAndPaymentPress = () => {
    navigation.dispatch(CommonActions.navigate('WalletAndPayment'));
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>My Wallet</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.settingsButton}
                onPress={handleWalletAndPaymentPress}
              >
                <Settings width={22} height={22} color="#4D4845" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.notificationContainer}
                onPress={handleNotificationsPress}
              >
                <Bell width={24} height={24} color="#4D4845" />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Wallet Balance</Text>
            <Text style={styles.balanceAmount}>$5,200.00</Text>
            <View style={styles.pendingContainer}>
              <Text style={styles.pendingText}>Pending Funds: $3,500.00</Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.dispatch(CommonActions.navigate('FundWallet'))}
            >
              <Text style={styles.actionText}>Fund Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.dispatch(CommonActions.navigate('WithdrawFunds'))}
            >
              <Text style={styles.actionText}>Withdraw funds</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionSection}>
            <Text style={styles.transactionTitle}>Transaction history</Text>
            <Text style={styles.transactionSubtitle}>Here are your recent transactions on the app.</Text>

            <View style={styles.transaction}>
              <View style={styles.transactionIconContainer}>
                <ChevronDown width={24} height={24} color="#4D4845" />
              </View>
              <View style={styles.transactionInfo}>
                <View>
                  <Text style={styles.transactionName}>Deposit</Text>
                  <Text style={styles.transactionType}>Contribution</Text>
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionAmount}>$100.0</Text>
                  <Text style={styles.transactionTime}>12:45pm</Text>
                </View>
              </View>
            </View>

            <View style={styles.transaction}>
              <View style={styles.transactionIconContainer}>
                <ChevronUp width={24} height={24} color="#4D4845" />
              </View>
              <View style={styles.transactionInfo}>
                <View>
                  <Text style={styles.transactionName}>Pickup</Text>
                  <Text style={styles.transactionType}>Contribution</Text>
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={[styles.transactionAmount, styles.positive]}>$1000</Text>
                  <Text style={styles.transactionTime}>Yesterday</Text>
                </View>
              </View>
            </View>

            <View style={styles.transaction}>
              <View style={styles.transactionIconContainer}>
                <ChevronDown width={24} height={24} color="#4D4845" />
              </View>
              <View style={styles.transactionInfo}>
                <View>
                  <Text style={styles.transactionName}>Deposit</Text>
                  <Text style={styles.transactionType}>Contribution</Text>
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionAmount}>$100.0</Text>
                  <Text style={styles.transactionTime}>12:45pm</Text>
                </View>
              </View>
            </View>

            <View style={styles.transaction}>
              <View style={styles.transactionIconContainer}>
                <ChevronDown width={24} height={24} color="#4D4845" />
              </View>
              <View style={styles.transactionInfo}>
                <View>
                  <Text style={styles.transactionName}>Deposit</Text>
                  <Text style={styles.transactionType}>Contribution</Text>
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionAmount}>$100.0</Text>
                  <Text style={styles.transactionTime}>12:45pm</Text>
                </View>
              </View>
            </View>

            <View style={styles.transaction}>
              <View style={styles.transactionIconContainer}>
                <ChevronDown width={24} height={24} color="#4D4845" />
              </View>
              <View style={styles.transactionInfo}>
                <View>
                  <Text style={styles.transactionName}>Withdrawal</Text>
                  <Text style={styles.transactionType}>Wallet</Text>
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionAmount}>$19.99</Text>
                  <Text style={styles.transactionTime}>Feb 11</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.dispatch(CommonActions.navigate('Transactions'))}
            >
              <Text style={styles.viewAllText}>View all transactions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80, // Add bottom padding to avoid content being hidden behind the navigation bar
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingsButton: {
    padding: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4D4845',
  },
  notificationContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6262',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#928F8B',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: 'normal',
    color: '#4D4845',
    marginBottom: 20,
  },
  pendingContainer: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  pendingText: {
    fontSize: 12,
    color: '#4D4845',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 48,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  transactionSection: {
    marginBottom: 24,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4D4845',
    marginBottom: 8,
  },
  transactionSubtitle: {
    fontSize: 12,
    color: '#928F8B',
    marginBottom: 24,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  transactionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: "#F4F4F2",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4D4845',
    marginBottom: 4,
  },
  transactionType: {
    fontSize: 12,
    color: '#928F8B',
  },
  transactionDetails: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6262',
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 12,
    color: '#928F8B',
  },
  positive: {
    color: '#04A73E',
  },
  viewAllButton: {
    backgroundColor: '#F2F2F2',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4D4845',
  },
});
