import { useAccessPermission } from '@/app/hooks/user/useAccessPermission';
import { useLocation } from '@/app/hooks/user/useLocation';
import { useBoundStore } from '@/app/stateManagement/store';
import { RootStackParamList } from '@/core/domains/routesStack/entities/routes';
import userService from '@/services/user/user.service';
import { UserLocation } from '@/type/User/type';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import { AnimatedRegion } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const useLiveUserModel = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const doubleBackToExitPressedOnce = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getLocation } = useLocation();
  const [defaultLocation, setDefaultLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const { requestLocationPermission, locationPermissions } = useAccessPermission();
  const { watchPosition } = useLocation();
  const { user, profile } = useBoundStore((state) => state);
  const [locations, setLocations] = useState<UserLocation[]>([]);

  const animatedRegion = useRef(
    new AnimatedRegion({
      latitude: profile?.location?.latitude || 0,
      longitude: profile?.location?.longitude || 0,
      latitudeDelta: 0.01, // Initial map zoom
      longitudeDelta: 0.01, // Initial map zoom
    })
  ).current;


  const handleHardwareBackPress = useCallback(() => {
    if (doubleBackToExitPressedOnce.current) {
      setIsModalOpen(true);
      return true;
    }
    doubleBackToExitPressedOnce.current = true;
    setTimeout(() => {
      doubleBackToExitPressedOnce.current = false;
    }, 2000);
    return true;

  }, []);


  useEffect(() => {
    if(!user || !profile) {
      navigation.navigate('Login', { refresh: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, user]);

  useEffect(() => {
    const init = async () => {
      const location = await getLocation();
      setDefaultLocation((prev) => ({
        ...prev,
        ...location,
      }));
    };

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleHardwareBackPress
      );
      return () => {
        backHandler.remove();
      };
    }, [handleHardwareBackPress])
  );

  useEffect(() => {
    const init = async () => {
      if (locationPermissions !== 'granted') {
        await requestLocationPermission();
      }
    };

    if (user) {
      if (profile?.role === 'Buyer') {
        userService.subscribeSellerLocation(setLocations);
      }

      if (profile?.role === 'Seller') {
        watchPosition(user, (newLocation) => {
          animateMarker(newLocation.latitude, newLocation.longitude);
        });
        userService.subscribeBuyerLocation(setLocations);
      }
    }

    init();

    return () => {
      Geolocation.stopObserving();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animateMarker = (latitude: number, longitude: number) => {
    const newCoordinate = { latitude, longitude };

    animatedRegion.timing({
      ...newCoordinate,
      duration: 1000, // Smooth transition duration
      useNativeDriver: false,
      toValue: 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
    }).start();
  };


  return{
    isModalOpen,
    setIsModalOpen,
    doubleBackToExitPressedOnce,
    handleHardwareBackPress,
    defaultLocation,
    locations,
    setLocations,
    animatedRegion,
    profile,
  };
};

export default useLiveUserModel;
