import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, SafeAreaView, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useBoundStore } from '@/store/store';
import { useLocation } from '@/hooks/user/useLocation';
import { RootStackParamList } from '@/navigation/types';

import UserMarker from '@/screens/Home/fragments/UserMarker';
import CloseConfirmationModal from '@/screens/Home/fragments/CloseConfirmationModal';
import Loading from '@/components/elements/Loader';

import theme from '@/styles/theme';
import IconClose from '@assets/icon/icon-close.svg';

import { styles } from './styles';

export default function Home() {
  const { user, profile } = useBoundStore((state) => state);
  const doubleBackToExitPressedOnce = useRef(false);
  const { getLocation } = useLocation();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Login'>>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultLocation, setDefaultLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

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

  useEffect(() => {
    if(!user || !profile) {
      navigation.navigate('Login', { refresh: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, user]);

  const handleHardwareBackPress = useCallback(() => {
    if (doubleBackToExitPressedOnce.current) {
      setIsModalOpen(true);
      return true;
    }
    doubleBackToExitPressedOnce.current = true;
    setTimeout(() => {
      doubleBackToExitPressedOnce.current = false;
    }, 2000);
    return doubleBackToExitPressedOnce.current;
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

  if(defaultLocation.latitude === 0 && defaultLocation.longitude === 0) {
    return <Loading/>;
  }

  return (
    <SafeAreaView>
      <View style={styles.mapContainer}>
        <TouchableOpacity
          style={[styles.btnClose, isModalOpen && styles.btnHide]}
          onPress={() => setIsModalOpen(true)}
        >
          <IconClose height={24} width={24} />
        </TouchableOpacity>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={defaultLocation}
          zoomEnabled
          zoomControlEnabled
          followsUserLocation={false}
          loadingEnabled
          loadingIndicatorColor={theme.colors.primary}
          loadingBackgroundColor={theme.colors.neutral}
          showsMyLocationButton
          showsCompass
        >
          <UserMarker />
        </MapView>
      </View>

      {isModalOpen && <CloseConfirmationModal setIsModalOpen={setIsModalOpen} />}
    </SafeAreaView>
  );
}
