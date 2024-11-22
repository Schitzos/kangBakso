import React from 'react';
import { Marker } from 'react-native-maps';
import IconBuyer from '@assets/icon/Icon-buyer.svg';
import IconSeller from '@assets/icon/Icon-seller.svg';
import { View } from 'react-native';
import { styles } from './styles';
import TextView from '@/app/components/elements/TextView';
import useLiveUserModel from '../../viewModel/useLiveUserModel';

export default function UserMarker() {
  const {  animatedRegion, profile, locations } = useLiveUserModel();
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
