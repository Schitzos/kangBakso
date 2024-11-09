import { useState, useEffect, useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

type LocationPermissionStatus = 'granted' | 'denied' | 'pending';

export function useAccessPermission() {
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus>('pending');

  const requestLocationPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'KangBakso App Location Permission',
            message: 'KangBakso App needs access to your location so you can order Bakso',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionStatus('granted');
        } else {
          setPermissionStatus('denied');
        }
      } else {
        const granted = await Geolocation.requestAuthorization('whenInUse');
        if (granted === 'granted') {
          setPermissionStatus('granted');
        } else {
          setPermissionStatus('denied');
        }
      }
    } catch (error) {
      console.warn(error);
      setPermissionStatus('denied');
    }

  }, []);

  useEffect(() => {
    // Automatically request permission when the hook is first used
    requestLocationPermission();
  }, [requestLocationPermission]);

  return { permissionStatus, requestLocationPermission };
}
