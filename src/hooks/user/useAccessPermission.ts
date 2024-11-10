import { useBoundStore } from '@/store/store';
import {  useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export function useAccessPermission() {
  const {locationPermissions, setLocationPermissions} = useBoundStore((state) => state);
  const requestLocationPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'android' && locationPermissions !== 'granted') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setLocationPermissions('granted');
          return 'granted';
        } else {
          setLocationPermissions('denied');
          return 'denied';
        }
      } else {
        const granted = await Geolocation.requestAuthorization('whenInUse');
        if (granted === 'granted') {
          setLocationPermissions('granted');
          return 'granted';
        } else {
          setLocationPermissions('denied');
          return 'denied';
        }
      }
    } catch (error) {
      console.warn(error);
      setLocationPermissions('denied');
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { locationPermissions, requestLocationPermission };
}
