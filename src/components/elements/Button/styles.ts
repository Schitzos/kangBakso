import theme from '@/styles/theme';
import { StyleSheet } from 'react-native';

// Define styles
export const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 56,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // Gap between text and icons
  },
  smallButton: {
    paddingVertical: 0, // Set padding as per the new height
    paddingHorizontal: 10,
  },
  mediumButton: {
    paddingVertical: 0, // Set padding as per the new height
    paddingHorizontal: 15,
  },
  largeButton: {
    paddingVertical: 0, // Set padding as per the new height
    paddingHorizontal: 20,
  },
  label: {
    fontFamily: theme.fonts.regular,
    // No default font weight here, it's set dynamically
  },
  disabled: {
    backgroundColor: theme.colors.neutral100,
  },
});
