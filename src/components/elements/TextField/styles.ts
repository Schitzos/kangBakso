import theme from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
    color: theme.colors.black,
    fontFamily: theme.fonts.regular,
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
    fontFamily: theme.fonts.regular,
  },
  errorText: {
    color: 'red',
    fontSize: 10,
    marginTop: 4,
  },
});
