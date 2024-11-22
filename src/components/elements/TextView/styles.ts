import theme from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  view: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    color: theme.colors.black,
    marginBottom: 0,
    width: 'auto',
    fontFamily: theme.fonts.regular,
  },
});
