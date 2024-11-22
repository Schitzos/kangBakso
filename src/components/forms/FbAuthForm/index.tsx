import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Button from '@/components/elements/Button';
import { useAuth } from '@/hooks/auth/useAuth';
import { RootStackParamList } from '@/navigation/types';

import GoogleIcon from '@assets/icon/icon-google.svg';
import crashlytics from '@react-native-firebase/crashlytics';

export default function FBAuthForm() {
  const { onGoogleSignIn } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  const handleLogin = async () => {
    try {
      await onGoogleSignIn();
      navigation.navigate('Login', { refresh: true });
    } catch (error) {
      crashlytics().log(`Error ${error as Error}`);
      crashlytics().recordError(error as Error);
      console.error('Google Sign-In failed:', error);
    }
  };

  return (
    <Button
      label="Google Sign in"
      onPress={handleLogin}
      size="large"
      leftIcon={GoogleIcon}
    />
  );
}
