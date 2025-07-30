import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronDown, CheckCircle2, X, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

// Interface for saved card data
interface SavedCard {
  cardNumber: string;
  expiry: string;
  cvv: string;
  lastFourDigits: string;
}

export default function FundWalletScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'Card' | null>(null);
  const [amount, setAmount] = useState('$100');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [showSavedCards, setShowSavedCards] = useState(false);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [isCardFormValid, setIsCardFormValid] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [canSaveCard, setCanSaveCard] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Load saved cards from AsyncStorage on component mount
  useEffect(() => {
    const loadSavedCards = async () => {
      try {
        const storedCards = await AsyncStorage.getItem('savedCards');
        if (storedCards) {
          const parsedCards = JSON.parse(storedCards);
          setSavedCards(parsedCards);

          // Auto-select the first card if there are saved cards
          if (parsedCards.length > 0) {
            setSelectedCardIndex(0);
          }
        }
      } catch (error) {
        console.error('Error loading saved cards:', error);
      }
    };

    loadSavedCards();
  }, []);

  // Validate card form fields whenever they change
  useEffect(() => {
    // Check if all fields are filled properly
    const isValid =
      cardNumber.replace(/\s/g, '').length === 16 &&
      expiry.length === 5 &&
      cvv.length === 3;

    setIsCardFormValid(isValid);
    setCanSaveCard(isValid);
  }, [cardNumber, expiry, cvv]);

  const handleProceed = async () => {
    if (paymentMethod === 'Bank Transfer') {
      navigation.navigate('BankTransferDetails');
    } else if (paymentMethod === 'Card') {
      // Show confirmation modal
      setModalVisible(true);
    }
  };

  const handleSaveCard = async () => {
    if (isCardFormValid && !savedCards.some(card => card.cardNumber === cardNumber)) {
      try {
        const lastFourDigits = cardNumber.replace(/\s/g, '').slice(-4);
        const newCard: SavedCard = {
          cardNumber,
          expiry,
          cvv,
          lastFourDigits
        };

        // Save to existing cards
        const updatedCards = [...savedCards, newCard];
        await AsyncStorage.setItem('savedCards', JSON.stringify(updatedCards));
        setSavedCards(updatedCards);
        setSelectedCardIndex(updatedCards.length - 1);

        // Hide the form and show saved cards
        setShowAddCardForm(false);
        setShowSavedCards(true);

        // Reset form fields
        setCardNumber('');
        setExpiry('');
        setCvv('');
        setSaveCard(false);
      } catch (error) {
        console.error('Error saving card:', error);
      }
    }
  };

  const selectPaymentMethod = (method: 'Bank Transfer' | 'Card') => {
    setPaymentMethod(method);
    setShowPaymentOptions(false);

    if (method === 'Card') {
      if (savedCards.length > 0) {
        setShowSavedCards(true);
        setShowAddCardForm(false);

        // Select first card by default
        selectSavedCard(savedCards[0], 0);
      } else {
        // If no saved cards, show the add card form
        setShowAddCardForm(true);
        setShowSavedCards(false);
      }
    } else {
      // For bank transfer, hide card-related UI
      setShowSavedCards(false);
      setShowAddCardForm(false);
    }
  };

  const selectSavedCard = (card: SavedCard, index: number) => {
    setCardNumber(card.cardNumber);
    setExpiry(card.expiry);
    setCvv(card.cvv);
    setSelectedCardIndex(index);
    setIsCardFormValid(true);
  };

  const handleAddNewCard = () => {
    setShowSavedCards(false);
    setShowAddCardForm(true);
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setIsCardFormValid(false);
    setSaveCard(false);
    setSelectedCardIndex(null);
  };

  // Format card number with spaces
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = '';

    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += cleaned[i];
    }

    return formatted;
  };

  // Format expiry date with slash
  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;

    if (cleaned.length > 2) {
      formatted = cleaned.substring(0, 2) + ' / ' + cleaned.substring(2);
    }

    return formatted;
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted.slice(0, 19)); // Limit to 16 digits + 3 spaces
  };

  const handleExpiryChange = (text: string) => {
    const formatted = formatExpiry(text);
    setExpiry(formatted.slice(0, 5)); // Format: MM/YY
  };

  const getFormattedTotalAmount = () => {
    try {
      // Remove '$' and convert to number
      const numAmount = parseFloat(amount.replace('$', ''));
      return `$${numAmount.toFixed(2)}`;
    } catch (e) {
      return amount;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fund wallet</Text>
        {/* <View style={styles.headerSpacer} /> */}
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>Fund your wallet</Text>
          <Text style={styles.subtitle}
            >Add money to your wallet to start secure payments and
            contributions.
          </Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Enter amount</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="$100"
              keyboardType="decimal-pad"
              defaultValue="$100"
              onChangeText={(text) => setAmount(text.startsWith('$') ? text : `$${text}`)}
            />
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Payment method</Text>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => {
              setShowPaymentOptions(!showPaymentOptions);
              Keyboard.dismiss();
            }}
          >
            <Text style={styles.paymentMethod}>
              {paymentMethod || 'Select payment method'}
            </Text>
            <ChevronDown width={16} height={16} color="#000000" />
          </TouchableOpacity>

          {showPaymentOptions && (
            <View style={styles.paymentOptions}>
              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => selectPaymentMethod('Bank Transfer')}
              >
                <Text style={styles.paymentOptionText}>Bank Transfer</Text>
              </TouchableOpacity>
              <View style={styles.optionDivider} />
              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => selectPaymentMethod('Card')}
              >
                <Text style={styles.paymentOptionText}>Debit card</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {paymentMethod === 'Card' && (
          <>
            {showSavedCards && savedCards.length > 0 && (
              <View style={styles.savedCardsContainer}>
                <Text style={styles.savedCardsTitle}>Saved Cards</Text>

                {savedCards.map((card, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.savedCardItem, selectedCardIndex === index && styles.selectedCardItem]}
                    onPress={() => selectSavedCard(card, index)}
                  >
                    <View style={styles.savedCardInfo}>
                      <Text style={styles.savedCardLabel}>•••• •••• •••• {card.lastFourDigits}</Text>
                      <Text style={styles.savedCardExpiry}>{card.expiry}</Text>
                    </View>
                    <View style={styles.cardActions}>
                      <View style={styles.cardTypeIcon}>
                        <Text style={styles.cardTypeText}>VISA</Text>
                      </View>
                      {selectedCardIndex === index && (
                        <CheckCircle2
                          width={20}
                          height={20}
                          color="#04A73E"
                          style={styles.selectedCardIcon}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={styles.addNewCardButton}
                  onPress={handleAddNewCard}
                >
                  <View style={styles.addNewCardContent}>
                    <Plus width={16} height={16} color="#000000" style={{marginRight: 8}} />
                    <Text style={styles.addNewCardText}>Add new card</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {showAddCardForm && (
              <View style={styles.cardFormContainer}>
                <View style={styles.cardFormHeader}>
                  <Text style={styles.cardFormTitle}>Enter card info</Text>
                </View>

                <View style={styles.cardInputContainer}>
                  <Text style={styles.cardInputLabel}>Card number</Text>
                  <TextInput
                    style={styles.cardInput}
                    placeholder="0000 0000 0000 0000"
                    keyboardType="number-pad"
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                    maxLength={19}
                  />
                </View>

                <View style={styles.cardRowContainer}>
                  <View style={styles.cardExpiryContainer}>
                    <Text style={styles.cardInputLabel}>Exp.</Text>
                    <TextInput
                      style={styles.cardExpiryInput}
                      placeholder="MM / YY"
                      keyboardType="number-pad"
                      value={expiry}
                      onChangeText={handleExpiryChange}
                      maxLength={5}
                    />
                  </View>

                  <View style={styles.cardCvvContainer}>
                    <Text style={styles.cardInputLabel}>CVV</Text>
                    <TextInput
                      style={styles.cardCvvInput}
                      placeholder="000"
                      keyboardType="number-pad"
                      value={cvv}
                      onChangeText={(text) => setCvv(text.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3}
                      secureTextEntry
                    />
                  </View>
                </View>

                <View style={styles.saveCardContainer}>
                  <View style={styles.saveCardRow}>
                    <Text style={styles.saveCardText}>Save card for future use</Text>
                    <Switch
                      value={saveCard}
                      onValueChange={setSaveCard}
                      trackColor={{ false: '#F2F2F2', true: '#E6E6E6' }}
                      thumbColor={saveCard ? '#000000' : '#FFFFFF'}
                      disabled={!isCardFormValid}
                    />
                  </View>

                  {saveCard && (
                    <TouchableOpacity
                      style={[styles.saveCardButton, !canSaveCard && styles.disabledButton]}
                      onPress={handleSaveCard}
                      disabled={!canSaveCard}
                    >
                      <Text style={[styles.saveCardButtonText, !canSaveCard && styles.disabledButtonText]}>Save Card</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {!showAddCardForm && savedCards.length === 0 && (
              <View style={styles.noCardsContainer}>
                <Text style={styles.noCardsText}>No saved cards yet.</Text>
                <TouchableOpacity
                  style={styles.addFirstCardButton}
                  onPress={handleAddNewCard}
                >
                  <View style={styles.addNewCardContent}>
                    <Plus width={16} height={16} color="#000000" style={{marginRight: 8}} />
                    <Text style={styles.addNewCardText}>Add new card</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.proceedButton,
              (!paymentMethod ||
              (paymentMethod === 'Card' && showAddCardForm && !isCardFormValid))
              && styles.disabledButton
            ]}
            onPress={handleProceed}
            disabled={!paymentMethod || (paymentMethod === 'Card' && showAddCardForm && !isCardFormValid)}
          >
            <Text style={styles.proceedButtonText}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Payment Confirmation Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modalContainer}
        backdropOpacity={0.4}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Confirm Payment</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <X width={24} height={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <View style={styles.sheetBody}>
            <View style={styles.sheetRow}>
              <Text style={styles.sheetLabel}>Transaction type</Text>
              <Text style={styles.sheetValue}>Fund</Text>
            </View>
            <View style={styles.sheetRow}>
              <Text style={styles.sheetLabel}>Amount</Text>
              <Text style={styles.sheetValue}>{amount}</Text>
            </View>
            <View style={styles.sheetRow}>
              <Text style={styles.sheetLabel}>Payment method</Text>
              <Text style={styles.sheetValue}>{paymentMethod === 'Card' ? 'Debit card' : paymentMethod}</Text>
            </View>
            <View style={styles.sheetDivider} />
            <View style={styles.sheetRow}>
              <Text style={styles.sheetLabel}>Total amount</Text>
              <Text style={styles.sheetValue}>{getFormattedTotalAmount()}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.confirmPaymentButton}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate('WalletFunded');
            }}
          >
            <Text style={styles.confirmPaymentButtonText}>Confirm payment</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 12,
    color: '#928F8B',
    lineHeight: 24,
    paddingRight: 20,
    fontWeight: '400'
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    color: '#4D4845',
    marginBottom: 8,
    fontWeight: '400',
  },
  inputContainer: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderColor: "#DCDCDC",
    borderStyle: "solid",
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '400',
  },
  paymentMethod: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '400',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  proceedButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  disabledButtonText: {
    color: '#888888',
  },
  paymentOptions: {
    position: 'absolute',
    top: 84,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    zIndex: 100,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  paymentOptionText: {
    fontSize: 14,
    color: '#000000',
  },
  optionDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  cardFormContainer: {
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  cardFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardFormTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  saveCardContainer: {
    marginTop: 20,
  },
  saveCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  saveCardText: {
    fontSize: 14,
    color: '#000000',
  },
  saveCardButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveCardButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  cardInputContainer: {
    marginBottom: 16,
  },
  cardInputLabel: {
    fontSize: 12,
    color: '#ABABAB',
    marginBottom: 8,
  },
  cardInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000000',
  },
  cardRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardExpiryContainer: {
    flex: 1,
    marginRight: 16,
  },
  cardExpiryInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000000',
  },
  cardCvvContainer: {
    flex: 1,
  },
  cardCvvInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000000',
  },
  savedCardsContainer: {
    marginBottom: 24,
  },
  savedCardsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 12,
  },
  savedCardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedCardItem: {
    borderColor: '#04A73E',
    borderWidth: 1,
  },
  savedCardInfo: {
    flex: 1,
  },
  savedCardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  savedCardExpiry: {
    fontSize: 12,
    color: '#928F8B',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTypeIcon: {
    backgroundColor: '#F2F2F2',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  selectedCardIcon: {
    marginLeft: 4,
  },
  cardTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
  },
  addNewCardButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: '#F6F6F6',
  },
  addNewCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewCardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  addFirstCardButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 12,
    marginTop: 16,
    backgroundColor: '#F6F6F6',
  },
  noCardsContainer: {
    marginTop: 16,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
  },
  noCardsText: {
    fontSize: 14,
    color: '#928F8B',
    marginBottom: 16,
  },
  // Modal styles
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  sheetContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  sheetBody: {
    marginBottom: 24,
  },
  sheetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  sheetLabel: {
    fontSize: 14,
    color: '#ABABAB',
    fontWeight: '400',
  },
  sheetValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  sheetDivider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: '#EEEEEE',
    marginVertical: 16,
  },
  confirmPaymentButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmPaymentButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
