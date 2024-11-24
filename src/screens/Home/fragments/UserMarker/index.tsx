import React, { useEffect, useRef, useState } from 'react';
import { Marker, AnimatedRegion } from 'react-native-maps';
import { useBoundStore } from '@/store/store';
import Geolocation from 'react-native-geolocation-service';
import { useAccessPermission } from '@/hooks/user/useAccessPermission';
import { useLocation } from '@/hooks/user/useLocation';
import userService from '@/services/user/user.service';
import IconBuyer from '@assets/icon/Icon-buyer.svg';
import IconSeller from '@assets/icon/Icon-seller.svg';
import { View } from 'react-native';
import TextView from '@/components/elements/TextView';
import { styles } from './styles';
import { UserLocation } from '@/type/Location/Location';

export default function UserMarker() {
  const { requestLocationPermission, locationPermissions } = useAccessPermission();
  const { watchPosition } = useLocation();
  const { user, profile } = useBoundStore((state) => state);

  const [locations, setLocations] = useState<UserLocation[]>([]);

  // Initialize AnimatedRegion
  const animatedRegion = useRef(
    new AnimatedRegion({
      latitude: profile?.location?.latitude ?? 0,
      longitude: profile?.location?.longitude ?? 0,
      latitudeDelta: 0.01, // Initial map zoom
      longitudeDelta: 0.01, // Initial map zoom
    })
  ).current;

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

  return (
    <>
      {/* Animated marker for the current user's location */}
      <Marker.Animated
        coordinate={{
          latitude: animatedRegion.latitude,
          longitude: animatedRegion.longitude,
        }}
        title={profile?.name}
        description={`Online ${profile?.role}`}
      >
        <View style={styles.customMarker}>
          {profile?.role === 'Buyer' && <IconBuyer width={40} height={40} />}
          {profile?.role === 'Seller' && <IconSeller width={40} height={40} />}
        </View>
      </Marker.Animated>
      {/* Static markers for other users */}
      {locations.map((location) => (
        <Marker
          key={location.id}
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
        >
          <View style={styles.customMarker}>
            {profile?.role === 'Buyer' && <IconSeller width={40} height={40} />}
            {profile?.role === 'Seller' && <IconBuyer width={40} height={40} />}
            <View style={styles.labelMarker}>
              <TextView>{location.name}</TextView>
            </View>
          </View>
        </Marker>
      ))}
    </>
  );
}
