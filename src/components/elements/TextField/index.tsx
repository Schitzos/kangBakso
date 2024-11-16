import React, { useRef } from 'react';
import { TextInput, StyleSheet, View, Text, ViewStyle, StyleProp } from 'react-native';
import theme from '@/styles/theme';

interface TextFieldProps {
  label?: string;
  type?: 'password' | 'email' | 'text' | 'number';
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  isFormatNumber?: boolean;
  error?: string; // Add an error prop to handle error messages
  requiredMark?: boolean; // Add requiredMark prop to show asterisk
  numberOfLines?: number;
  disabled?: boolean;
}

/**
 * Format a string value as a number with a dot (.) separator.
 * @param {string} value The string value to be formatted.
 * @returns {string} The formatted string value.
 */
const formatNumber = (value: string) => {
  const numericValue = value.replace(/\D/g, ''); // Remove non-digit characters
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Format the number
};

/**
 * A customizable text field component with features such as:
 * - password visibility toggle
 * - number formatting
 * - error message display
 * - required mark
 *
 * @prop {string} label - The label text for the text field.
 * @prop {'password' | 'email' | 'text' | 'number'} type - The type of the text field.
 * @prop {string} value - The current value of the text field.
 * @prop {(text: string) => void} onChangeText - A callback function to handle text changes.
 * @prop {string} placeholder - The placeholder text for the text field.
 * @prop {StyleProp<ViewStyle>} style - Additional styles for the text field container.
 * @prop {boolean} isFormatNumber - Whether to format the number input. Defaults to true.
 * @prop {string} error - The error message to display below the text field.
 * @prop {boolean} requiredMark - Whether to display an asterisk (*) next to the label. Defaults to false.
 * @prop {number} numberOfLines - The number of lines for the text field. Defaults to 1.
 */
const TextField: React.FC<TextFieldProps> = ({
  label,
  type = 'text',
  value,
  onChangeText = () => {},
  placeholder,
  style,
  isFormatNumber = true,
  error, // Receive the error prop
  requiredMark, // Receive the requiredMark prop
  numberOfLines = 1,
  disabled = false,
}) => {
  const inputRef = useRef<TextInput>(null); // Create a ref for the TextInput

  /**
   * Handle text changes on the text field.
   * @param {string} text The changed text value.
   * If the type is 'number' and isFormatNumber is true, formats the number
   * with a dot (.) separator. Passes the formatted value to the onChangeText
   * callback function.
   */
  const handleChange = (text: string) => {
    let formattedValue = text;

    if (type === 'number' && isFormatNumber) {
      // Format the number only if isFormatNumber is true
      formattedValue = formatNumber(text);
    }

    // Call the onChangeText with the formatted value
    onChangeText(formattedValue);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {requiredMark && <Text style={styles.requiredMark}> *</Text>} {/* Render asterisk if requiredMark is true */}
        </Text>
      )}
      <View style={[
        styles.inputContainer,
        error && styles.inputError,
        { height: 40 * numberOfLines },
        // eslint-disable-next-line react-native/no-inline-styles
        { alignItems: numberOfLines === 1 ? 'center' : 'flex-start' },
      ]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          multiline={numberOfLines !== 1}
          numberOfLines={numberOfLines}
          onChangeText={handleChange} // Call handleChange on text change
          placeholder={placeholder}
          placeholderTextColor="#999"
          keyboardType={type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default'}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          textAlignVertical="center" // Vertically center the text
          readOnly={disabled}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
    color: theme.colors.black,
  },
  requiredMark: {
    color: 'red', // Style for the required asterisk
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: theme.colors.borderColor,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 8,
    justifyContent: 'space-between', // Add this to space out children
  },
  inputError: {
    borderColor: 'red', // Set border color to red for errors
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.black,
    paddingVertical: 0, // Remove vertical padding
  },
  errorText: {
    color: 'red',
    fontSize: 10,
    marginTop: 4,
  },
});

export default TextField;
