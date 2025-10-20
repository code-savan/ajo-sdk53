import React, { useEffect, useState } from 'react';
import { NavigationContainer, LinkingOptions, createNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Import screens
import SplashScreenComponent from './screens/splash/SplashScreen';
import WelcomeScreen from './screens/welcome/WelcomeScreen';
import LoginScreen from './screens/login/LoginScreen';
import RegisterScreen from './screens/signup/SignupScreen';
import VerifyEmailScreen from './screens/verify-email/VerifyEmailScreen';
import SetPinScreen from './screens/onboarding/SetPinScreen';
import MainScreen from './screens/main/MainScreen';
import GroupsScreen from './screens/groups/GroupsScreen';
import WalletScreen from './screens/wallet/WalletScreen';
import ProfileScreen from './screens/profile/ProfileScreen';

// Import other screens as needed
import AllGroupsScreen from './screens/groups/AllGroupsScreen';
import GroupDetailScreen from './screens/groups/GroupDetailScreen';
import AllMembersScreen from './screens/groups/AllMembersScreen';
import MakeDepositScreen from './screens/groups/MakeDepositScreen';
import GroupFundedScreen from './screens/groups/GroupFundedScreen';
import CreateGroupScreen from './screens/groups/CreateGroupScreen';
import GroupCreatedScreen from './screens/groups/GroupCreatedScreen';
import RecentActivitiesScreen from './screens/activities/RecentActivitiesScreen';
import ActivityDetailScreen from './screens/activities/ActivityDetailScreen';
import NotificationsScreen from './screens/notifications/NotificationsScreen';
import FundWalletScreen from './screens/wallet/FundWalletScreen';
import WithdrawFundsScreen from './screens/wallet/WithdrawFundsScreen';
import BankTransferDetailsScreen from './screens/wallet/BankTransferDetailsScreen';
import CardPaymentScreen from './screens/wallet/CardPaymentScreen';
import WalletFundedScreen from './screens/wallet/WalletFundedScreen';
import TransactionsScreen from './screens/wallet/TransactionsScreen';
import TransactionDetailScreen from './screens/wallet/TransactionDetailScreen';
import WalletAndPaymentScreen from './screens/profile/WalletAndPaymentScreen';
import AccountInfoScreen from './screens/profile/AccountInfoScreen';
import SecurityScreen from './screens/profile/SecurityScreen';
import NotificationSettingsScreen from './screens/profile/NotificationSettingsScreen';
import SupportHelpScreen from './screens/profile/SupportHelpScreen';
import PrivacyPolicyScreen from './screens/profile/PrivacyPolicyScreen';
import TermsConditionsScreen from './screens/profile/TermsConditionsScreen';
import ChangePinScreen from './screens/profile/ChangePinScreen';
import TwoFactorAuthScreen from './screens/profile/TwoFactorAuthScreen';
import VerifyAccountScreen from './screens/profile/VerifyAccountScreen';
import NotificationDetailScreen from './screens/notifications/NotificationDetailScreen';
import InviteLandingScreen from './screens/groups/InviteLandingScreen';
import LinkAccountScreen from './screens/profile/LinkAccountScreen';
import CreditScoreScreen from './screens/profile/CreditScoreScreen';
import SupportTicketScreen from './screens/profile/SupportTicketScreen';

// Import contexts
import { SupabaseAuthProvider, useAuth } from './contexts/SupabaseAuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { supabase } from './lib/supabase';
import { apiGet } from './lib/api';
import { ToastProvider } from './contexts/ToastContext';
import { StripeProvider } from '@stripe/stripe-react-native';

// Navigation types
export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  VerifyEmail: {
    contactInfo: string;
    verificationType: 'email' | 'phone';
    fullName?: string;
    password?: string;
    isSignupFlow?: boolean;
  };
  SetPin: {
    fullName?: string;
    password?: string;
  };
  MainTabs: { screen?: string };
  FundWallet: undefined;
  WithdrawFunds: undefined;
  BankTransferDetails: {
    payment_intent_id?: string;
    instructions?: any;
    amount_cents?: number;
    currency?: string;
  } | undefined;
  CardPayment: { amount_cents: number; currency?: string } | undefined;
  WalletFunded: { payment_intent_id?: string; amount_cents?: number; currency?: string } | undefined;
  Transactions: undefined;
  TransactionDetail: { txn: any } | undefined;
  Wallet: undefined;
  WalletAndPayment: undefined;
  LinkAccount: undefined;
  CreateGroup: undefined;
  GroupCreated: undefined;
  AllGroups: undefined;
  AllMembers: undefined;
  RecentActivities: undefined;
  ActivityDetail: { activity: { person: string; type: string; amount: string; } };
  Notifications: undefined;
  GroupDetail: {
    groupName: string;
    groupId: string;
    amount?: string;
    memberCount?: number;
    monthlyContribution?: string;
    date?: string;
  };
  MakeDeposit: undefined;
  GroupFunded: { amount?: string; groupName?: string };
  NotificationSettings: undefined;
  AccountInfo: undefined;
  Security: undefined;
  SupportHelp: undefined;
  PrivacyPolicy: undefined;
  TermsConditions: undefined;
  ChangePin: undefined;
  TwoFactorAuth: undefined;
  VerifyAccount: undefined;
  NotificationDetail: { notification: { id: string; title: string; message: string; type: string; } };
  InviteLanding: { code?: string } | undefined;
  CreditScore: undefined;
  SupportTicket: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Groups: undefined;
  Wallet: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

// Show notifications when app is foregrounded (updated API)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // iOS: show a banner and list entry; Android treats these similarly
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }) as any,
});

// Configure deep linking
const linking = {
  prefixes: [Linking.createURL('/'), 'ajo://'],
  config: {
    screens: {
      Welcome: 'auth/callback',
      InviteLanding: {
        path: 'invite',
        parse: {
          code: (code: string) => code,
        },
      },
    },
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hide tab bar - using custom component
      }}
    >
      <Tab.Screen name="Home" component={MainScreen} />
      <Tab.Screen name="Groups" component={GroupsScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Navigation component with authentication logic
function AppNavigator() {
  const { session, isLoading, isInSignupFlow } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Splash');
  const [hasSetInitialRoute, setHasSetInitialRoute] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<keyof RootStackParamList | null>(null);
  const [mustVerify, setMustVerify] = useState(false);

  // Listen for notifications and responses (debug and navigation)
  useEffect(() => {
    const subReceived = Notifications.addNotificationReceivedListener((n: any) => {
      console.log('Notification received (fg):', n.request.content);
    });
    const subResponse = Notifications.addNotificationResponseReceivedListener((resp: any) => {
      try {
        const data = resp?.notification?.request?.content?.data || {};
        const notification = {
          id: data?.notification_id,
          title: data?.title,
          message: data?.message,
          type: data?.type,
          data,
          created_at: data?.created_at,
        };
        if (notification.id) {
          if (navigationRef.isReady()) {
            // Build a stack so back button works: MainTabs -> NotificationDetail
            navigationRef.reset({ index: 1, routes: [
              { name: 'MainTabs' as any },
              { name: 'NotificationDetail' as any, params: { notification } as any }
            ] as any });
          }
        } else {
          console.log('Notification response missing id; ignoring deep link');
        }
      } catch (e) {
        console.warn('Failed to handle notification response', e);
      }
    });
    return () => {
      subReceived.remove();
      subResponse.remove();
    };
  }, []);

  // Initialize app (show splash ~3s, then decide route)
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        // Decide: if user has any stored session/token, go to Login, else Welcome
        let goTo: keyof RootStackParamList = 'Welcome';
        try {
          const { data } = await supabase.auth.getSession();
          const storedAny = await AsyncStorage.getItem('sb-cpvgznbnczuqzmyvaxdo-auth-token');
          if (data?.session?.access_token || storedAny) {
            goTo = 'Login';
          }
        } catch {}
        setPendingRoute(goTo);
        setAppIsReady(true);
      } finally {
        // Hide splash after deciding route; actual navigation happens on onReady
        await SplashScreen.hideAsync();
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Check if user has PIN when session exists (kept for future flows)
  useEffect(() => {
    const checkUserPin = async () => {
      if (session?.user?.id) {
        try {
          const { data } = await supabase
            .from('users')
            .select('pin_hash')
            .eq('id', session.user.id)
            .single();
          setHasPin(!!data?.pin_hash);
        } catch (error) {
          setHasPin(false);
        }
      } else {
        setHasPin(null);
      }
    };
    checkUserPin();
  }, [session]);

  // Fetch verification status when session changes
  useEffect(() => {
    const load = async () => {
      try {
        if (session?.user?.id) {
          const profile = await apiGet('/api/users/profile');
          setMustVerify(!profile?.is_verified);
        } else {
          setMustVerify(false);
        }
      } catch {
        setMustVerify(false);
      }
    };
    load();
  }, [session]);

  // Redirect to Login on sign-out
  useEffect(() => {
    if (!navigationRef.isReady()) return;
    const current = navigationRef.getCurrentRoute()?.name as keyof RootStackParamList | undefined;
    if (!session?.user && current !== 'Login') {
      navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  }, [session]);

  // Redirect based on verification status once navigation is ready
  useEffect(() => {
    if (!navigationRef.isReady()) return;
    const current = navigationRef.getCurrentRoute()?.name as keyof RootStackParamList | undefined;
    if (mustVerify && current !== 'VerifyAccount') {
      navigationRef.reset({ index: 0, routes: [{ name: 'VerifyAccount' }] });
    } else if (!mustVerify && current === 'VerifyAccount') {
      navigationRef.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    }
  }, [mustVerify]);

  // Determine initial route (fallback, not strictly needed after pendingRoute)
  const determineInitialRoute = (): keyof RootStackParamList => {
    return 'Welcome';
  };

  // Don't return null for auth loading to avoid blank screen

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onReady={() => {
        if (pendingRoute && navigationRef.isReady()) {
          navigationRef.reset({ index: 0, routes: [{ name: pendingRoute }] });
          setPendingRoute(null);
        }
      }}
    >
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Auth screens */}
        <Stack.Screen name="Splash" component={SplashScreenComponent} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        <Stack.Screen name="SetPin" component={SetPinScreen} />
        <Stack.Screen name="VerifyAccount" component={VerifyAccountScreen} />
        {/* Main app */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        {/* Other screens */}
        <Stack.Screen name="InviteLanding" component={InviteLandingScreen} />
        <Stack.Screen name="FundWallet" component={FundWalletScreen} />
        <Stack.Screen name="WithdrawFunds" component={WithdrawFundsScreen} />
        <Stack.Screen name="BankTransferDetails" component={BankTransferDetailsScreen} />
        <Stack.Screen name="CardPayment" component={CardPaymentScreen} />
        <Stack.Screen name="WalletFunded" component={WalletFundedScreen} />
        <Stack.Screen name="Transactions" component={TransactionsScreen} />
        <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="WalletAndPayment" component={WalletAndPaymentScreen} />
        <Stack.Screen name="LinkAccount" component={LinkAccountScreen} />
        <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
        <Stack.Screen name="GroupCreated" component={GroupCreatedScreen} />
        <Stack.Screen name="AllGroups" component={AllGroupsScreen} />
        <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
        <Stack.Screen name="AllMembers" component={AllMembersScreen} />
        <Stack.Screen name="MakeDeposit" component={MakeDepositScreen} />
        <Stack.Screen name="GroupFunded" component={GroupFundedScreen} />
        <Stack.Screen name="RecentActivities" component={RecentActivitiesScreen} />
        <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
        <Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
        <Stack.Screen name="Security" component={SecurityScreen} />
        <Stack.Screen name="SupportHelp" component={SupportHelpScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
        <Stack.Screen name="ChangePin" component={ChangePinScreen} />
        <Stack.Screen name="TwoFactorAuth" component={TwoFactorAuthScreen} />
        <Stack.Screen name="CreditScore" component={CreditScoreScreen} />
        <Stack.Screen name="SupportTicket" component={SupportTicketScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SupabaseAuthProvider>
        <LoadingProvider>
          <ToastProvider>
            <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''} urlScheme="ajo">
              <AppNavigator />
            </StripeProvider>
          </ToastProvider>
        </LoadingProvider>
      </SupabaseAuthProvider>
    </SafeAreaProvider>
  );
}
