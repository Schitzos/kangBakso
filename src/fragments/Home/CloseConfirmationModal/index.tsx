import React from 'react';
import {   View } from 'react-native';
import IconConfirmation from '@assets/icon/icon-confirmation.svg';
import { styles } from './styles';
import { useAuth } from '@/app/hooks/auth/useAuth';
import BottomSheetModal from '@/app/components/elements/BottomSheet';
import TextView from '@/app/components/elements/TextView';
import Button from '@/app/components/elements/Button';
import theme from '@/app/styles/theme';
import { useBoundStore } from '@/app/store/store';

export default function CloseConfirmationModal({ setIsModalOpen }:Readonly<{setIsModalOpen:Function}>) {
  const { profile } = useBoundStore.getState();
  const {  setUserOffline } = useAuth();
  return (
    <BottomSheetModal onClose={() => setIsModalOpen(false)} snapPoints={[ '40%', '40%']}>
      <View style={styles.container}>
        <IconConfirmation/>
        <TextView align="center" fz={14}>
            Dengan menutup halaman ini, kamu akan keluar dari pantauan {`${profile?.role === 'Buyer' ? 'Tukang Bakso' : 'Pembeli'}`}
        </TextView>
        <Button
          label="OK"
          onPress={() => setUserOffline()}
          size="large"
          fontWeight="400"
        />
        <Button
          label="Batal"
          onPress={() => setIsModalOpen(false)}
          size="large"
          style={styles.btnCancel}
          labelColor={theme.colors.primary}
          fontWeight="400"
        />
      </View>
    </BottomSheetModal>
  );
}

