import { StyleSheet } from 'react-native';
import theme from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    zIndex: 1000,
  },
  dropdown: {
    minHeight: 40,
    borderWidth: 1,
    zIndex: 500,
    borderColor: theme.colors.borderColor,
  },
  dropdownLabel: {
    color: theme.colors.black,
    fontSize: 14,
    fontWeight: '400',
    zIndex: 0,
  },
  dropdownItem: {
    borderWidth: 1,
    borderTopWidth: 0,
    zIndex: 1000,
    borderColor: theme.colors.borderColor,
  },
  dropdownArrow: {
    tintColor: theme.colors.primary,
  },
  picker: {
    fontSize: 12,
    width: '100%',
    height: 32,
    backgroundColor: 'red',
  },
  pickerItem: {
    color: theme.colors.primary,
    fontSize: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 10,
    marginTop: 4,
  },
});
