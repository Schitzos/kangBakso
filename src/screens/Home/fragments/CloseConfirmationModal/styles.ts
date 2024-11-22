import theme from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    // paddingHorizontal: 16,
  },
  map: {
    flex: 1,
    marginBottom: 1,
    ...StyleSheet.absoluteFillObject,
  },
  btnCancel: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
});
