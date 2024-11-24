import { useAccessPermission } from '@/app/hooks/access/useAccessPermission';
import { useLocation } from '@/app/hooks/access/useLocation';
import { useBoundStore } from '@/app/stateManagement/store';
import { RootStackParamList } from '@/app/navigation/type';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import { AnimatedRegion } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import LiveUserUseCase from '@/core/domains/liveUser/useCases/LiveUserUseCase';
import { UserLocation } from '@/core/domains/liveUser/Location';

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
  const liveUserUseCase = LiveUserUseCase();

  const animatedRegion = useRef(
    new AnimatedRegion({
      latitude: profile?.location?.latitude ?? 0,
      longitude: profile?.location?.longitude ?? 0,
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
    const initDefaultLocation = async () => {
      const location = await getLocation();
      setDefaultLocation((prev) => ({
        ...prev,
        ...location,
      }));
    };

    const initMarker = async () => {
      if (locationPermissions !== 'granted') {
        await requestLocationPermission();
      }
    };

    if (user) {
      if (profile?.role === 'Buyer') {
        liveUserUseCase.subscribeSellerLocation(setLocations);
      }

      if (profile?.role === 'Seller') {
        watchPosition(user, (newLocation) => {
          animateMarker(newLocation.latitude, newLocation.longitude);
        });
        liveUserUseCase.subscribeBuyerLocation((setLocations));
      }
    }

    initDefaultLocation();
    initMarker();

    return () => {
      Geolocation.stopObserving();
    };

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
