import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { useBoundStore } from '@/store/store';
import FBAuthForm from '@/fragments/Login/FbAuthForm';
import RoleForm from '@/components/forms/RoleForm';

export default function Login(){
  const user = useBoundStore((state) => state.user); // Subscribe to user state changes
  return(
    <SafeAreaView>
      <View>
        {!user && <FBAuthForm/>}
        {user && <RoleForm/>}
      </View>
    </SafeAreaView>
  );
}
