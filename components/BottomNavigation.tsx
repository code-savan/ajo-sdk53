import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Home, Users, Wallet, User } from 'lucide-react-native';

const BottomNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const isRouteActive = (routeName: string) => {
    return route.name === routeName;
  };

  const getIconColor = (routeName: string) => {
    return isRouteActive(routeName) ? '#000000' : '#9ca3af';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Home')}
      >
        <Home
          size={24}
          color={getIconColor('Home')}
          strokeWidth={isRouteActive('Home') ? 2 : 1.5}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Groups')}
      >
        <Users
          size={24}
          color={getIconColor('Groups')}
          strokeWidth={isRouteActive('Groups') ? 2 : 1.5}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Wallet')}
      >
        <Wallet
          size={24}
          color={getIconColor('Wallet')}
          strokeWidth={isRouteActive('Wallet') ? 2 : 1.5}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Profile')}
      >
        <User
          size={24}
          color={getIconColor('Profile')}
          strokeWidth={isRouteActive('Profile') ? 2 : 1.5}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 40,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  }
});

export default BottomNavigation;
