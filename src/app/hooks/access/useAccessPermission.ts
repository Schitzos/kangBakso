import {  useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import crashlytics from '@react-native-firebase/crashlytics';
import { useBoundStore } from '@/app/stateManagement/store';

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
      crashlytics().log(`Error ${error as Error}`);
      crashlytics().recordError(error as Error);
      console.warn(error);
      setLocationPermissions('denied');
    }
  };

  const checkLocationPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        setLocationPermissions(granted ? 'granted' : 'denied');
        return granted;
      } else {
        const authStatus = await Geolocation.requestAuthorization('whenInUse');
        if (authStatus === 'granted') {
          setLocationPermissions('granted');
          return true;
        } else {
          setLocationPermissions('denied');
          return false;
        }
      }
    } catch (error) {
      crashlytics().log(`Error ${error as Error}`);
      crashlytics().recordError(error as Error);
      console.warn('ini', error);
      setLocationPermissions('denied');
      return false;
    }
  }, [setLocationPermissions]);

  return { locationPermissions, requestLocationPermission, checkLocationPermission };
}
