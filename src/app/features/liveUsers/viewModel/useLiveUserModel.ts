import { useLocation } from '@/app/hooks/user/useLocation';
import { RootStackParamList } from '@/app/navigation/types';
import { useBoundStore } from '@/app/stateManagement/store';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler } from 'react-native';


const useLiveUserModel = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const { user, profile } = useBoundStore.getState();
  const doubleBackToExitPressedOnce = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getLocation } = useLocation();
  const [defaultLocation, setDefaultLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

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


  return{
    isModalOpen,
    setIsModalOpen,
    doubleBackToExitPressedOnce,
    handleHardwareBackPress,
    defaultLocation,
  };
};

export default useLiveUserModel;
