import React, { useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length: number;
  disabled?: boolean;
  onComplete?: () => void;
}

export function OTPInput({
  value,
  onChange,
  length,
  disabled = false,
  onComplete
}: OTPInputProps) {
  const inputRefs = useRef<TextInput[]>([]);
  const { width } = Dimensions.get('window');
  const inputWidth = Math.min((width - 48 - (length - 1) * 12) / length, 56);

  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete();
    }
  }, [value, length, onComplete]);

  const handleChangeText = (text: string, index: number) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, '');

    if (numericText.length > 1) {
      // Handle paste operation
      const newValue = numericText.slice(0, length);
      onChange(newValue);

      // Focus the last input or the next empty one
      const nextIndex = Math.min(newValue.length - 1, length - 1);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
    } else {
      // Handle single character input
      const newValue = value.split('');
      newValue[index] = numericText;

      // Fill the array to the current length
      while (newValue.length < index + 1) {
        newValue.push('');
      }

      const result = newValue.join('').slice(0, length);
      onChange(result);

      // Move to next input if character was entered
      if (numericText && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace') {
      if (!value[index] && index > 0) {
        // If current input is empty and backspace is pressed, move to previous input
        inputRefs.current[index - 1]?.focus();
        const newValue = value.split('');
        newValue[index - 1] = '';
        onChange(newValue.join(''));
      } else if (value[index]) {
        // If current input has value, clear it
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
      }
    }
  };

  const renderInputs = () => {
    const inputs = [];

    for (let i = 0; i < length; i++) {
      inputs.push(
        <TextInput
          key={i}
          ref={(ref) => {
            if (ref) {
              inputRefs.current[i] = ref;
            }
          }}
          style={[
            styles.input,
            { width: inputWidth },
            value[i] && styles.inputFilled,
            disabled && styles.inputDisabled,
          ]}
          value={value[i] || ''}
          onChangeText={(text) => handleChangeText(text, i)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
          keyboardType="numeric"
          maxLength={1}
          selectTextOnFocus
          editable={!disabled}
          autoCapitalize="none"
          autoCorrect={false}
          textAlign="center"
          returnKeyType="next"
          blurOnSubmit={false}
        />
      );
    }

    return inputs;
  };

  return (
    <View style={styles.container}>
      {renderInputs()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    backgroundColor: '#FFF',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  inputFilled: {
    borderColor: '#0D0D0D',
    backgroundColor: '#F8F8F8',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#999',
    borderColor: '#E0E0E0',
  },
});
