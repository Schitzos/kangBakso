import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useLocation } from '@/app/hooks/access/useLocation';
import { useBoundStore } from '@/app/stateManagement/store';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInSchemaValidation } from '@/app/components/forms/RoleForm/validation';
import { FirebaseMutation } from '@/infrastructure/network/tanstackAdapter';
import { useAccessPermission } from '@/app/hooks/access/useAccessPermission';
import { useState } from 'react';
import { RootStackParamList } from '@/app/navigation/type';
import AuthCase from '@/core/domains/auth/useCases/AuthCase';
import { GeoPoint } from '@react-native-firebase/firestore';
import { FormDataLogin } from '@/core/domains/auth/entities/auth';

const useLoginViewModel = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const { profile, user } = useBoundStore.getState();
  const { getLocation, stopWatchingPosition } = useLocation();
  const { requestLocationPermission, checkLocationPermission } = useAccessPermission();
  const [isChecked, setIsChecked] = useState(false);
  const authUseCase = AuthCase();

  const handleLogin = async () => {
    return await authUseCase.onGoogleSignIn();
  };

  const onLogin = async (data: FormDataLogin) => {
    const location = await getLocation();
    const payload = {
      name: data.name,
      location: new GeoPoint(location.latitude, location.longitude),
      role: data.role,
      isOnline: true,
      lastOnline: Date.now(),
      email: user?.email ?? '',
    };

    try {
      await authUseCase.onLogin(payload);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const handleLoginForm = FirebaseMutation({
    options: onLogin,
    callback: () => navigation.navigate('Home'),
  });


  const onLogout = async () => {
    return await authUseCase.onLogout(stopWatchingPosition);
  };

  const handleLogoutForm = FirebaseMutation({
    options: onLogout,
    callback: () => navigation.navigate('Login', { refresh: true }),
  });

  const setUserOffline = async ()=>{
    return await authUseCase.setUserOffline(()=>navigation.navigate('Login', { refresh: true }));
  };

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataLogin>({
    defaultValues: {
      name: profile?.name ?? '',
      role: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(signInSchemaValidation),
  });

  const checkLogin = async (data:FormDataLogin) => {
    const granted = await checkLocationPermission();
    const isAllow = await requestLocationPermission() || '';
    return await authUseCase.checkLogin(data, granted, isAllow, ()=>handleLoginForm.mutate(data));
  };

  return {
    handleLogin,
    setUserOffline,
    control,
    handleSubmit,
    errors,
    handleLoginForm,
    handleLogoutForm,
    checkLogin,
    isChecked,
    setIsChecked,
  };
};

export default useLoginViewModel;
