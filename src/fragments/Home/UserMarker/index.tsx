import React, { useEffect, useRef, useState } from 'react';
import { Marker } from 'react-native-maps';
import { useBoundStore } from '@/store/store';
import Geolocation from 'react-native-geolocation-service';
import { useAccessPermission } from '@/hooks/user/useAccessPermission';
import { useLocation } from '@/hooks/user/useLocation';
import userService from '@/services/user/user.service';
import { UserLocation } from '@/type/User/type';
import IconBuyer from '@assets/icon/Icon-buyer.svg';
import IconSeller from '@assets/icon/Icon-seller.svg';
import { View } from 'react-native';
import TextView from '@/components/elements/TextView';
import { styles } from './styles';

export default function UserMarker() {
  const { requestLocationPermission, locationPermissions } = useAccessPermission();
  const { watchPosition } = useLocation();
  const { user, profile } = useBoundStore((state) => state);
  const [locations, setLocations] = useState<UserLocation[]>([]);
  const [myLocation, setMyLocation] = useState({ latitude: profile?.location.latitude, longitude: profile?.location.longitude });
  const unsubscribeRef = useRef<() => void | undefined>();

  useEffect(() => {
    const init = async () => {
      if (locationPermissions !== 'granted') {
        await requestLocationPermission();
      }
    };
    if (user && profile?.role === 'Buyer') {
      unsubscribeRef.current = userService.subscribeSellerLocation(setLocations);
    }

    if (user && profile?.role === 'Seller') {
      watchPosition(user, setMyLocation);
      unsubscribeRef.current = userService.subscribeBuyerLocation(setLocations);
    }
    init();

    return () => {
      unsubscribeRef.current?.();
      Geolocation.stopObserving();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Marker
        coordinate={{ latitude: myLocation.latitude!, longitude: myLocation.longitude! }}
        title={profile?.name}
        description={`Online ${profile?.role}`}
      >
        <View style={styles.customMarker}>
          {profile?.role === 'Buyer' && <IconBuyer width={40} height={40}/>}
          {profile?.role === 'Seller' && <IconSeller width={40} height={40}/>}
        </View>
      </Marker>
      {locations.map((location) => (
        <Marker
          key={location.id}
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
        >
          {/* <View> */}
          <View style={styles.customMarker}>
            {profile?.role === 'Buyer' && <IconSeller width={40} height={40}/>}
            {profile?.role === 'Seller' && <IconBuyer width={40} height={40}/>}
            <View style={styles.labelMarker}>
              <TextView>{location.name}</TextView>
            </View>
          </View>
        </Marker>
      ))}
    </>
  );
}

