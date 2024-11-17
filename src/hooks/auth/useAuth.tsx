import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useBoundStore } from '@/store/store';
import { useLocation } from '../user/useLocation';
import { useCallback } from 'react';
import BackgroundJob from 'react-native-background-actions';
import { mapFirebaseUserToUserData } from '@/utils/common';
import authService, { AuthPayload } from '@/services/auth/auth.service';
import Config from 'react-native-config';
import { GeoPoint } from '@react-native-firebase/firestore';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';

export function useAuth() {
  const { clearUser, setProfile, user, setLocationPermissions } = useBoundStore.getState();
  const { stopWatchingPosition } = useLocation();
  const { getLocation } = useLocation();

  // const { locationPermissions } = useAccessPermission();

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
      console.log('Google Sign-In Error:', error);
      throw error;
    }
  };

  const onLogin = async (data: any) => {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      setLocationPermissions(granted ? 'granted' : 'denied');
      if(granted){
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
        const profile =  { role: dataAuth?.role, location: dataAuth?.location, name: dataAuth?.name };

        useBoundStore.setState({ profile: profile });
        return profile;
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
    } catch (error) {
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
      console.log('Sign-Out Error:', error);
      throw error;
    }
  };

  const onAuthStateChanged = async (userData: FirebaseAuthTypes.User | null) => {
    const mappedUserData = mapFirebaseUserToUserData(userData);
    if (mappedUserData) {
      useBoundStore.getState().setUser(mappedUserData);
    }
  };

  const setUserOffline = useCallback(async ({ isBackgroundJob = false }:{isBackgroundJob?:boolean}) => {
    const task = async () => {
      if(user){
        setTimeout(() => {
          authService.setOffline({ user: user, payload: { isOnline: false } });
          setProfile(null);
        },  1000 * Number(Config.BACKGROUND_TASK_TIMEOUT));
      }
    };

    const options = {
      taskName: 'BackgroundSync', // Use a fixed task name for now
      taskTitle: 'Syncing Data',
      taskDesc: 'Syncing your app data in the background',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      taskTimeout: 1000 * 60 * 15, // 15 minutes
      forceAllow: true,
    };

    try {
      if(isBackgroundJob){
        console.log('Background task started');
        await BackgroundJob.start(task, options);
        await BackgroundJob.stop();
        console.log('Background task stoped');
      }else{
        if(user){
          authService.setOffline({ user: user, payload: { isOnline: false } });
          setProfile(null);
        }
      }
    } catch (error) {
      console.log('Error starting background task:', error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { onGoogleSignIn, onLogout, onAuthStateChanged, setUserOffline, onLogin };
}
