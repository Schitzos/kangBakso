import theme from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    height: '100%',
  },
  map: {
    flex: 1,
    marginBottom: 1,
    ...StyleSheet.absoluteFillObject,
  },
  btnClose: {
    position: 'absolute',
    top: 32,
    right: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 100,
    padding: 8,
    zIndex: 1, // Default zIndex
  },
  btnHide: {
    zIndex: -1,
  },

});
