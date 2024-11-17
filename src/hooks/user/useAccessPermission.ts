import { useBoundStore } from '@/store/store';
import {  useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export function useAccessPermission() {
  const { locationPermissions, setLocationPermissions } = useBoundStore((state) => state);
  const requestLocationPermission = async () => {
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
        const grantedInUse = await Geolocation.requestAuthorization('whenInUse');
        const grantedAlways = await Geolocation.requestAuthorization('always');
        if (grantedInUse === 'granted' || grantedAlways === 'granted') {
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
  };

  const checkLocationPermission = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      setLocationPermissions(granted ? 'granted' : 'denied');
      return granted;
    } catch (error) {
      console.warn(error);
      setLocationPermissions('denied');
    }
  }, [setLocationPermissions]);

  return { locationPermissions, requestLocationPermission, checkLocationPermission };
}
