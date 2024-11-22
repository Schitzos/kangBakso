import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/app/navigation/types';
import { useLocation } from '@/app/hooks/user/useLocation';
import { GeoPoint } from '@react-native-firebase/firestore';
import authService, { AuthPayload } from '@/services/auth/auth.service';
import { useBoundStore } from '@/app/stateManagement/store';
import { mapFirebaseUserToUserData } from '@/app/utils/common';
import { useForm } from 'react-hook-form';
import { FormDataLogin } from '@/app/components/forms/RoleForm';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInSchemaValidation } from '@/app/components/forms/RoleForm/validation';
import { FirebaseMutation } from '@/infrastructure/network/tanstackAdapter';
import { useAccessPermission } from '@/app/hooks/user/useAccessPermission';
import { Alert, Linking, Platform } from 'react-native';
import { useState } from 'react';

const useLoginViewModel = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const { clearUser, setProfile, user, profile } = useBoundStore.getState();
  const { getLocation, stopWatchingPosition } = useLocation();
  const  { requestLocationPermission, checkLocationPermission } = useAccessPermission();
  const [isChecked, setIsChecked] = useState(false);

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

  const onGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { data } = response;
        const idToken = data?.idToken;
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth().signInWithCredential(googleCredential);
      }
    } catch (error) {
      crashlytics().log(`Error ${error as Error}`);
      crashlytics().recordError(error as Error);
      console.log('Google Sign-In Error:', error);
      throw error;
    }
  };

  const onLogin = async (data: any) => {
    try {
      const location = await getLocation();
      const payload = {
        name: data.name,
        location: new GeoPoint(location.latitude, location.longitude),
        role: data.role,
        isOnline: true,
        lastOnline: Date.now(),
        email: user?.email,
      };
      const dataAuth = await authService.doAauth(payload as AuthPayload);
      const modProfile =  { role: dataAuth?.role, location: dataAuth?.location, name: dataAuth?.name };

      useBoundStore.setState({ profile: modProfile });
      return modProfile;

    } catch (error) {
      crashlytics().log(`Error ${error as Error}`);
      crashlytics().recordError(error as Error);
      console.log('Login Error:', error);
      throw error;
    }
  };

  const onLogout = async () => {
    try {
      const payload = {
        isOnline: false,
      };
      if(user){
        await authService.setOffline({ user, payload });
      }
      clearUser();
      setProfile(null);
      stopWatchingPosition();
      await auth().signOut();
      await GoogleSignin.signOut();
    } catch (error) {
      crashlytics().log(`Error ${error as Error}`);
      crashlytics().recordError(error as Error);
      console.log('Sign-Out Error:', error);
      throw error;
    }
  };

  const setUserOffline = async ()=>{
    if(user){
      await authService.setOffline({ user, payload: { isOnline: false } });
      setProfile(null);
    }
  };

  const onAuthStateChanged = async (userData: FirebaseAuthTypes.User | null) => {
    const mappedUserData = mapFirebaseUserToUserData(userData);
    if (mappedUserData) {
      useBoundStore.getState().setUser(mappedUserData);
    }
  };

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataLogin>({
    defaultValues: {
      name: profile?.name ?? '',
      role: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(signInSchemaValidation),
  });

  const handleLoginForm = FirebaseMutation({
    options: onLogin,
    callback: () => navigation.navigate('Home'),
  });

  const handleLogoutForm = FirebaseMutation({
    options: onLogout,
    callback: () => navigation.navigate('Login', { refresh: true }),
  });

  const checkLogin = async (data:FormDataLogin) => {
    const granted = await checkLocationPermission();
    if(!granted){
      const isAllow = await requestLocationPermission();
      if(isAllow === 'granted'){
        checkLogin(data);
      }else{
        Alert.alert(
          'Location Permission Needed',
          `Location access is needed to find nearby Bakso ${data.role === 'Seller' ? 'Customers' : 'Vendors'}. Please enable location permissions in settings.`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');  // Opens app settings on iOS
                } else if (Platform.OS === 'android') {
                  Linking.openSettings(); // Opens settings on Android
                }
              },
            },
          ]
        );
      }
    }else{
      handleLoginForm.mutate(data);
    }
  };

  return {
    handleLogin,
    onLogin,
    onLogout,
    setUserOffline,
    onAuthStateChanged,
    onGoogleSignIn,
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
