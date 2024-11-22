import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  customMarker: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    width: 300,
    position: 'relative',
    bottom: -6,
  },
  labelMarker: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'black',
    position: 'absolute',
    left: 170,
    zIndex: 1000,
  },
});
