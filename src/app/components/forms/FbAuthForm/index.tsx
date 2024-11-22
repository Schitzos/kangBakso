import React from 'react';
import GoogleIcon from '@assets/icon/icon-google.svg';
import Button from '@components/elements/Button';
import useLoginViewModel from '@/app/features/login/viewModel/useLoginViewModel';

export default function FBAuthForm() {
  const { handleLogin } = useLoginViewModel();

  return (
    <Button
      label="Google Sign in"
      onPress={handleLogin}
      size="large"
      leftIcon={GoogleIcon}
    />
  );
}
