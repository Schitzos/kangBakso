import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import MapView, {  PROVIDER_GOOGLE } from 'react-native-maps';
import { useBoundStore } from '@/store/store';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import UserMarker from '@/fragments/Home/Marker';
import Loading from '@/components/elements/Loader';
import { useLocation } from '@/hooks/user/useLocation';

export default function Home() {
  const { getLocation } = useLocation();
  const {user, profile} = useBoundStore((state) => state);
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
      <View>
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={defaultLocation}
            zoomEnabled={true}
            zoomControlEnabled={true}
            followsUserLocation={false}
            loadingEnabled={true}
            showsMyLocationButton={true}
            showsUserLocation={true}
            showsCompass={true}
          >
            <UserMarker/>
          </MapView>
        </View>
      </View>
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
