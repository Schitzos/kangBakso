import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export function setupNetInfoListener() {
  return NetInfo.addEventListener(networkState => {
    if (!networkState.isConnected) {
      Alert.alert(
        'No Internet Connection',
        'Please check your internet connection and try again.',
        [{ text: 'OK', onPress: () => console.log('asd') }],
      );
    }
  });
}
