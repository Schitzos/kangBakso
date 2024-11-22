import React from 'react';
import { SafeAreaView, View } from 'react-native';
import IconLogin from '@assets/icon/icon-login.svg';
import TextView from '@/app/components/elements/TextView';
import FBAuthForm from '@/app/components/forms/FbAuthForm';
import RoleForm from '@/app/components/forms/RoleForm';
import { useBoundStore } from '@/app/stateManagement/store';
import { styles } from './styles';

export default function Login(){
  const user = useBoundStore((state) => state.user);
  return(
    <>
      <SafeAreaView/>
      <View style={styles.container}>
        <View style={styles.image}>
          <IconLogin width={144} height={144}/>
        </View>
        <View style={styles.userInfo}>
          <TextView fz={24} fw="700">Verifikasi</TextView>
          <TextView fz={12}>Masukkan nama dan role Anda di bawah ini:</TextView>
        </View>
        <View style={styles.formContainer}>
          {!user && <FBAuthForm/>}
          {user && <RoleForm/>}
        </View>
      </View>
    </>
  );
}

