import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
// Import screens
import SplashScreenComponent from './screens/splash/SplashScreen';
import SignupScreen from './screens/signup/SignupScreen';
import LoginScreen from './screens/login/LoginScreen';
import VerifyEmailScreen from './screens/verify-email/VerifyEmailScreen';
import MainScreen from './screens/main/MainScreen';
import GroupsScreen from './screens/groups/GroupsScreen';
import AllGroupsScreen from './screens/groups/AllGroupsScreen';
import RecentActivitiesScreen from './screens/activities/RecentActivitiesScreen';
import ActivityDetailScreen from './screens/activities/ActivityDetailScreen';
import NotificationsScreen from './screens/notifications/NotificationsScreen';
import WalletScreen from './screens/wallet/WalletScreen';
import FundWalletScreen from './screens/wallet/FundWalletScreen';
import WithdrawFundsScreen from './screens/wallet/WithdrawFundsScreen';
import BankTransferDetailsScreen from './screens/wallet/BankTransferDetailsScreen';
import CardPaymentScreen from './screens/wallet/CardPaymentScreen';
import WalletFundedScreen from './screens/wallet/WalletFundedScreen';
import TransactionsScreen from './screens/wallet/TransactionsScreen';
import WalletAndPaymentScreen from './screens/profile/WalletAndPaymentScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import AccountInfoScreen from './screens/profile/AccountInfoScreen';
import SecurityScreen from './screens/profile/SecurityScreen';
import NotificationSettingsScreen from './screens/profile/NotificationSettingsScreen';
import SupportHelpScreen from './screens/profile/SupportHelpScreen';
import PrivacyPolicyScreen from './screens/profile/PrivacyPolicyScreen';
import TermsConditionsScreen from './screens/profile/TermsConditionsScreen';
import ChangePinScreen from './screens/profile/ChangePinScreen';
import TwoFactorAuthScreen from './screens/profile/TwoFactorAuthScreen';
import CreateGroupScreen from './screens/groups/CreateGroupScreen';
import GroupCreatedScreen from './screens/groups/GroupCreatedScreen';

// Import navigation types
export type RootStackParamList = {
  Splash: undefined;
  Signup: undefined;
  Login: undefined;
  VerifyEmail: undefined;
  MainTabs: { screen?: string };
  FundWallet: undefined;
  WithdrawFunds: undefined;
  BankTransferDetails: undefined;
  CardPayment: undefined;
  WalletFunded: undefined;
  Transactions: undefined;
  Wallet: undefined;
  WalletAndPayment: undefined;
  CreateGroup: undefined;
  GroupCreated: undefined;
  AllGroups: undefined;
  RecentActivities: undefined;
  ActivityDetail: { activity: { person: string; type: string; amount: string; } };
  Notifications: undefined;
  NotificationSettings: undefined;
  AccountInfo: undefined;
  Security: undefined;
  SupportHelp: undefined;
  PrivacyPolicy: undefined;
  TermsConditions: undefined;
  ChangePin: undefined;
  TwoFactorAuth: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Groups: undefined;
  Wallet: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hide the built-in tab bar as we're using our custom component
      }}
    >
      <Tab.Screen
        name="Home"
        component={MainScreen}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsScreen}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // App initialization without fonts for now
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreenComponent} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="FundWallet" component={FundWalletScreen} />
          <Stack.Screen name="WithdrawFunds" component={WithdrawFundsScreen} />
          <Stack.Screen name="BankTransferDetails" component={BankTransferDetailsScreen} />
          <Stack.Screen name="CardPayment" component={CardPaymentScreen} />
          <Stack.Screen name="WalletFunded" component={WalletFundedScreen} />
          <Stack.Screen name="Transactions" component={TransactionsScreen} />
          <Stack.Screen name="WalletAndPayment" component={WalletAndPaymentScreen} />
          <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
          <Stack.Screen name="GroupCreated" component={GroupCreatedScreen} />
          <Stack.Screen name="AllGroups" component={AllGroupsScreen} />
          <Stack.Screen name="RecentActivities" component={RecentActivitiesScreen} />
          <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
          <Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
          <Stack.Screen name="Security" component={SecurityScreen} />
          <Stack.Screen name="SupportHelp" component={SupportHelpScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
          <Stack.Screen name="ChangePin" component={ChangePinScreen} />
          <Stack.Screen name="TwoFactorAuth" component={TwoFactorAuthScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
