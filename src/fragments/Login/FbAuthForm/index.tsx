import Button from '@/components/elements/Button';
import { useAuth } from '@/hooks/auth/useAuth';
import { useAccessPermission } from '@/hooks/user/useAccessPermission';
import { RootStackParamList } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';

export default function FBAuthForm(){
  const {onGoogleSignIn} = useAuth();
  const {permissionStatus, requestLocationPermission} = useAccessPermission();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  const handleLogin = async () => {
    await onGoogleSignIn();
    if(permissionStatus !== 'granted') {
      requestLocationPermission();
    }
    navigation.navigate('Login', { refresh: true });
  };

  return(
    <Button label="Google Sign in" onPress={()=>handleLogin()}/>
  );
}
