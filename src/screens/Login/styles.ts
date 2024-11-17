import theme from '@/styles/theme';
import { StyleSheet } from 'react-native';

// Define styles
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: 16,
    display: 'flex',
    padding: 24,
    backgroundColor: theme.colors.neutral,
  },
  image: {
    alignItems: 'center',
    marginTop: '50%',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: theme.colors.neutral50,
    borderWidth: 1,
    borderColor: theme.colors.white,
    borderRadius: 16,
    padding: 16,
    minHeight: 106,
  },
});
