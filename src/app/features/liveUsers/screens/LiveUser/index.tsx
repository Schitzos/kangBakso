import React from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import IconClose from '@assets/icon/icon-close.svg';
import { styles } from './styles';
import Loading from '@/app/components/elements/Loader';
import theme from '@/app/styles/theme';
import UserMarker from '@/app/features/liveUsers/localComponents/UserMarker';
import CloseConfirmationModal from '@/app/features/login/localComponents/CloseConfirmationModal';
import useLiveUserModel from '../../viewModel/useLiveUserModel';

export default function LiveUser() {
  const { isModalOpen, setIsModalOpen, defaultLocation } = useLiveUserModel();

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
