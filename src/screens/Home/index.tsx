import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, {  PROVIDER_GOOGLE } from 'react-native-maps';
import { useBoundStore } from '@/store/store';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import UserMarker from '@/fragments/Home/UserMarker';
import Loading from '@/components/elements/Loader';
import { useLocation } from '@/hooks/user/useLocation';
import theme from '@/styles/theme';
import IconClose from '@assets/icon/icon-close.svg';
import BottomSheet from '@gorhom/bottom-sheet';
import TextView from '@/components/elements/TextView';
import BottomSheetModal from '@/components/elements/BottomSheet';

export default function Home() {
  const { getLocation } = useLocation();
  const { user, profile } = useBoundStore((state) => state);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Login'>>();
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

  if(defaultLocation.latitude === 0 && defaultLocation.longitude === 0) {
    return <Loading/>;
  }

  return (
    <SafeAreaView>
      <View style={styles.mapContainer}>
        <TouchableOpacity style={{ zIndex: isModalOpen ? -1 : 1, position: 'absolute', top: 32, right: 16, backgroundColor: theme.colors.white, borderRadius: 100, padding: 8 }} onPress={()=>setIsModalOpen(true)}>
          <IconClose height={24} width={24}/>
        </TouchableOpacity>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={defaultLocation}
          zoomEnabled={true}
          zoomControlEnabled={true}
          followsUserLocation={false}
          loadingEnabled={true}
          loadingIndicatorColor={theme.colors.primary}
          loadingBackgroundColor={theme.colors.neutral}
          showsMyLocationButton={true}
          showsCompass={true}
        >
          <UserMarker/>
        </MapView>
      </View>
      {isModalOpen &&
      <BottomSheetModal onClose={() => setIsModalOpen(false)}>
        <TextView>asdsd</TextView>
      </BottomSheetModal>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    height: '100%',
  },
  map: {
    flex: 1,
    marginBottom: 1,
    ...StyleSheet.absoluteFillObject,
  },
});
