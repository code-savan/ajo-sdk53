import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

export default function TransactionsScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedDateFilter, setSelectedDateFilter] = useState('All dates');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All transactions');

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Mock transaction data based on the screenshot - adding more data to ensure scrolling works properly
  const transactions = [
    {
      id: 1,
      month: 'Mar 2025',
      transactions: [
        { id: 1, type: 'Deposit', category: 'Contribution', amount: '$100.0', time: '12:45pm', isPositive: false },
        { id: 2, type: 'Pickup', category: 'Contribution', amount: '$1000', time: 'Yesterday', isPositive: true },
        { id: 3, type: 'Deposit', category: 'Contribution', amount: '$100.0', time: '12:45pm', isPositive: false },
        { id: 4, type: 'Deposit', category: 'Contribution', amount: '$100.0', time: '12:45pm', isPositive: false },
        { id: 5, type: 'Withdrawal', category: 'Wallet', amount: '$19.99', time: 'Feb 11', isPositive: false },
      ]
    },
    {
      id: 2,
      month: 'Feb 2025',
      transactions: [
        { id: 6, type: 'Deposit', category: 'Contribution', amount: '$100.0', time: '12:45pm', isPositive: false },
        { id: 7, type: 'Pickup', category: 'Contribution', amount: '$1000', time: 'Yesterday', isPositive: true },
        { id: 8, type: 'Deposit', category: 'Contribution', amount: '$100.0', time: '12:45pm', isPositive: false },
        { id: 9, type: 'Deposit', category: 'Contribution', amount: '$100.0', time: '12:45pm', isPositive: false },
        { id: 10, type: 'Withdrawal', category: 'Wallet', amount: '$19.99', time: 'Feb 11', isPositive: false },
      ]
    },
    {
      id: 3,
      month: 'Jan 2025',
      transactions: [
        { id: 11, type: 'Deposit', category: 'Contribution', amount: '$100.0', time: '12:45pm', isPositive: false },
        { id: 12, type: 'Pickup', category: 'Contribution', amount: '$1000', time: 'Jan 25', isPositive: true },
        { id: 13, type: 'Deposit', category: 'Contribution', amount: '$100.0', time: '12:45pm', isPositive: false },
        { id: 14, type: 'Deposit', category: 'Contribution', amount: '$100.0', time: '12:45pm', isPositive: false },
        { id: 15, type: 'Withdrawal', category: 'Wallet', amount: '$19.99', time: 'Jan 11', isPositive: false },
      ]
    },
    {
      id: 4,
      month: 'Dec 2024',
      transactions: [
        { id: 16, type: 'Deposit', category: 'Contribution', amount: '$100.0', time: '12:45pm', isPositive: false },
        { id: 17, type: 'Pickup', category: 'Contribution', amount: '$1000', time: 'Dec 28', isPositive: true },
        { id: 18, type: 'Deposit', category: 'Contribution', amount: '$100.0', time: '12:45pm', isPositive: false },
        { id: 19, type: 'Deposit', category: 'Contribution', amount: '$100.0', time: '12:45pm', isPositive: false },
        { id: 20, type: 'Withdrawal', category: 'Wallet', amount: '$19.99', time: 'Dec 11', isPositive: false },
      ]
    }
  ];

  const renderTransactionItem = ({ item: transaction }) => (
    <View style={styles.transaction}>
      <View style={styles.transactionIconContainer}>
        {transaction.isPositive ? (
          <ChevronUp width={24} height={24} color="#4D4845" />
        ) : (
          <ChevronDown width={24} height={24} color="#4D4845" />
        )}
      </View>
      <View style={styles.transactionInfo}>
        <View>
          <Text style={styles.transactionName}>{transaction.type}</Text>
          <Text style={styles.transactionType}>{transaction.category}</Text>
        </View>
        <View style={styles.transactionDetails}>
          <Text
            style={[
              styles.transactionAmount,
              transaction.isPositive ? styles.positive : styles.negative
            ]}
          >
            {transaction.amount}
          </Text>
          <Text style={styles.transactionTime}>{transaction.time}</Text>
        </View>
      </View>
    </View>
  );

  const renderMonthSection = ({ item: monthGroup }) => (
    <View>
      <Text style={styles.monthLabel}>{monthGroup.month}</Text>
      <FlatList
        data={monthGroup.transactions}
        renderItem={renderTransactionItem}
        keyExtractor={item => item.id.toString()}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction history</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.filterWrapper}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>{selectedDateFilter}</Text>
            <ChevronDown width={16} height={16} color="#000000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>{selectedTypeFilter}</Text>
            <ChevronDown width={16} height={16} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderMonthSection}
        keyExtractor={item => item.id.toString()}
        style={styles.transactionsContainer}
        contentContainerStyle={styles.transactionsContentContainer}
      />
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  headerSpacer: {
    width: 24,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 30,
    padding: 4,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '400',
  },
  transactionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  transactionsContentContainer: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    marginVertical: 16,
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
    marginBottom: 4,
  },
  negative: {
    color: '#FF6262',
  },
  positive: {
    color: '#04A73E',
  },
  transactionTime: {
    fontSize: 12,
    color: '#928F8B',
  },
});
